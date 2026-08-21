import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MessageActions } from "./message-actions";

export default async function MessageDetailPage(
  props: PageProps<"/admin/messages/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: message, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !message) notFound();

  const date = new Date(message.created_at);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Link
        href="/admin/messages"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All messages
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{message.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {message.email}
            {message.company && ` · ${message.company}`}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at{" "}
            {date.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Reply button */}
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${message.email}?subject=Re: Your inquiry`}>
            <Mail className="h-4 w-4" />
            Reply
          </a>
        </Button>
      </div>

      {/* Status + Actions */}
      <div className="mt-6">
        <MessageActions id={message.id} currentStatus={message.status} />
      </div>

      {/* Message content */}
      <div className="mt-8 space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            What they want to improve
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {message.message}
          </p>
        </div>

        {message.systems && (
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current systems
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {message.systems}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
