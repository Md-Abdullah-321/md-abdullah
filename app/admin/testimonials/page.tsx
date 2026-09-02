import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTestimonials } from "@/lib/supabase/admin";
import { TestimonialsTable } from "./testimonials-table";

export default async function AdminTestimonialsPage() {
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  let error: string | null = null;

  try {
    testimonials = await getTestimonials();
  } catch (e) {
    console.error("[Admin] Failed to load testimonials:", e);
    error = e instanceof Error ? e.message : "Failed to load testimonials.";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage client testimonials displayed on the portfolio.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">No testimonials yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add real client feedback to display on the portfolio.
            </p>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/testimonials/new">
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Link>
            </Button>
          </div>
        ) : (
          <TestimonialsTable testimonials={testimonials} />
        )}
      </div>
    </div>
  );
}
