"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ─── Types ───────────────────────────────────────────── */

interface TestimonialFormData {
  quote: string;
  client_name: string;
  client_role: string;
  company: string;
  avatar_url: string;
  project_id: string;
  published: boolean;
  sort_order: number;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/* ─── Helpers ─────────────────────────────────────────── */

function parseFormData(formData: FormData): TestimonialFormData {
  return {
    quote: (formData.get("quote") as string)?.trim() ?? "",
    client_name: (formData.get("client_name") as string)?.trim() ?? "",
    client_role: (formData.get("client_role") as string)?.trim() ?? "",
    company: (formData.get("company") as string)?.trim() ?? "",
    avatar_url: (formData.get("avatar_url") as string)?.trim() ?? "",
    project_id: (formData.get("project_id") as string)?.trim() ?? "",
    published: formData.get("published") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };
}

function validate(data: TestimonialFormData): string | null {
  if (!data.quote) return "Quote is required.";
  if (data.quote.length > 2000) return "Quote must be under 2000 characters.";
  if (!data.client_name) return "Client name is required.";
  if (data.client_name.length > 100) return "Client name must be under 100 characters.";
  return null;
}

function toDbRecord(data: TestimonialFormData) {
  return {
    quote: data.quote,
    client_name: data.client_name,
    client_role: data.client_role,
    company: data.company,
    avatar_url: data.avatar_url || null,
    project_id: data.project_id || null,
    published: data.published,
    sort_order: data.sort_order,
  };
}

function revalidatePages() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

/* ─── Actions ─────────────────────────────────────────── */

export async function createTestimonial(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from("testimonials")
    .insert(toDbRecord(data));

  if (insertError) {
    console.error("[Admin] Create testimonial error:", insertError.message);
    return { success: false, error: "Failed to create testimonial." };
  }

  revalidatePages();
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const data = parseFormData(formData);

  const error = validate(data);
  if (error) return { success: false, error };

  const supabase = await createClient();
  const { error: updateError } = await supabase
    .from("testimonials")
    .update(toDbRecord(data))
    .eq("id", id);

  if (updateError) {
    console.error("[Admin] Update testimonial error:", updateError.message);
    return { success: false, error: "Failed to update testimonial." };
  }

  revalidatePages();
  return { success: true };
}

export async function publishTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ published: true })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to publish." };
  revalidatePages();
  return { success: true };
}

export async function unpublishTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ published: false })
    .eq("id", id);

  if (error) return { success: false, error: "Failed to unpublish." };
  revalidatePages();
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[Admin] Delete testimonial error:", error.message);
    return { success: false, error: "Failed to delete testimonial." };
  }

  revalidatePages();
  return { success: true };
}
