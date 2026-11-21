import { renderInline } from "@/components/ui/rich-text";

export type SnapshotRow = {
  label: string;
  value: string;
};

/**
 * Fields that exist on the project record. Industry, country, role,
 * duration and a one-line result are not stored, so they are omitted.
 */
export function snapshotRows(project: {
  category: string | null;
  website_label: string | null;
  technologies: string[] | null;
}): SnapshotRow[] {
  const tools = (project.technologies ?? []).flatMap((tech) =>
    tech
      .split("·")
      .map((tool) => tool.trim())
      .filter(Boolean),
  );
  const rows: SnapshotRow[] = [];
  if (project.category?.trim()) {
    rows.push({ label: "Category", value: project.category.trim() });
  }
  if (project.website_label?.trim()) {
    rows.push({ label: "Client", value: project.website_label.trim() });
  }
  if (tools.length > 0) {
    rows.push({ label: "Stack", value: tools.join(" / ") });
  }
  return rows;
}

export function CaseSnapshot({ rows }: { rows: SnapshotRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section
      aria-label="Project snapshot"
      className="mt-10 border border-foreground/15 bg-white"
    >
      <p className="flex items-center gap-3 border-b border-border px-5 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-green-deep uppercase">
        <span className="h-px w-5 bg-primary" aria-hidden="true" />
        Snapshot
      </p>
      <dl>
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 border-b border-border px-5 py-4 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline sm:gap-6"
          >
            <dt className="font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase">
              {row.label}
            </dt>
            <dd className="min-w-0 text-[15px] leading-relaxed text-foreground">
              {renderInline(row.value, `snapshot-${row.label}`)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
