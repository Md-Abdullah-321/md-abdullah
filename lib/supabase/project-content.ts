import { createClient } from "./server";

export async function getFeaturedProjectsWithWebsite() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("projects").select("id, slug, title, short_description, problem, solution, category, technologies, website_url, featured, sort_order").eq("published", true).eq("featured", true).order("sort_order", { ascending: true }).limit(3);
    if (error) return [];
    return data ?? [];
  } catch { return []; }
}
