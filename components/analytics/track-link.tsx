"use client";

import { pushDataLayerEvent, type DataLayerEvent } from "@/lib/analytics/data-layer";

/**
 * Client wrapper that adds a dataLayer push to a link rendered from a server
 * tree (hero / final-cta / project rows / detail page), without converting
 * the whole page to a client component.
 *
 * The native navigation is never prevented — the event fires first and the
 * browser continues to the destination. `onClick` is forwarded so callers can
 * compose their own handler (e.g. closing a mobile menu).
 */
export function TrackLink({
  href,
  event,
  onClick,
  className,
  children,
  ...rest
}: {
  href: string;
  event: DataLayerEvent;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick" | "className" | "children">) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        pushDataLayerEvent(event);
        onClick?.();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
