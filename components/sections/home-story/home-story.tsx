import { TrackLink } from "@/components/analytics/track-link";
import { Button } from "@/components/ui/button";
import { LeadCanvas } from "./lead-canvas";
import "./story.css";

const RAIL = [
  ["01", "Problem"],
  ["02", "Capture"],
  ["03", "Follow up"],
  ["04", "Qualify"],
  ["05", "Book"],
  ["06", "Booked"],
] as const;

/**
 * Opening frame of the homepage: positioning, the two actions, and the
 * lead diagram at rest. Scroll beats are wired in the next section.
 */
export function HomeStory() {
  return (
    <section
      id="story"
      aria-label="How a connected system works"
      className="relative min-h-[calc(100dvh-4rem)] overflow-x-clip bg-background lg:h-[calc(100dvh-4rem)] lg:min-h-[720px] lg:overflow-hidden"
    >
      <p className="sr-only">
        A diagram of a CRM, email, SMS, a voice agent and a calendar, drawn as
        separate tiles on graph paper. The tools are not connected yet.
      </p>

      <div className="absolute inset-x-0 top-0 h-[38vh] lg:inset-y-0 lg:left-[43%] lg:h-auto">
        <p className="absolute left-0 top-[18px] z-10 hidden font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint lg:block">
          FIG. 1 · Lead path
        </p>
        <LeadCanvas />
      </div>

      <div className="relative mx-auto h-full w-full max-w-[1240px] px-[clamp(20px,4vw,56px)]">
        <div className="relative z-10 flex flex-col pt-[40vh] pb-8 lg:absolute lg:top-0 lg:bottom-0 lg:left-[clamp(20px,4vw,56px)] lg:w-[min(520px,40vw)] lg:pt-0 lg:pb-0">
          <div className="lg:absolute lg:top-1/2 lg:w-full lg:-translate-y-[calc(50%+10px)]">
            <p className="flex items-center gap-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-green-deep lg:gap-3 lg:text-xs lg:tracking-[0.14em]">
              <span className="h-px w-[18px] bg-primary lg:w-7" aria-hidden="true" />
              GoHighLevel Automation &amp; Integration Engineer
            </p>
            <h1 className="mt-3.5 font-sans text-[38px] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground lg:mt-[22px] lg:text-[clamp(44px,4.4vw,64px)]">
              I build systems{" "}
              <span className="hl-mark inline lg:whitespace-nowrap">around your business.</span>
            </h1>
            <p className="mt-3.5 max-w-[470px] text-base leading-relaxed text-muted-foreground lg:mt-6 lg:text-lg">
              I connect the tools your business already relies on, remove the
              manual handoffs between them, and build workflows that keep
              working when nobody is watching.
            </p>
            <div className="mt-[22px] flex flex-col gap-2.5 lg:mt-8 lg:flex-row lg:flex-wrap lg:gap-3">
              <Button
                size="lg"
                variant="primary"
                asChild
                className="group h-12 w-full rounded-[6px] px-5 text-[14.5px] hover:translate-y-0 lg:w-auto lg:px-[22px] lg:text-[15px]"
              >
                <TrackLink
                  href="/contact"
                  event={{
                    event: "cta_click",
                    cta_name: "start_a_conversation",
                    location: "hero",
                  }}
                >
                  Start a Conversation
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                    →
                  </span>
                </TrackLink>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group h-12 w-full rounded-[6px] border-border bg-white px-5 text-[14.5px] hover:translate-y-0 hover:border-foreground hover:bg-white lg:w-auto lg:px-[22px] lg:text-[15px]"
              >
                <TrackLink
                  href="/work"
                  event={{
                    event: "cta_click",
                    cta_name: "see_my_work",
                    location: "hero",
                  }}
                >
                  See My Work
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                    ↗
                  </span>
                </TrackLink>
              </Button>
            </div>
            <p className="mt-10 hidden items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint lg:flex">
              <span className="hl-hint-bar" aria-hidden="true" />
              Scroll to follow one lead
            </p>
          </div>

          <ol className="absolute right-0 bottom-11 left-0 hidden list-none lg:flex" aria-hidden="true">
            {RAIL.map(([num, label]) => (
              <li
                key={num}
                className="relative flex-1 pt-3 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-faint"
              >
                <span className="absolute top-0 right-1.5 left-0 h-0.5 bg-border" />
                <em className="mb-0.5 block font-normal not-italic">{num}</em>
                <span className="block">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
