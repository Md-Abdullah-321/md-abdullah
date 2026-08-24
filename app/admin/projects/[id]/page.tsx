import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ProjectFormRelations } from "../project-form-relations";

export default async function EditProjectPage(props: PageProps<"/admin/projects/[id]">) {
  const { id } = await props.params;
  let project;
  try { project = await getProjectById(id); } catch { notFound(); }
  if (!project) notFound();
  const supabase = await createClient();
  const [{ data: videos }, { data: testimonials }] = await Promise.all([
    supabase.from("videos").select("id, title, provider").order("created_at", { ascending: false }),
    supabase.from("testimonials").select("id, client_name, company").order("sort_order", { ascending: true }),
  ]);
  return <div className="space-y-12"><div><h1 className="text-2xl font-bold">Edit: {project.title}</h1><p className="mt-1 text-sm text-muted-foreground">{project.published ? "Published" : "Draft"} · /work/{project.slug}</p></div><ProjectFormRelations project={project} videos={(videos ?? []).map((video) => ({ id: video.id, label: `${video.title} (${video.provider})` }))} testimonials={(testimonials ?? []).map((testimonial) => ({ id: testimonial.id, label: `${testimonial.client_name}${testimonial.company ? ` · ${testimonial.company}` : ""}` }))} /></div>;
}
