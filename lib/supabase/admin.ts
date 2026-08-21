/**
 * Admin data access layer.
 *
 * All admin queries and mutations go through this module.
 * Uses the server-side Supabase client (authenticated session required).
 */

import { createClient } from "./server";

/* ─── Projects ────────────────────────────────────────── */

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_videos(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/* ─── Services ────────────────────────────────────────── */

export async function getServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

/* ─── Testimonials ────────────────────────────────────── */

export async function getTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*, projects(title, slug)")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

/* ─── Messages ────────────────────────────────────────── */

export async function getContactSubmissions(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateSubmissionStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

/* ─── Proof ───────────────────────────────────────────── */

export async function getProofItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("proof_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

/* ─── Videos ──────────────────────────────────────────── */

export async function getProjectVideos(projectId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("project_videos")
    .select("*, projects(title, slug)")
    .order("sort_order", { ascending: true });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
