import { Sandbox } from '@e2b/code-interpreter';
import { createAgent, createNetwork, createTool, openai, type Tool } from '@inngest/agent-kit';
import { inngest } from './client';
import { z } from 'zod';
import { getSandbox, lastAssistantTextMessageContent } from './utils';
import { PROMPT } from '@/prompt';
import { prisma } from '@/lib/database';

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const nectarAgentFunction = inngest.createFunction(
  { id: 'nectar-ai-website-builder' },
  { event: 'nectar-ai-agent/run' },
  async ({ event, step }) => {
    const sandboxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('nectar-ai-nextjs15'); // Using Antonio's template here, since mine is showing the same output everytime
      return sandbox.sandboxId;
    });
    // You can use gpt-4.1 model OR A LATEST ONE available at https://agentkit.inngest.com/concepts/models, however, that'll exhaust the tokens very fast, keep it for showcasing
    /*
    "gpt-4.5-preview"
  "gpt-4o" 
"chatgpt-4o-latest"
"gpt-4o-mini"
"gpt-4"
"o1"
"o1-preview"
"o1-mini"
"o3-mini"
"gpt-4-turbo"
"gpt-3.5-turbo"
    */
    const codeAgent = createAgent<AgentState>({
      name: 'nectar-code-agent',
      description: 'An expert coding AI agent',
      system: PROMPT,
      model: openai({
        model: 'gpt-4o-mini',
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: 'terminal',
          description: 'Use the terminal to run commands',
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run('terminal', async () => {
              const buffers = { stdout: '', stderr: '' };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout(data: string) {
                    buffers.stdout += data;
                  },
                  onStderr(data: string) {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                );
                return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),

        createTool({
          name: 'createOrUpdateFiles',
          description: 'Create of update files in the sandbox',
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
            /**
             * returns components "/app.tsx":"<p>app page <p>something like this"
             */
            const newFiles = await step?.run('createOrUpdateFiles', async () => {
              try {
                const updateFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updateFiles[file.path] = file.content;
                }
                return updateFiles;
              } catch (e) {
                return 'Error is ' + e;
              }
            });
            if (typeof newFiles === 'object') {
              network.state.data.files = newFiles;
            }
          },
        }),

        createTool({
          name: 'readFiles',
          description: 'Read files from the sandbox',
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run('readFiles', async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                return 'Error ' + e;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes('<task_summary>')) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });
    // We're defining a hard limit for the model to stop
    const network = createNetwork<AgentState>({
      name: 'coding-agent-network',
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) return;
        return codeAgent;
      },
    });
    const result = await network.run(event.data.value);
    const isError =
      !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;
    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run('save-result', async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: 'Error occured',
            role: 'ASSISTANT',
            type: 'ERROR',
          },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,

          content: result.state.data.summary,
          role: 'ASSISTANT',
          type: 'RESULT',
          fragment: {
            create: {
              sandboxUrl,
              title: 'Fragment',
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: 'Fragment',
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
