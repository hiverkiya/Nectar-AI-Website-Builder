import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Usage } from './Usage';
import { useRouter } from 'next/navigation';
interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: 'Value is required' })
    .max(10000, { message: 'Value is too long' }),
});

export const MessageForm = ({ projectId }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.status.queryOptions());
  const showUsage = !!usage;
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
    },
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({
            projectId,
          })
        );
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === 'TOO_MANY_REQUESTS') {
          router.push('/pricing');
        }
      },
    })
  );
  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };

  return (
    <Form {...form}>
      {showUsage && <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />}
      <form
        className={cn(
          'bg-sidebar dark:bg-sidebar relative rounded-xl border p-4 pt-1 transition-all',
          isFocused && 'shadow-xs',
          showUsage && 'rounded-t-none'
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="w-full resize-none border-none bg-transparent pt-4 outline-none"
              placeholder="What Do You Want To Build?"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
            />
          )}
        />

        <div className="flex items-end justify-between gap-x-2 pt-2">
          <div className="text-muted-foreground font-mono text-[10px]">
            <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
              <span>&#9166;</span> Enter
            </kbd>
            &nbsp; To Submit
          </div>

          <Button
            disabled={isButtonDisabled}
            className={cn('size-8 rounded-full', isButtonDisabled && 'bg-muted-foreground')}
          >
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <ArrowUpIcon />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
