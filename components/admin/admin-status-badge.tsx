import { Globe, GlobeLock, Clock, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "published" | "draft" | "new" | "reviewed" | "archived";

const statusConfig: Record<Status, { label: string; icon: React.ReactNode; style: string }> = {
  published: {
    label: "Published",
    icon: <Globe className="h-3 w-3" />,
    style: "bg-success/10 text-success",
  },
  draft: {
    label: "Draft",
    icon: <GlobeLock className="h-3 w-3" />,
    style: "bg-muted text-muted-foreground",
  },
  new: {
    label: "New",
    icon: <Clock className="h-3 w-3" />,
    style: "bg-primary/10 text-primary",
  },
  reviewed: {
    label: "Reviewed",
    icon: <Globe className="h-3 w-3" />,
    style: "bg-muted text-muted-foreground",
  },
  archived: {
    label: "Archived",
    icon: <Archive className="h-3 w-3" />,
    style: "bg-muted/50 text-muted-foreground",
  },
};

interface AdminStatusBadgeProps {
  status: Status;
  className?: string;
}

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.style,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

/** Helper to map published boolean to status */
export function publishedStatus(published: boolean): Status {
  return published ? "published" : "draft";
}
