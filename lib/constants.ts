export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` ||
  "http://localhost:3000";

export const ROUTES = {
  home: "/",
  about: "/about",
  work: "/work",
  contact: "/contact",
  caseStudy: (slug: string) => `/work/${slug}`,
} as const;
