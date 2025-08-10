// components/Loader.tsx
'use client';

import * as React from 'react';

export default function Loader({ size = 48 }: { size?: number }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <span
          className="border-primary absolute inset-0 animate-spin rounded-full border-4 border-t-transparent"
          style={{
            borderWidth: Math.max(size / 12, 3),
          }}
        />
        <span
          className="border-primary/30 absolute inset-1 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-4 border-t-transparent"
          style={{
            borderWidth: Math.max(size / 14, 2),
          }}
        />
      </div>
    </div>
  );
}
