import { createClient } from "@/lib/supabase/server";
import { TestimonialForm } from "../testimonial-form";

export default async function NewTestimonialPage() {
  // Fetch projects for the relationship selector
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title")
    .order("title");

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Testimonial</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a genuine client testimonial.
      </p>
      <div className="mt-8">
        <TestimonialForm projects={projects ?? []} />
      </div>
    </div>
  );
}
