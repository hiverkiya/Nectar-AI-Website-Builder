'use client';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const SignInPage = () => {
  const currentTheme = useCurrentTheme();
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <SignIn
            appearance={{
              baseTheme: currentTheme === 'dark' ? dark : undefined,
              elements: {
                cardBox: 'border! shadow-none! rounded-lg!',
              },
            }}
          />
        </div>
      </section>
    </div>
  );
};
export default SignInPage;
