"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ─── Types ───────────────────────────────────────────── */

interface ServiceFormData {
  title: string;
  slug: string;
  short_description: string;
  problem: string;
  solution: string;
  icon_name: string;
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

function parseFormData(formData: FormData): ServiceFormData {
  return {
    title: (formData.get("title") as string)?.trim() ?? "",
    slug: (formData.get("slug") as string)?.trim() ?? "",
    short_description: (formData.get("short_description") as string)?.trim() ?? "",
    problem: (formData.get("problem") as string)?.trim() ?? "",
    solution: (formData.get("solution") as string)?.trim() ?? "",
    icon_name: (formData.get("icon_name") as string)?.trim() ?? "",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };
}

function validate(data: ServiceFormData): string | null {
  if (!data.title) return "Title is required.";
  if (!data.slug) return "Slug is required.";
  if (!/^[a-z0-9-]+$/.test(data.slug)) return "Slug must contain only lowercase letters, numbers, and dashes.";
  if (data.title.length > 200) return "Title must be under 200 characters.";
  return null;
}

const VALID_ICONS = ["users", "zap", "cable", "bot", "code", "wrench", "settings", "database", "globe", ""];

function revalidateServicePages() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

/* ─── Actions ─────────────────────────────────────────── */

export async function createService(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  if (!data.slug && data.title) {
    data.slug = slugify(data.title);
  }

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("services")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "A service with this slug already exists." };
  }

  const { error: insertError } = await supabase.from("services").insert(data);

  if (insertError) {
    console.error("[Admin] Create service error:", insertError.message);
    return { success: false, error: "Failed to create service." };
  }

  revalidateServicePages();
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("services")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "A service with this slug already exists." };
  }

  const { error: updateError } = await supabase
    .from("services")
    .update(data)
    .eq("id", id);

  if (updateError) {
    console.error("[Admin] Update service error:", updateError.message);
    return { success: false, error: "Failed to update service." };
  }

  revalidateServicePages();
  return { success: true };
}

export async function publishService(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ published: true })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to publish." };
  revalidateServicePages();
  return { success: true };
}

export async function unpublishService(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ published: false })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to unpublish." };
  revalidateServicePages();
  return { success: true };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error("[Admin] Delete service error:", error.message);
    return { success: false, error: "Failed to delete service." };
  }

  revalidateServicePages();
  return { success: true };
}
