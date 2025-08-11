import { CopyCheckIcon, CopyIcon } from 'lucide-react';
import { useState, useMemo, useCallback, Fragment } from 'react';
import { Hint } from '../Hint';
import { Button } from '@/components/ui/button';
import { CodeView } from '../CodeView/CodeView';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { convertFilesToTreeItems } from '@/lib/utils';
import { TreeView } from '../TreeView';
interface FileExplorerProps {
  files: FileCollection;
}

interface FileBreadCrumbProps {
  filePath: string;
}
type FileCollection = { [path: string]: string };
function getLanguageFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension || 'text';
}

const FileBreadCrumb = ({ filePath }: FileBreadCrumbProps) => {
  const pathSegments = filePath.split('/');
  const maxSegments = 3;
  const renderBreadCrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      // show all the segments here
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">{segment}</BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegment = pathSegments[pathSegments.length - 1];
      return (
        <>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{firstSegment}</span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">{lastSegment}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      );
    }
  };
  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadCrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);
  const handleFileSelect = useCallback(
    (filepath: string) => {
      if (files[filepath]) {
        setSelectedFile(filepath);
      }
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [selectedFile, files]);
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView data={treeData} value={selectedFile} onSelect={handleFileSelect} />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="flex h-full w-full flex-col">
            <div className="bg-sidebar flex items-center justify-between gap-x-2 border-b px-4 py-2">
              <FileBreadCrumb filePath={selectedFile} />
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                language={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Select a file
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
