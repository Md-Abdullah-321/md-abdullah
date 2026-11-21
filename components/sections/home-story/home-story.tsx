"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { TrackLink } from "@/components/analytics/track-link";
import { Button } from "@/components/ui/button";
import { LeadCanvas } from "./lead-canvas";
import "./story.css";

const BOUNDS = [0.11, 0.27, 0.4, 0.52, 0.64, 0.77];
const RAIL: Array<[[number, number], string, string]> = [
  [[0.11, 0.27], "01", "Problem"],
  [[0.27, 0.4], "02", "Capture"],
  [[0.4, 0.52], "03", "Follow up"],
  [[0.52, 0.64], "04", "Qualify"],
  [[0.64, 0.77], "05", "Book"],
  [[0.77, 0.9], "06", "Booked"],
];

const LOG: Array<{ from: number; until?: number; node: ReactNode }> = [
  { from: 0.14, until: 0.27, node: "› form.submitted" },
  {
    from: 0.18,
    until: 0.27,
    node: (
      <s className="text-ink-faint no-underline">
        {"  ⨯ no owner, no reply"}
      </s>
    ),
  },
  {
    from: 0.33,
    node: (
      <>
        › contact.created <b>→ crm</b>
      </>
    ),
  },
  {
    from: 0.45,
    node: (
      <>
        › sms.sent · email.sent <b>12s</b>
      </>
    ),
  },
  {
    from: 0.57,
    node: (
      <>
        › call.answered <b>→ qualified</b>
      </>
    ),
  },
  { from: 0.69, node: "› slot.offered · slot.picked" },
  {
    from: 0.8,
    node: (
      <>
        › appointment.booked <b>✓</b>
      </>
    ),
  },
];

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function storyProgress(story: HTMLElement) {
  const top = story.getBoundingClientRect().top;
  const start = 64;
  const end = window.innerHeight - story.offsetHeight;
  if (start === end) return 0;
  return clamp((start - top) / (start - end));
}

function Step({ index, label }: { index: string; label: string }) {
  return (
    <p className="mb-3 font-mono text-xs tracking-[0.12em] text-ink-faint uppercase lg:mb-[22px]">
      <b className="font-semibold text-green-deep">{index}</b>
      {" / 06 · "}
      {label}
    </p>
  );
}

/**
 * Sticky lead story. Beat 0 is the hero. Scrolling scrubs the diagram,
 * the rail and the event log. The active beat is shown immediately.
 */
