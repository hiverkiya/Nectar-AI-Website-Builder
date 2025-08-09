import { projectsRouter } from "@/modules/projects/procedure";
import {  createTRPCRouter } from "../init";
import { messagesRouter } from "@/modules/messages/procedures";

export const appRouter=createTRPCRouter({
  messages:messagesRouter,
  projects:projectsRouter,
})
export type AppRouter=typeof appRouter