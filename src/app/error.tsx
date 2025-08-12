'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function ErrorPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-black" />
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-pink-400 opacity-30 blur-3xl dark:bg-pink-700" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-400 opacity-30 blur-3xl dark:bg-indigo-700" />

      <div className="relative z-10 flex max-w-md flex-col items-center rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-lg dark:border-gray-700/20 dark:bg-gray-900/80">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Oops! Something went wrong
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Redirecting you to the homepage in <span className="font-bold">{countdown}</span>...
        </p>
      </div>
    </main>
  );
}
