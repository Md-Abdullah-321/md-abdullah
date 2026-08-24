import { createClient } from "./server";

export async function getProjectBySlugWithRelations(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("projects").select("*, project_videos(*), video:videos!projects_video_id_fkey(id, title, description, provider, video_id, thumbnail_url), testimonial:testimonials!projects_testimonial_id_fkey(id, client_name, client_role, company, quote, avatar_url)").eq("slug", slug).eq("published", true).single();
    if (error) return null;
    return data;
  } catch { return null; }
}
