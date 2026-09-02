"use client";

import { pushDataLayerEvent } from "@/lib/analytics/data-layer";

/**
 * Client wrapper for contact-channel anchors rendered from server trees.
 * Fires a `contact_click` dataLayer event with the semantic method + location
 * (never the email address / phone / URL), then lets the native navigation
 * proceed unchanged.
 */
export function ContactLink({
  href,
  contactMethod,
  location,
  external,
  className,
  children,
  ...rest
}: {
  href: string;
  contactMethod: "email" | "whatsapp" | "upwork" | "linkedin";
  location: "contact_page" | "footer";
  external?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children" | "onClick">) {
  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => {
        pushDataLayerEvent({ event: "contact_click", contact_method: contactMethod, location });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
