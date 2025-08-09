import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/database";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import z from "zod";

export const projectsRouter=createTRPCRouter({
    getMany:baseProcedure.query(async()=>{
        const projects=await prisma.project.findMany({
            orderBy:{
                updatedAt:"desc"
            }
        })
        return projects
    }),
    create:baseProcedure.input(
        z.object({
            value:z.string().min(1,{message:"Need a prompt"}).max(10000,{message:"Prompt exceed the set limit"})
        })
    ).mutation(async({input})=>{
        const createdProject= await prisma.project.create({
            data:{
                name:generateSlug(2,{
                    format:"camel"
                }),
                messages:{
                    create:{
                        content:input.value,
                        role:"USER",
                        type:"RESULT"
                    }
                }
            }
        })

        await inngest.send({
            name:"nectar-ai-agent/run",
            data:{
                value:input.value,
                projectId:createdProject.id
            }
        })
        return createdProject; 
    })
})