"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const HomePage = () => {
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("Build started");
      },
    })
  );

  const [value, setValue] = useState("");
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
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ text: "John" })}
      >
        Click on me to generate something
      </Button>
    </div>
  );
};
export default HomePage;
