"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ─── Types ───────────────────────────────────────────── */

interface VideoFormData {
  title: string;
  description: string;
  provider: string;
  video_id: string;
  thumbnail_url: string;
  published: boolean;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/* ─── Helpers ─────────────────────────────────────────── */

const SUPPORTED_PROVIDERS = ["youtube", "loom"];

/**
 * Extract video ID from a URL or return the input if already an ID.
 */
function normalizeVideoId(provider: string, input: string): string {
  const trimmed = input.trim();

  if (provider === "youtube") {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) return match[1];
    }
  }

  if (provider === "loom") {
    // Handle Loom URL format
    const loomPattern = /(?:loom\.com\/share\/|loom\.com\/embed\/)([a-f0-9]+)/;
    const match = trimmed.match(loomPattern);
    if (match) return match[1];
  }

  // Return as-is if no pattern matched (assume it's already an ID)
  return trimmed;
}

function parseFormData(formData: FormData): VideoFormData {
  const provider = (formData.get("provider") as string)?.trim() ?? "";
  const rawVideoId = (formData.get("video_id") as string)?.trim() ?? "";

  return {
    title: (formData.get("title") as string)?.trim() ?? "",
    description: (formData.get("description") as string)?.trim() ?? "",
    provider,
    video_id: normalizeVideoId(provider, rawVideoId),
    thumbnail_url: (formData.get("thumbnail_url") as string)?.trim() ?? "",
    published: formData.get("published") === "on",
  };
}

function validate(data: VideoFormData): string | null {
  if (!data.title) return "Title is required.";
  if (data.title.length > 200) return "Title must be under 200 characters.";
  if (!data.provider) return "Provider is required.";
  if (!SUPPORTED_PROVIDERS.includes(data.provider))
    return `Provider must be one of: ${SUPPORTED_PROVIDERS.join(", ")}`;
  if (!data.video_id) return "Video ID or URL is required.";
  if (data.video_id.length > 200) return "Video ID is too long.";
  return null;
}

function revalidateVideoPages() {
  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/work");
}

/* ─── Actions ─────────────────────────────────────────── */

export async function createVideo(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();

  const { error: insertError } = await supabase.from("videos").insert({
    title: data.title,
    description: data.description,
    provider: data.provider,
    video_id: data.video_id,
    thumbnail_url: data.thumbnail_url || null,
    published: data.published,
  });

  if (insertError) {
    console.error("[Admin] Create video error:", insertError.message);
    return { success: false, error: "Failed to create video." };
  }

  revalidateVideoPages();
  redirect("/admin/videos");
}

export async function updateVideo(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("videos")
    .update({
      title: data.title,
      description: data.description,
      provider: data.provider,
      video_id: data.video_id,
      thumbnail_url: data.thumbnail_url || null,
      published: data.published,
    })
    .eq("id", id);

  if (updateError) {
    console.error("[Admin] Update video error:", updateError.message);
    return { success: false, error: "Failed to update video." };
  }

  revalidateVideoPages();
  return { success: true };
}

export async function publishVideo(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("videos")
    .update({ published: true })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to publish." };
  revalidateVideoPages();
  return { success: true };
}

export async function unpublishVideo(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("videos")
    .update({ published: false })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to unpublish." };
  revalidateVideoPages();
  return { success: true };
}

export async function deleteVideo(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  // Check if video is referenced by project_videos
  const { data: refs } = await supabase
    .from("project_videos")
    .select("id")
    .eq("video_id", id)
    .limit(1);

  // Note: project_videos.video_id stores the provider video ID, not our library ID
  // The videos library is a standalone entity — safe to delete directly

  const { error } = await supabase.from("videos").delete().eq("id", id);

  if (error) {
    console.error("[Admin] Delete video error:", error.message);
    return { success: false, error: "Failed to delete video." };
  }

  revalidateVideoPages();
  return { success: true };
}
