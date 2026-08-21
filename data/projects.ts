import type { CaseStudyListItem } from "@/types";

/**
 * Project data — single source of truth.
 *
 * This data feeds: homepage Featured Work, /work archive, /work/[slug] pages.
 * Replace placeholder entries with real project data when available.
 *
 * IMPORTANT: Do NOT invent clients, metrics, or outcomes.
 * Use empty strings or omit optional fields until real content exists.
 */

export interface FeaturedProjectData extends CaseStudyListItem {
  /** One-line business problem (for card display) */
  problem: string;
  /** Brief solution/outcome (for card display) */
  solution: string;
  /** Category label for visual grouping */
  category: string;
  /** Whether a video walkthrough is available */
  hasVideo: boolean;
}

/**
 * Featured projects displayed on homepage.
 * Order determines display priority — first item gets primary treatment.
 *
 * These are structural placeholders. Replace with real projects.
 */
export const featuredProjects: FeaturedProjectData[] = [
  // No real projects available yet.
  // When ready, add entries like:
  //
  // {
  //   id: "1",
  //   title: "Project Title",
  //   slug: "project-slug",
  //   shortDescription: "Brief description",
  //   problem: "Business problem solved",
  //   solution: "What was built",
  //   category: "CRM · Automation",
  //   technologies: ["CRM", "Automation", "API"],
  //   featured: true,
  //   order: 1,
  //   publishedAt: "2024-01-01",
  //   hasVideo: false,
  // },
];

/** Get featured projects for homepage (ordered) */
export function getFeaturedProjects(): FeaturedProjectData[] {
  return featuredProjects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

/** Get all published projects for /work page */
export function getAllProjects(): FeaturedProjectData[] {
  return featuredProjects
    .filter((p) => p.publishedAt !== null)
    .sort((a, b) => a.order - b.order);
}
