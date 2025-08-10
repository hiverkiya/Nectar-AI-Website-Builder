import Image from 'next/image';
import { useEffect, useState } from 'react';

const ShimmerMessages = () => {
  const messages = [
    'Thinking...',
    'Loading project files...',
    'Generating components...',
    'Analyzing your request...',
    'Building your Next.js app...',
    'Styling with Tailwind...',
    'Integrating Shadcn UI...',
    'Optimizing layout...',
    'Adding final touches...',
    'Almost ready...',
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground animate-pulse text-base">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};
export const MessageLoading = () => {
  return (
    <div className="group flex flex-col px-2 pb-4">
      <div className="mb-2 flex items-center gap-2 pl-2">
        <Image src="/logo.svg" alt="Nectar" width={18} height={18} className="shrink-0" />
        <span className="text-sm font-medium">Nectar</span>
      </div>
      <div className="flex flex-col gap-y-4 pl-8.5">
        <ShimmerMessages />
      </div>
    </div>
  );
};
