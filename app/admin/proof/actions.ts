"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ─── Types ───────────────────────────────────────────── */

const VALID_TYPES = ["project", "video", "testimonial", "professional", "other"] as const;
const VALID_PROVIDERS = ["youtube", "loom"] as const;

interface ProofFormData {
  type: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  video_provider: string;
  video_id: string;
  project_id: string;
  published: boolean;
  sort_order: number;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/* ─── Helpers ─────────────────────────────────────────── */

function parseFormData(formData: FormData): ProofFormData {
  return {
    type: (formData.get("type") as string)?.trim() ?? "",
    title: (formData.get("title") as string)?.trim() ?? "",
    description: (formData.get("description") as string)?.trim() ?? "",
    url: (formData.get("url") as string)?.trim() ?? "",
    image_url: (formData.get("image_url") as string)?.trim() ?? "",
    video_provider: (formData.get("video_provider") as string)?.trim() ?? "",
    video_id: (formData.get("video_id") as string)?.trim() ?? "",
    project_id: (formData.get("project_id") as string)?.trim() ?? "",
    published: formData.get("published") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };
}

function validate(data: ProofFormData): string | null {
  if (!data.type) return "Type is required.";
  if (!VALID_TYPES.includes(data.type as (typeof VALID_TYPES)[number]))
    return `Type must be one of: ${VALID_TYPES.join(", ")}`;
  if (!data.title) return "Title is required.";
  if (data.title.length > 200) return "Title must be under 200 characters.";
  if (data.type === "video") {
    if (!data.video_provider) return "Video provider is required for video proof.";
    if (!VALID_PROVIDERS.includes(data.video_provider as (typeof VALID_PROVIDERS)[number]))
      return "Video provider must be youtube or loom.";
    if (!data.video_id) return "Video ID is required for video proof.";
  }
  if (data.url && data.url.length > 2000) return "URL is too long.";
  return null;
}

function toDbRecord(data: ProofFormData) {
  return {
    type: data.type,
    title: data.title,
    description: data.description,
    url: data.url || null,
    image_url: data.image_url || null,
    video_provider: data.video_provider || null,
    video_id: data.video_id || null,
    project_id: data.project_id || null,
    published: data.published,
    sort_order: data.sort_order,
  };
}

function revalidatePages() {
  revalidatePath("/");
  revalidatePath("/admin/proof");
}

/* ─── Actions ─────────────────────────────────────────── */

export async function createProofItem(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from("proof_items")
    .insert(toDbRecord(data));

  if (insertError) {
    console.error("[Admin] Create proof error:", insertError.message);
    return { success: false, error: "Failed to create proof item." };
  }

  revalidatePages();
  redirect("/admin/proof");
}

export async function updateProofItem(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();
  const { error: updateError } = await supabase
    .from("proof_items")
    .update(toDbRecord(data))
    .eq("id", id);

  if (updateError) {
    console.error("[Admin] Update proof error:", updateError.message);
    return { success: false, error: "Failed to update proof item." };
  }

  revalidatePages();
  return { success: true };
}

export async function publishProofItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("proof_items")
    .update({ published: true })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to publish." };
  revalidatePages();
  return { success: true };
}

export async function unpublishProofItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("proof_items")
    .update({ published: false })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to unpublish." };
  revalidatePages();
  return { success: true };
}

export async function deleteProofItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("proof_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[Admin] Delete proof error:", error.message);
    return { success: false, error: "Failed to delete proof item." };
  }

  revalidatePages();
  return { success: true };
}
