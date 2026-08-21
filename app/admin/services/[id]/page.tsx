import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "../service-form";

export default async function EditServicePage(
  props: PageProps<"/admin/services/[id]">
) {
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !service) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit: {service.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {service.published ? "Published" : "Draft"}
      </p>
      <div className="mt-8">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
