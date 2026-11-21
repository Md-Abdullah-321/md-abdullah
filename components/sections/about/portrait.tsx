"use client";

import { useState } from "react";

/**
 * Portrait slot. A saved photo replaces the frame. Until then the frame
 * stays empty — no initials.
 */
export function AboutPortrait({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(!src);

  if (!failed && src) {
    return (
      <div className="overflow-hidden border border-foreground/20 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="flex aspect-[4/5] w-full items-end border border-foreground/20 bg-white p-4"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgb(16 24 40 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(16 24 40 / 0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
      role="img"
      aria-label="Portrait placeholder"
    >
      <p className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">Portrait</p>
    </div>
  );
}
