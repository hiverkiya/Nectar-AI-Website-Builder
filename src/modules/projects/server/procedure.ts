import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/database';
import { consumeCredits } from '@/lib/usage';
import { protectedProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { generateSlug } from 'random-word-slugs';
import z from 'zod';

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: 'ID is required' }),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });
      if (!existingProject) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project NOT FOUND',
        });
      }
      return existingProject;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: 'Need a prompt' })
          .max(10000, { message: 'Prompt exceed the set limit' }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          //checking if something failed, maybe a DB call went down
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Something went wrong' });
        } else {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: "You've ran out of credits",
          });
        }
      }
      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: 'kebab',
          }),
          messages: {
            create: {
              content: input.value,
              role: 'USER',
              type: 'RESULT',
            },
          },
        },
      });

      await inngest.send({
        name: 'nectar-ai-agent/run',
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });
      return createdProject;
    }),
});
