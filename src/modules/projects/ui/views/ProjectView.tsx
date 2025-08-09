"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import MessagesContainer from "../components/MessagesContainer";
import { Suspense } from "react";
import Loader from "@/app/projects/[projectId]/Loader";

interface Props {
    projectId:string
}
export const ProjectView=({projectId}:Props)=>{
   
   
    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                defaultSize={35}
                minSize={20}
                className="flex flex-col min-h-0">
                  <Suspense fallback={<Loader/>}> <MessagesContainer projectId={projectId}/></Suspense>
                </ResizablePanel >
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={65} minSize={50}>
                  TODO Preview
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}