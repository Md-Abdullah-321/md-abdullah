"use server";

import { revalidatePath } from "next/cache";
import { updateSiteSettings } from "@/lib/supabase/settings";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function saveSettings(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = (formData.get("name") as string)?.trim() ?? "";
  const title = (formData.get("title") as string)?.trim() ?? "";
  const bio = (formData.get("bio") as string)?.trim() ?? "";
  const profile_image_url = (formData.get("profile_image_url") as string)?.trim() || null;
  const public_email = (formData.get("public_email") as string)?.trim() ?? "";
  const contact_url = (formData.get("contact_url") as string)?.trim() || "/contact";
  const booking_url = (formData.get("booking_url") as string)?.trim() || null;
  const link_linkedin = (formData.get("link_linkedin") as string)?.trim() || null;
  const link_github = (formData.get("link_github") as string)?.trim() || null;
  const link_upwork = (formData.get("link_upwork") as string)?.trim() || null;
  const link_youtube = (formData.get("link_youtube") as string)?.trim() || null;
  const link_twitter = (formData.get("link_twitter") as string)?.trim() || null;
  const site_title = (formData.get("site_title") as string)?.trim() ?? "";
  const site_description = (formData.get("site_description") as string)?.trim() ?? "";

  // Validation
  if (!name) return { success: false, error: "Name is required." };
  if (!title) return { success: false, error: "Professional title is required." };
  if (name.length > 100) return { success: false, error: "Name must be under 100 characters." };
  if (public_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(public_email)) {
    return { success: false, error: "Invalid email format." };
  }

  // Validate URLs
  const urls = [profile_image_url, booking_url, link_linkedin, link_github, link_upwork, link_youtube, link_twitter];
  for (const url of urls) {
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      return { success: false, error: `Invalid URL: ${url}. Must start with http:// or https://` };
    }
  }

  try {
    await updateSiteSettings(id, {
      name,
      title,
      bio,
      profile_image_url,
      public_email,
      contact_url,
      booking_url,
      link_linkedin,
      link_github,
      link_upwork,
      link_youtube,
      link_twitter,
      site_title,
      site_description,
    });
  } catch (e) {
    console.error("[Admin] Save settings error:", e);
    return { success: false, error: "Failed to save settings." };
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/settings");
  return { success: true };
}
