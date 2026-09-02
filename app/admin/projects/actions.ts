"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/* ─── Types ───────────────────────────────────────────── */

interface ActionResult {
  success: boolean;
  error?: string;
}

/* ─── Helpers ─────────────────────────────────────────── */

function revalidateProjectPages() {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
}

/* ─── Actions ─────────────────────────────────────────── */

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
