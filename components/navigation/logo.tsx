"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";

/**
 * Compact lockup: the brand mark plus the name. The full wordmark image
 * includes a tagline that does not fit the 64px bar in the approved header.
 */
export function Logo({
  className,
  onClick,
  eventLocation = "header",
}: {
  className?: string;
  onClick?: () => void;
  eventLocation?: "header" | "mobile_menu";
}) {
  return (
    <Link
      href="/"
      className={cn(
        "flex shrink-0 items-center gap-2.5 text-[15.5px] font-bold tracking-[-0.02em] text-foreground lg:text-[17px]",
        className
      )}
      aria-label="Md Abdullah, home"
      onClick={() => {
        onClick?.();
        pushDataLayerEvent({
          event: "nav_click",
          destination: "home",
          location: eventLocation,
        });
      }}
    >
      <svg
        width="30"
        height="22"
        viewBox="0 0 30 22"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M2 20 L11 4 L20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
        <path
          d="M15 20 L22 8 L28 18"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      Md Abdullah
    </Link>
  );
}
