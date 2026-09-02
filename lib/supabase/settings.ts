/**
 * Site settings data access layer.
 *
 * Single-row table — always fetches the first (only) row.
 * Public reads are cached; admin updates trigger revalidation.
 */

import { createClient } from "./server";

export interface SiteSettings {
  id: string;
  name: string;
  title: string;
  bio: string;
  profile_image_url: string | null;
  public_email: string;
  contact_url: string;
  booking_url: string | null;
  link_linkedin: string | null;
  link_github: string | null;
  link_upwork: string | null;
  link_youtube: string | null;
  link_twitter: string | null;
  link_whatsapp: string | null;
  site_title: string;
  site_description: string;
  updated_at: string;
}

/** Default fallback if Supabase is not configured or table doesn't exist */
const DEFAULTS: SiteSettings = {
  id: "",
  name: "Md Abdullah",
  title: "Automation & Integration Engineer",
  bio: "",
  profile_image_url: null,
  public_email: "",
  contact_url: "/contact",
  booking_url: null,
  link_linkedin: null,
  link_github: null,
  link_upwork: null,
  link_youtube: null,
  link_twitter: null,
  link_whatsapp: null,
  site_title: "Md Abdullah | Automation & Integration Engineer",
  site_description:
    "I help businesses connect their tools, automate repetitive work, and remove manual handoffs.",
  updated_at: "",
};

/**
 * Get site settings (public).
 * Returns defaults gracefully if table doesn't exist or is empty.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) return DEFAULTS;
    return data as SiteSettings;
  } catch {
    return DEFAULTS;
  }
}

/**
 * Update site settings (admin only).
 */
export async function updateSiteSettings(
  id: string,
  updates: Partial<Omit<SiteSettings, "id" | "updated_at">>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}
