'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import MessagesContainer from '../components/MessagesContainer';
import { Suspense, useState } from 'react';
import Loader from '@/app/projects/[projectId]/Loader';
import { Fragment } from '@/generated/prisma';
import { ProjectHeader } from '../components/ProjectHeader';
import { FragmentWeb } from '../components/FragmentWeb';

interface Props {
  projectId: string;
}
export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

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
          {!!activeFragment && <FragmentWeb data={activeFragment} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
