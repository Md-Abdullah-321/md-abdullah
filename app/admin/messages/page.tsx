import { getContactSubmissions } from "@/lib/supabase/admin";
import { getNewMessageCount } from "./actions";
import { MessagesList } from "./messages-list";

export default async function AdminMessagesPage(
  props: PageProps<"/admin/messages">
) {
  const searchParams = await props.searchParams;
  const statusFilter = (searchParams?.status as string) || undefined;

  let messages: Awaited<ReturnType<typeof getContactSubmissions>> = [];
  let error: string | null = null;
  let newCount = 0;

  try {
    messages = await getContactSubmissions(statusFilter);
    newCount = await getNewMessageCount();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load messages.";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact form submissions
            {newCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {newCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex gap-2">
        <FilterLink href="/admin/messages" active={!statusFilter} label="All" />
        <FilterLink href="/admin/messages?status=new" active={statusFilter === "new"} label="New" />
        <FilterLink href="/admin/messages?status=reviewed" active={statusFilter === "reviewed"} label="Reviewed" />
        <FilterLink href="/admin/messages?status=archived" active={statusFilter === "archived"} label="Archived" />
      </div>

      <div className="mt-6">
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : (
          <MessagesList messages={messages ?? []} />
        )}
      </div>
    </div>
  );
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <a
      href={href}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {label}
    </a>
  );
}
