'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import MessagesContainer from '../components/MessagesContainer';
import { Suspense, useState } from 'react';
import Loader from '@/app/projects/[projectId]/Loader';
import { Fragment } from '@/generated/prisma';
import { ProjectHeader } from '../components/ProjectHeader';
import { FragmentWeb } from '../components/FragmentWeb';

import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { CodeIcon, CrownIcon, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CodeView } from '../components/CodeView/CodeView';
import { FileExplorer } from '../components/FileExplorer/FileExplorer';
interface Props {
  projectId: string;
}
export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<'preview' | 'code'>('preview');
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20} className="flex min-h-0 flex-col">
          <ProjectHeader projectId={projectId} />
          <Suspense fallback={<Loader />}>
            {' '}
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as 'preview' | 'code')}
          >
            <div className="m-1 flex w-full items-center gap-x-2 border-b p-2">
              <TabsList className="h-8 gap-x-2 rounded-md border p-0.5">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="mr-1 ml-auto flex items-center gap-x-2">
                <Button asChild size="sm" variant="default">
                  <Link href="/pricing">
                    <CrownIcon />
                    Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as { [path: string]: string }} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
