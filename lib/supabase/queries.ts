/**
 * Public data access layer.
 *
 * These queries only return published content (enforced by RLS + explicit filters).
 * Used by the public-facing website pages.
 *
 * All queries gracefully return empty results if tables don't exist yet
 * (migrations not yet applied to the Supabase instance).
 */

import { createClient } from "./server";

/* ─── Projects ────────────────────────────────────────── */

export async function getPublishedProjects() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, slug, title, short_description, problem, solution, category, technologies, featured, sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("[queries] getPublishedProjects:", error.message);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedProjects() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, slug, title, short_description, problem, solution, category, technologies, featured, sort_order")
      .eq("published", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true })
      .limit(3);

    if (error) {
      console.warn("[queries] getFeaturedProjects:", error.message);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_videos(*)")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

/* ─── Services ────────────────────────────────────────── */

export async function getPublishedServices() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, slug, title, short_description, problem, solution, icon_name, sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("[queries] getPublishedServices:", error.message);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}

/* ─── Testimonials ────────────────────────────────────── */

/** Testimonial for the homepage Hero proof card.
 *  Uses the explicitly configured settings.hero_testimonial_id when it is set
 *  and published; otherwise falls back to the most recent published
 *  testimonial. Returns null only when no published testimonial exists. */
export async function getHomepageHeroTestimonial(heroTestimonialId: string | null) {
  try {
    const supabase = await createClient();
    const fields = "id, quote, highlight_text, client_name, company";
    if (heroTestimonialId) {
      const { data } = await supabase
        .from("testimonials")
        .select(fields)
        .eq("id", heroTestimonialId)
        .eq("published", true)
        .maybeSingle();
      if (data) return data;
    }
    const { data } = await supabase
      .from("testimonials")
      .select(fields)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getPublishedTestimonials() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, client_name, client_role, company, quote, project_id, sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("[queries] getPublishedTestimonials:", error.message);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}

/* ─── Proof ───────────────────────────────────────────── */

export async function getPublishedProof() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proof_items")
      .select("id, type, title, description, url, image_url, video_provider, video_id, project_id, sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("[queries] getPublishedProof:", error.message);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}
