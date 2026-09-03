import type { NavItem } from "@/types";

/**
 * Navigation destinations used by the analytics layer. Keys are the nav
 * item hrefs; values are the stable semantic destination names pushed to the
 * dataLayer as `nav_click.destination`.
 */
export const NAV_DESTINATIONS: Record<
  string,
  "home" | "work" | "how_i_build" | "systems" | "about" | "contact"
> = {
  "/": "home",
  "/#featured-work": "work",
  "/#how-i-build": "how_i_build",
  "/#systems": "systems",
  "/about": "about",
  "/contact": "contact",
};

export const mainNavItems: NavItem[] = [
  { label: "How I Build", href: "/#how-i-build" },
  { label: "Work I've Done", href: "/#featured-work" },
  { label: "Systems", href: "/#systems" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
