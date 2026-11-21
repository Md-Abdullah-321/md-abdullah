import type { NavItem } from "@/types";

/**
 * Navigation destinations used by the analytics layer. Keys are the nav
 * item hrefs; values are the stable semantic destination names pushed to the
 * dataLayer as `nav_click.destination`.
 */
export const NAV_DESTINATIONS: Record<
  string,
  "home" | "work" | "reviews" | "about" | "contact"
> = {
  "/": "home",
  "/#work": "work",
  "/work": "work",
  "/#reviews": "reviews",
  "/about": "about",
  "/contact": "contact",
  "/#contact": "contact",
};

export const mainNavItems: NavItem[] = [
  { label: "Work", href: "/#work" },
  { label: "Reviews", href: "/#reviews" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
