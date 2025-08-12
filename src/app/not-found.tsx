'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const router = useRouter();

  // Optional: log error for monitoring
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-3xl font-bold">Something went wrong</h1>
      <p className="mb-4 text-gray-500">{error?.message || 'An unexpected error occurred.'}</p>

      <div className="flex gap-3">
        {reset && (
          <button
            onClick={reset}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => router.push('/')}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Go Home
        </button>
      </div>
    </main>
  );
}
