import type { Testimonial } from "@/types";
import type { VideoProvider } from "@/types";

/**
 * Proof / Credibility data — single source of truth.
 *
 * Feeds the homepage Proof section.
 * Only add REAL, verified proof items here.
 * Do NOT invent testimonials, metrics, or client names.
 */

/* ─── Testimonials ────────────────────────────────────── */

/**
 * Real client testimonials.
 * Add entries here ONLY when real feedback is available.
 */
export const testimonials: Testimonial[] = [
  // No real testimonials available yet.
  // When ready, add:
  //
  // {
  //   id: "1",
  //   name: "Client Name",
  //   role: "Role",
  //   company: "Company",
  //   content: "Actual quote from the client.",
  //   projectSlug: "related-project",
  //   featured: true,
  //   order: 1,
  //   createdAt: "2024-01-01",
  // },
];

/* ─── Video Evidence ──────────────────────────────────── */

export interface ProofVideo {
  id: string;
  title: string;
  description: string;
  provider: VideoProvider;
  videoId: string;
  /** Related project slug if applicable */
  projectSlug?: string;
  featured: boolean;
}

/**
 * Real video walkthroughs showing actual work.
 * Only add videos that demonstrate real systems.
 */
export const proofVideos: ProofVideo[] = [
  // No videos available yet.
  // When ready, add:
  //
  // {
  //   id: "1",
  //   title: "CRM Automation Walkthrough",
  //   description: "How the automated follow-up system works.",
  //   provider: "loom",
  //   videoId: "abc123",
  //   projectSlug: "crm-automation-project",
  //   featured: true,
  // },
];

/* ─── Professional Evidence ───────────────────────────── */

export interface ProfessionalLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  description?: string;
}

/**
 * Verified professional platform links.
 * Only add links that are publicly accessible and accurate.
 */
export const professionalLinks: ProfessionalLink[] = [
  // When ready, add:
  //
  // {
  //   id: "1",
  //   platform: "Upwork",
  //   label: "Upwork Profile",
  //   url: "https://www.upwork.com/...",
  //   description: "Verified freelance history",
  // },
];

/* ─── Helpers ─────────────────────────────────────────── */

export function getFeaturedTestimonials(): Testimonial[] {
  return testimonials
    .filter((t) => t.featured)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedVideos(): ProofVideo[] {
  return proofVideos.filter((v) => v.featured);
}

export function hasAnyProof(): boolean {
  return (
    testimonials.length > 0 ||
    proofVideos.length > 0 ||
    professionalLinks.length > 0
  );
}
