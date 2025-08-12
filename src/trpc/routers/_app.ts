import { projectsRouter } from '@/modules/projects/server/procedure';
import { createTRPCRouter } from '../init';
import { messagesRouter } from '@/modules/messages/procedures';
import { usageRouter } from '@/modules/usage/server/procedures';

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  usage: usageRouter,
});
export type AppRouter = typeof appRouter;