export function HomeStory() {
  const storyRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railRefs = useRef<Array<HTMLLIElement | null>>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const logLineRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    const apply = () => {
      const progress = storyProgress(story);
      progressRef.current = progress;

      let beat = 0;
      for (let i = 0; i < BOUNDS.length; i++) {
        if (progress >= BOUNDS[i]) beat = i + 1;
      }
      beatRefs.current.forEach((el, index) => {
        if (!el) return;
        const on = index === beat;
        el.classList.toggle("is-on", on);
        if (on) el.removeAttribute("inert");
        else el.setAttribute("inert", "");
      });

      railRefs.current.forEach((el, index) => {
        if (!el) return;
        const [from, to] = RAIL[index][0];
        const amount = clamp((progress - from) / (to - from));
        el.style.setProperty("--f", amount.toFixed(3));
      });

      logRef.current?.classList.toggle("is-off", progress < 0.12);
      logLineRefs.current.forEach((el, index) => {
        if (!el) return;
        const line = LOG[index];
        const on = progress >= line.from && progress < (line.until ?? 2);
        el.classList.toggle("is-on", on);
      });
    };

    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <section
      ref={storyRef}
      id="story"
      aria-label="How a connected system works"
      className="relative h-[720vh]"
    >
      <div className="sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden bg-background">
        <p className="sr-only">
          Scroll follows one lead from a missed follow-up through capture,
          SMS and email, a voice agent, a calendar booking, and a booked
          appointment.
        </p>

        <div className="absolute inset-x-0 top-0 h-[38vh] lg:inset-y-0 lg:left-[43%] lg:h-auto">
          <p className="absolute top-[18px] left-0 z-10 hidden font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase lg:block">
            FIG. 1 · Lead path
          </p>
          <LeadCanvas progressRef={progressRef} />
        </div>

        <div className="relative mx-auto h-full w-full max-w-[1240px]">
        <div
          ref={logRef}
          className="hl-log is-off"
          aria-hidden="true"
        >
          <div className="hl-log-h">Event log</div>
          {LOG.map((line, index) => (
            <div
              key={index}
              ref={(el) => {
                logLineRefs.current[index] = el;
              }}
              className="hl-log-l"
            >
              {line.node}
            </div>
          ))}
        </div>

          <div className="absolute top-[40vh] right-[clamp(20px,4vw,56px)] bottom-0 left-[clamp(20px,4vw,56px)] pb-5 lg:top-0 lg:right-auto lg:w-[min(520px,40vw)] lg:pb-0">
            <div
              ref={(el) => {
                beatRefs.current[0] = el;
              }}
              className="hl-beat is-on absolute inset-x-0 top-0 lg:top-1/2 lg:-translate-y-[calc(50%+10px)]"
            >
              <p className="flex min-w-0 items-center gap-2.5 font-mono text-[10.5px] font-medium tracking-[0.1em] wrap-break-word text-green-deep uppercase lg:gap-3 lg:text-xs lg:tracking-[0.14em]">
                <span className="h-px w-[18px] bg-primary lg:w-7" aria-hidden="true" />
                GoHighLevel Automation &amp; Integration Engineer
              </p>
              <h1 className="mt-3.5 font-sans text-[38px] leading-[1.02] font-semibold tracking-[-0.04em] text-foreground lg:mt-[22px] lg:text-[clamp(44px,4.4vw,64px)]">
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
                    href="/#contact"
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
                    href="/#work"
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
              <p className="mt-8 hidden items-center gap-2.5 font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase lg:mt-10 lg:flex">
                <span className="hl-hint-bar" aria-hidden="true" />
                Scroll to follow one lead
              </p>
            </div>

            <Beat
              setRef={(el) => {
                beatRefs.current[1] = el;
              }}
            >
              <Step index="01" label="The problem" />
              <h2 className="mb-3.5 font-sans text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] lg:mb-[22px] lg:text-[clamp(32px,3.4vw,48px)]">
                The gaps between tools are where leads get lost.
              </h2>
              <p className="max-w-[440px] text-base text-muted-foreground lg:text-[17px]">
                A form comes in and nobody follows up. A call rings out. A booking never reaches the CRM. Each tool works on its own. The handoffs between them are where things fall through.
              </p>
            </Beat>

            <Beat
              setRef={(el) => {
                beatRefs.current[2] = el;
              }}
            >
              <Step index="02" label="Capture" />
              <h2 className="mb-3.5 font-sans text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] lg:mb-[22px] lg:text-[clamp(32px,3.4vw,48px)]">
                Lead captured <span className="font-medium text-primary">→</span> CRM
              </h2>
              <p className="max-w-[440px] text-base text-muted-foreground lg:text-[17px]">
                Every enquiry lands in one place, with where it came from, what they asked for and who owns it. No copying between tabs.
              </p>
            </Beat>

            <Beat
              setRef={(el) => {
                beatRefs.current[3] = el;
              }}
            >
              <Step index="03" label="Follow up" />
              <h2 className="mb-3.5 font-sans text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] lg:mb-[22px] lg:text-[clamp(32px,3.4vw,48px)]">
                CRM <span className="font-medium text-primary">→</span> instant SMS + email follow-up
              </h2>
              <p className="max-w-[440px] text-base text-muted-foreground lg:text-[17px]">
                The lead hears back in seconds, not the next morning. The messages go out on their own and stop when the person replies.
              </p>
            </Beat>

            <Beat
              setRef={(el) => {
                beatRefs.current[4] = el;
              }}
            >
              <Step index="04" label="Qualify" />
              <h2 className="mb-3.5 font-sans text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] lg:mb-[22px] lg:text-[clamp(32px,3.4vw,48px)]">
                Voice agent answers and qualifies
              </h2>
              <p className="max-w-[440px] text-base text-muted-foreground lg:text-[17px]">
                Calls get picked up, even after hours. The agent asks your questions and writes the answers back to the contact.
              </p>
            </Beat>

            <Beat
              setRef={(el) => {
                beatRefs.current[5] = el;
              }}
            >
              <Step index="05" label="Book" />
              <h2 className="mb-3.5 font-sans text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] lg:mb-[22px] lg:text-[clamp(32px,3.4vw,48px)]">
                Calendar books the appointment
              </h2>
              <p className="max-w-[440px] text-base text-muted-foreground lg:text-[17px]">
                Qualified leads pick a time that suits them. Reminders, reschedules and no-shows are handled without anyone chasing.
              </p>
            </Beat>

            <Beat
              setRef={(el) => {
                beatRefs.current[6] = el;
              }}
            >
              <Step index="06" label="The result" />
              <h2 className="mb-3.5 font-sans text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] lg:mb-[22px] lg:text-[clamp(32px,3.4vw,48px)]">
                Appointment booked. <span className="text-ink-faint">Nobody copied a thing.</span>
              </h2>
              <p className="max-w-[440px] text-base text-muted-foreground lg:text-[17px]">
                Five tools working as one system. That is the work I do, built around how your business already runs.
              </p>
              <Link
                href="/#work"
                className="mt-6 inline-flex gap-2 border-b border-current pb-0.5 font-mono text-[13px] text-green-deep"
              >
                See systems I&apos;ve built ↓
              </Link>
            </Beat>

            <ol className="absolute right-0 bottom-6 left-0 hidden list-none lg:bottom-11 lg:flex" aria-hidden="true">
              {RAIL.map(([, num, label], index) => (
                <li
                  key={num}
                  ref={(el) => {
                    railRefs.current[index] = el;
                  }}
                  className="relative flex-1 pt-3 font-mono text-[10.5px] tracking-[0.08em] text-ink-faint uppercase"
                >
                  <span className="absolute top-0 right-1.5 left-0 h-0.5 bg-border" />
                  <span className="hl-rail-fill" />
                  <em className="mb-0.5 block font-normal not-italic">{num}</em>
                  <span className="block">{label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Beat({
  children,
  setRef,
}: {
  children: ReactNode;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={setRef}
      className="hl-beat absolute inset-x-0 top-0 lg:top-1/2 lg:-translate-y-1/2"
      inert
    >
      {children}
    </div>
  );
}
