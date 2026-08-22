"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProfileImageProps {
  src: string;
  name: string;
  className?: string;
}

function ProfilePlaceholder({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex aspect-[4/5] w-full items-center justify-center rounded-xl border border-border bg-gradient-to-br from-primary/[0.06] via-surface-muted to-primary/[0.03]",
        className
      )}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.08]">
        <span className="font-heading text-2xl font-semibold text-primary/50">
          {initials}
        </span>
      </div>
    </div>
  );
}

export function ProfileImage({ src, name, className }: ProfileImageProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return <ProfilePlaceholder name={name} className={className} />;
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-surface-muted shadow-sm",
        className
      )}
    >
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
