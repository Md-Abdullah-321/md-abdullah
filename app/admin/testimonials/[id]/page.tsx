import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TestimonialForm } from "../testimonial-form";

export default async function EditTestimonialPage(
  props: PageProps<"/admin/testimonials/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: testimonial }, { data: projects }] = await Promise.all([
    supabase.from("testimonials").select("*").eq("id", id).single(),
    supabase.from("projects").select("id, title").order("title"),
  ]);

  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Testimonial</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        From {testimonial.client_name}
        {testimonial.company ? ` at ${testimonial.company}` : ""} ·{" "}
        {testimonial.published ? "Published" : "Draft"}
      </p>
      <div className="mt-8">
        <TestimonialForm testimonial={testimonial} projects={projects ?? []} />
      </div>
    </div>
  );
}
