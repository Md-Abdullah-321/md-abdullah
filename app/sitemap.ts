import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/supabase/queries";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  // Dynamic: published projects
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const projects = await getPublishedProjects();
    projectPages = projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // Graceful fallback if Supabase unavailable
  }

  return [...staticPages, ...projectPages];
}
