import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProofItems } from "@/lib/supabase/admin";
import { ProofTable } from "./proof-table";

export default async function AdminProofPage() {
  let items: Awaited<ReturnType<typeof getProofItems>> = [];
  let error: string | null = null;

  try {
    items = await getProofItems();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load proof items.";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proof</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage credibility evidence displayed on the portfolio.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/proof/new">
            <Plus className="h-4 w-4" />
            Add Proof
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">No proof items yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add real evidence — project results, videos, professional links, or testimonials.
            </p>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/proof/new">
                <Plus className="h-4 w-4" />
                Add Proof
              </Link>
            </Button>
          </div>
        ) : (
          <ProofTable items={items} />
        )}
      </div>
    </div>
  );
}
