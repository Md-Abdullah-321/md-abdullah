import { cn } from "@/lib/utils";

/* ─── Workflow Container ──────────────────────────────── */

interface WorkflowProps {
  children: React.ReactNode;
  className?: string;
  /** Horizontal layout on larger screens */
  horizontal?: boolean;
}

export function Workflow({ children, className, horizontal }: WorkflowProps) {
  return (
    <div
      className={cn(
        "flex gap-0",
        horizontal
          ? "flex-col items-center sm:flex-row sm:items-stretch"
          : "flex-col items-center",
        className
      )}
      role="list"
      aria-label="Workflow steps"
    >
      {children}
    </div>
  );
}

/* ─── Workflow Node ───────────────────────────────────── */

type NodeStatus = "default" | "active" | "completed" | "pending";

interface WorkflowNodeProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  status?: NodeStatus;
  icon?: React.ReactNode;
}

const statusStyles: Record<NodeStatus, string> = {
  default: "border-border bg-card text-card-foreground",
  active: "border-primary bg-primary/5 text-foreground ring-1 ring-primary/20",
  completed: "border-success/50 bg-success/5 text-foreground",
  pending: "border-border bg-muted text-muted-foreground",
};

export function WorkflowNode({
  children,
  className,
  label,
  status = "default",
  icon,
}: WorkflowNodeProps) {
  return (
    <div className="flex flex-col items-center gap-2" role="listitem">
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-xs transition-colors",
          statusStyles[status],
          className
        )}
      >
        {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
        <span>{children}</span>
      </div>
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

/* ─── Workflow Connector ──────────────────────────────── */

interface WorkflowConnectorProps {
  className?: string;
  /** Use horizontal connector (arrow right) */
  horizontal?: boolean;
}

export function WorkflowConnector({ className, horizontal }: WorkflowConnectorProps) {
  if (horizontal) {
    return (
      <div
        className={cn(
          "hidden items-center sm:flex",
          className
        )}
        aria-hidden="true"
      >
        <div className="h-px w-6 bg-border md:w-10" />
        <div className="h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-border" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)} aria-hidden="true">
      <div className="h-6 w-px bg-border md:h-8" />
      <div className="h-0 w-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-border" />
    </div>
  );
}
