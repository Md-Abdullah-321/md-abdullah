"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Trash2, CheckCircle2, Archive, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateMessageStatus, deleteMessage } from "./actions";

interface Message {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  new: "bg-primary/10 text-primary font-semibold",
  reviewed: "bg-muted text-muted-foreground",
  archived: "bg-muted/50 text-muted-foreground opacity-60",
};

export function MessagesList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No messages yet.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Submissions from the contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <MessageRow key={msg.id} message={msg} />
      ))}
    </div>
  );
}

function MessageRow({ message }: { message: Message }) {
  const [isPending, startTransition] = useTransition();

  const shortMessage =
    message.message.length > 80
      ? message.message.slice(0, 80) + "..."
      : message.message;

  const date = new Date(message.created_at);
  const dateStr = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      await updateMessageStatus(message.id, newStatus);
    });
  }

  function handleDelete() {
    if (!confirm(`Delete message from "${message.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteMessage(message.id);
    });
  }

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-opacity",
        message.status === "new" && "border-primary/20 bg-primary/[0.02]",
        isPending && "opacity-50"
      )}
    >
      {/* Content */}
      <Link
        href={`/admin/messages/${message.id}`}
        className="flex-1 min-w-0"
      >
        <div className="flex items-center gap-2">
          <p className={cn("text-sm", message.status === "new" ? "font-semibold" : "font-medium")}>
            {message.name}
          </p>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px]", statusStyles[message.status])}>
            {message.status}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {message.email}
          {message.company && ` · ${message.company}`}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-1">
          {shortMessage}
        </p>
      </Link>

      {/* Date + Actions */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xs text-muted-foreground">{dateStr}</span>
        <div className="flex items-center gap-0.5">
          {message.status === "new" && (
            <button
              onClick={() => handleStatusChange("reviewed")}
              disabled={isPending}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              title="Mark reviewed"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}
          {message.status !== "archived" && (
            <button
              onClick={() => handleStatusChange("archived")}
              disabled={isPending}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              title="Archive"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>
          )}
          {message.status === "archived" && (
            <button
              onClick={() => handleStatusChange("new")}
              disabled={isPending}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              title="Restore"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
