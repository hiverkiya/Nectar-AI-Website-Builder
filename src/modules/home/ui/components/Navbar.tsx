'use client';

import { Button } from '@/components/ui/button';
import { useScroll } from '@/hooks/useScroll';
import { cn } from '@/lib/utils';
import { UserControl } from '@/modules/projects/ui/components/UserControl';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
  const isScrolled = useScroll();
  return (
    <nav
      className={cn(
        'fix top-0 right-0 left-0 z-50 border-b border-transparent bg-transparent p-4 transition-all duration-200',
        isScrolled && 'bg-background border-border'
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Nectar" width={24} height={24} />
          <span className="text-lg font-semibold">Nectar</span>
        </Link>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserControl showName />
        </SignedIn>
      </div>
    </nav>
  );
};
