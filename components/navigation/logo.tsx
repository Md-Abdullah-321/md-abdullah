"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";

/** Brand lockup used by the header bar and the full-screen mobile menu. */
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
        "flex items-center transition-opacity hover:opacity-90",
        className
      )}
      aria-label="Md Abdullah Home"
      onClick={() => {
        onClick?.();
        pushDataLayerEvent({
          event: "nav_click",
          destination: "home",
          location: eventLocation,
        });
      }}
    >
      <Image
        src="/images/logo v1.png"
        alt=""
        width={1903}
        height={427}
        priority
        className="h-auto w-[158px] sm:w-[162px] md:w-[152px]"
      />
    </Link>
  );
}
