import { createClient } from "./server";

const PROJECT_WITH_WEBSITE_SELECT = "id, slug, title, short_description, problem, solution, category, technologies, website_url, website_label, featured, sort_order, video:videos!projects_video_id_fkey(id, title, description, provider, video_id, thumbnail_url)";

function normalizeVideo<T extends { video?: unknown }>(project: T) {
  return {
    ...project,
    video: Array.isArray(project.video) ? project.video[0] ?? null : project.video,
  };
}

export async function getFeaturedProjectsWithWebsite() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("projects").select(PROJECT_WITH_WEBSITE_SELECT).eq("published", true).eq("featured", true).order("sort_order", { ascending: true }).limit(3);
    if (error) return [];
    return (data ?? []).map(normalizeVideo);
  } catch { return []; }
}

export async function getPublishedProjectsWithWebsite() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("projects").select(PROJECT_WITH_WEBSITE_SELECT).eq("published", true).order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []).map(normalizeVideo);
  } catch { return []; }
}
