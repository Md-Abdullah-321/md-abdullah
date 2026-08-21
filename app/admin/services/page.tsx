import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/supabase/admin";
import { ServicesTable } from "./services-table";

export default async function AdminServicesPage() {
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let error: string | null = null;

  try {
    services = await getServices();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load services.";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage service offerings displayed on the portfolio.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4" />
            New Service
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">No services yet.</p>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/services/new">
                <Plus className="h-4 w-4" />
                Create Service
              </Link>
            </Button>
          </div>
        ) : (
          <ServicesTable services={services} />
        )}
      </div>
    </div>
  );
}
