"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const HomePage = () => {

  const [value,setValue]=useState("")
  const trpc = useTRPC();
  const {data:messages}=useQuery(trpc.messages.getMany.queryOptions())
  const createMessage=useMutation(trpc.messages.create.mutationOptions({
    onSuccess:()=>{
      toast.success("Generating build")
    }
  }))
  return (
    <div
      className="flex
     items-center justify-center
     "
    >
      <Input
        placeholder="Enter something to generate"
        className="max-w-3xl border-black p-6 m-4"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value:value })}
      >
        Click on me to generate something
      </Button>
      {JSON.stringify(messages,null,2)}
    </div>
  );
};
export default HomePage;
