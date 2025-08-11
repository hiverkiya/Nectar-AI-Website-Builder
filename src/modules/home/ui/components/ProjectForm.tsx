'use client';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useTRPC } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROJECT_TEMPLATES } from '@/app/(home)/constants';

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: 'Value is required' })
    .max(10000, { message: 'Value is too long' }),
});

export const ProjectForm = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
    },
  });

  const onSelect = (value: string) => {
    form.setValue('value', value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const isPending = createProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  return (
    <Form {...form}>
      <section className="space-y-6">
        <form
          className={cn(
            'bg-sidebar dark:bg-sidebar relative rounded-xl border p-4 pt-1 transition-all',
            isFocused && 'shadow-xs'
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
        <div className="hidden max-w-3xl flex-wrap justify-center gap-2 md:flex">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              size="sm"
              className="dark:bg-sidebar bg-white"
              onClick={() => onSelect(template.prompt)}
            >
              {template.emoji}
              {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
};
