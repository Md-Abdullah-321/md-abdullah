import { createClient } from "./server";

export async function getFeaturedProjectsWithWebsite() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("projects").select("id, slug, title, short_description, problem, solution, category, technologies, website_url, website_label, featured, sort_order, video:videos!projects_video_id_fkey(id, title, description, provider, video_id, thumbnail_url)").eq("published", true).eq("featured", true).order("sort_order", { ascending: true }).limit(3);
    if (error) return [];
    return (data ?? []).map((project) => ({ ...project, video: Array.isArray(project.video) ? project.video[0] ?? null : project.video }));
  } catch { return []; }
}
