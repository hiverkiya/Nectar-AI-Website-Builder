import { projectsRouter } from "@/modules/projects/server/procedure";
import {  createTRPCRouter } from "../init";
import { messagesRouter } from "@/modules/messages/procedures";

export const appRouter=createTRPCRouter({
  messages:messagesRouter,
  projects:projectsRouter,
})
export type AppRouter=typeof appRouter