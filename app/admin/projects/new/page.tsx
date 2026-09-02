import { createClient } from "@/lib/supabase/server";
import { ProjectFormRelations } from "../project-form-relations";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const [{ data: videos }, { data: testimonials }] = await Promise.all([
    supabase.from("videos").select("id, title, provider").order("created_at", { ascending: false }),
    supabase.from("testimonials").select("id, client_name, company").order("sort_order", { ascending: true }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">New Project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a new case study or portfolio project.
      </p>
      <div className="mt-8">
        <ProjectFormRelations
          videos={(videos ?? []).map((video) => ({ id: video.id, label: `${video.title} (${video.provider})` }))}
          testimonials={(testimonials ?? []).map((testimonial) => ({ id: testimonial.id, label: `${testimonial.client_name}${testimonial.company ? ` · ${testimonial.company}` : ""}` }))}
        />
      </div>
    </div>
  );
}
