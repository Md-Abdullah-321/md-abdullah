import { getPublishedProjectsWithWebsite } from "@/lib/supabase/project-content";
import { WorkList, type HomeWorkItem } from "./work-list";
import "./work.css";

/** Approved case-study order from the homepage mockup. Unknown slugs follow. */
const STORY_ORDER = [
  "executive-smash-repairs-workflow-automation",
  "ai-voice-agent-sales-client-onboarding",
  "demo-agent-suite-ai-sales-demos",
  "american-life-insurance-lead-appointment-automation",
  "arctic-dry-ice-service-management",
  "enterprise-gohighlevel-crm-and-ai-automation-system",
];

function summary(value: string | null) {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

export async function HomeWork() {
  const projects = await getPublishedProjectsWithWebsite();
  const ranked = [...projects].sort((a, b) => {
    const ai = STORY_ORDER.indexOf(a.slug);
    const bi = STORY_ORDER.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const items: HomeWorkItem[] = ranked.map((project, index) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: summary(project.short_description),
    category: project.category || "Project",
    client: project.website_label,
    tools: project.technologies ?? [],
    index: index + 1,
  }));

  const six = items.length === 6;

  return (
    <section id="work" className="scroll-mt-16 border-t border-border bg-background py-[88px] lg:py-[140px]">
      <div className="mx-auto w-full max-w-[1240px] px-[clamp(20px,4vw,56px)]">
        <div className="mb-10 grid items-end gap-[18px] lg:mb-16 lg:grid-cols-[5fr_7fr] lg:gap-10">
          <div>
            <p className="flex items-center gap-2.5 font-mono text-[10.5px] font-medium tracking-[0.1em] text-green-deep uppercase lg:gap-3 lg:text-xs lg:tracking-[0.14em]">
              <span className="h-px w-[18px] bg-primary lg:w-7" aria-hidden="true" />
              Work I&apos;ve done
            </p>
            <h2 className="mt-5 font-mono text-[clamp(34px,3.8vw,52px)] leading-[1.06] font-semibold tracking-[-0.04em]">
              {six ? "Six systems," : "Real systems,"}
              <br />
              {six ? "six real " : "real "}
              <span className="text-primary">businesses.</span>
            </h2>
          </div>
          <p className="max-w-[520px] text-[17px] text-muted-foreground lg:justify-self-end">
            Each one started with a business problem, not a tool. Same idea as above: find the gaps, connect what&apos;s already there, and make the handoffs automatic.
          </p>
        </div>
        <p className="mb-[26px] flex items-center gap-2.5 font-mono text-xs text-ink-faint">
          <b className="font-medium text-green-deep">↳</b> from FIG. 1 to production
        </p>
        {items.length === 0 ? (
          <p className="border-y border-dashed border-border py-16 text-center font-mono text-sm text-muted-foreground">
            Case studies coming soon
          </p>
        ) : (
          <WorkList projects={items} />
        )}
      </div>
    </section>
  );
}
