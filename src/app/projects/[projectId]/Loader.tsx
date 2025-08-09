// components/Loader.tsx
"use client";

import * as React from "react";

export default function Loader({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <span
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
          style={{
            borderWidth: Math.max(size / 12, 3),
          }}
        />
        <span
          className="absolute inset-1 rounded-full border-4 border-primary/30 border-t-transparent animate-[spin_1.5s_linear_infinite_reverse]"
          style={{
            borderWidth: Math.max(size / 14, 2),
          }}
        />
      </div>
    </div>
  );
}
