import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function AdminEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: AdminEmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
      {actionHref && actionLabel && (
        <Button asChild className="mt-4" variant="outline" size="sm">
          <Link href={actionHref}>
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
