"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Archive, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateMessageStatus, deleteMessage } from "../actions";

interface MessageActionsProps {
  id: string;
  currentStatus: string;
}

const statusLabels: Record<string, { label: string; style: string }> = {
  new: { label: "New", style: "bg-primary/10 text-primary" },
  reviewed: { label: "Reviewed", style: "bg-muted text-muted-foreground" },
  archived: { label: "Archived", style: "bg-muted/50 text-muted-foreground" },
};

export function MessageActions({ id, currentStatus }: MessageActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleStatus(status: string) {
    startTransition(async () => {
      await updateMessageStatus(id, status);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Delete this message permanently?")) return;
    startTransition(async () => {
      await deleteMessage(id);
      router.push("/admin/messages");
    });
  }

  const { label, style } = statusLabels[currentStatus] ?? statusLabels.new;

  return (
    <div
      className={cn(
        "flex items-center gap-3 transition-opacity",
        isPending && "opacity-50"
      )}
    >
      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", style)}>
        {label}
      </span>

      <div className="flex items-center gap-1">
        {currentStatus === "new" && (
          <button
            onClick={() => handleStatus("reviewed")}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Mark reviewed
          </button>
        )}
        {currentStatus !== "archived" && (
          <button
            onClick={() => handleStatus("archived")}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </button>
        )}
        {currentStatus === "archived" && (
          <button
            onClick={() => handleStatus("new")}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restore
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
