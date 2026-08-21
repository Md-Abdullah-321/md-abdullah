"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ─── Types ───────────────────────────────────────────── */

export interface ProjectFormData {
  title: string;
  slug: string;
  category: string;
  short_description: string;
  problem: string;
  solution: string;
  outcome: string;
  context: string;
  workflow: string;
  architecture: string;
  before_state: string;
  after_state: string;
  technologies: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/* ─── Helpers ─────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFormData(formData: FormData): ProjectFormData {
  return {
    title: (formData.get("title") as string)?.trim() ?? "",
    slug: (formData.get("slug") as string)?.trim() ?? "",
    category: (formData.get("category") as string)?.trim() ?? "",
    short_description: (formData.get("short_description") as string)?.trim() ?? "",
    problem: (formData.get("problem") as string)?.trim() ?? "",
    solution: (formData.get("solution") as string)?.trim() ?? "",
    outcome: (formData.get("outcome") as string)?.trim() ?? "",
    context: (formData.get("context") as string)?.trim() ?? "",
    workflow: (formData.get("workflow") as string)?.trim() ?? "",
    architecture: (formData.get("architecture") as string)?.trim() ?? "",
    before_state: (formData.get("before_state") as string)?.trim() ?? "",
    after_state: (formData.get("after_state") as string)?.trim() ?? "",
    technologies: (formData.get("technologies") as string)?.trim() ?? "",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };
}

function validate(data: ProjectFormData): string | null {
  if (!data.title) return "Title is required.";
  if (!data.slug) return "Slug is required.";
  if (!/^[a-z0-9-]+$/.test(data.slug)) return "Slug must contain only lowercase letters, numbers, and dashes.";
  if (data.title.length > 200) return "Title must be under 200 characters.";
  if (data.slug.length > 100) return "Slug must be under 100 characters.";
  return null;
}

function toDbRecord(data: ProjectFormData) {
  return {
    title: data.title,
    slug: data.slug,
    category: data.category,
    short_description: data.short_description,
    problem: data.problem,
    solution: data.solution,
    outcome: data.outcome,
    context: data.context,
    workflow: data.workflow,
    architecture: data.architecture,
    before_state: data.before_state,
    after_state: data.after_state,
    technologies: data.technologies
      ? data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    featured: data.featured,
    published: data.published,
    sort_order: data.sort_order,
  };
}

function revalidateProjectPages() {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
}

/* ─── Actions ─────────────────────────────────────────── */

export async function createProject(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  // Auto-generate slug from title if empty
  if (!data.slug && data.title) {
    data.slug = slugify(data.title);
  }

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "A project with this slug already exists." };
  }

  const { error: insertError } = await supabase
    .from("projects")
    .insert(toDbRecord(data));

  if (insertError) {
    console.error("[Admin] Create project error:", insertError.message);
    return { success: false, error: "Failed to create project." };
  }

  revalidateProjectPages();
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();

  // Check slug uniqueness (excluding self)
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "A project with this slug already exists." };
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update(toDbRecord(data))
    .eq("id", id);

  if (updateError) {
    console.error("[Admin] Update project error:", updateError.message);
    return { success: false, error: "Failed to update project." };
  }

  revalidateProjectPages();
  revalidatePath(`/work/${data.slug}`);
  return { success: true };
}

export async function publishProject(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ published: true })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to publish." };

  revalidateProjectPages();
  return { success: true };
}

export async function unpublishProject(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ published: false })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to unpublish." };

  revalidateProjectPages();
  return { success: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  // Delete related videos first (cascade should handle but explicit is safer)
  await supabase.from("project_videos").delete().eq("project_id", id);

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("[Admin] Delete project error:", error.message);
    return { success: false, error: "Failed to delete project." };
  }

  revalidateProjectPages();
  return { success: true };
}

/* ─── Video Actions ───────────────────────────────────── */

export async function addProjectVideo(
  projectId: string,
  formData: FormData
): Promise<ActionResult> {
  const provider = (formData.get("provider") as string)?.trim();
  const videoId = (formData.get("video_id") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() ?? "";
  const sortOrder = parseInt(formData.get("sort_order") as string) || 0;

  if (!provider || !videoId || !title) {
    return { success: false, error: "Provider, video ID, and title are required." };
  }

  if (!["youtube", "loom"].includes(provider)) {
    return { success: false, error: "Provider must be youtube or loom." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("project_videos").insert({
    project_id: projectId,
    provider,
    video_id: videoId,
    title,
    description,
    sort_order: sortOrder,
  });

  if (error) {
    console.error("[Admin] Add video error:", error.message);
    return { success: false, error: "Failed to add video." };
  }

  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true };
}

export async function deleteProjectVideo(
  videoId: string,
  projectId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_videos")
    .delete()
    .eq("id", videoId);

  if (error) return { success: false, error: "Failed to delete video." };

  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true };
}
