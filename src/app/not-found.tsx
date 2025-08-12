'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-2 text-3xl font-bold">Something went wrong</h1>
      <p className="mb-4 text-gray-500">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => router.push('/')}
        className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Go Home
      </button>
    </main>
  );
}
