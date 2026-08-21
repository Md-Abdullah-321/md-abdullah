import { createClient } from "@/lib/supabase/server";
import { ProofForm } from "../proof-form";

export default async function NewProofPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title")
    .order("title");

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Proof</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add real evidence to support the portfolio&apos;s credibility.
      </p>
      <div className="mt-8">
        <ProofForm projects={projects ?? []} />
      </div>
    </div>
  );
}
