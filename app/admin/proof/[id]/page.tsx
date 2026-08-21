import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProofForm } from "../proof-form";

export default async function EditProofPage(
  props: PageProps<"/admin/proof/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: proof }, { data: projects }] = await Promise.all([
    supabase.from("proof_items").select("*").eq("id", id).single(),
    supabase.from("projects").select("id, title").order("title"),
  ]);

  if (!proof) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit: {proof.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Type: {proof.type} · {proof.published ? "Published" : "Draft"}
      </p>
      <div className="mt-8">
        <ProofForm proof={proof} projects={projects ?? []} />
      </div>
    </div>
  );
}
