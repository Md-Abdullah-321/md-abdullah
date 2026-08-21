export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const ROUTES = {
  home: "/",
  about: "/about",
  work: "/work",
  services: "/services",
  contact: "/contact",
  caseStudy: (slug: string) => `/work/${slug}`,
} as const;
