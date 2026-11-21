import Link from "next/link";
import { TrackLink } from "@/components/analytics/track-link";

export function CaseNeighbors({
  previous,
  next,
}: {
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Other case studies"
      className="mx-auto grid w-full max-w-6xl gap-6 px-[clamp(20px,4vw,56px)] py-10 sm:grid-cols-2"
    >
      {previous ? (
        <Link href={`/work/${previous.slug}`} className="group block border-t border-border pt-4">
          <span className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">Previous</span>
          <span className="mt-2 block font-sans text-lg font-semibold tracking-[-0.02em] group-hover:text-green-deep">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/work/${next.slug}`} className="group block border-t border-border pt-4 sm:text-right">
          <span className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">Next</span>
          <span className="mt-2 block font-sans text-lg font-semibold tracking-[-0.02em] group-hover:text-green-deep">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

export function CaseContactCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,4vw,56px)] py-16 md:py-20">
        <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.14em] text-green-deep uppercase">
          <span className="h-px w-5 bg-primary" aria-hidden="true" />
          Next step
        </p>
        <h2 className="mt-4 max-w-xl font-sans text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[2.25rem]">
          Have a similar problem?
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          Tell me what is happening and we can figure out what makes sense for your business.
        </p>
        <TrackLink
          href="/contact"
          event={{
            event: "cta_click",
            cta_name: "start_a_conversation",
            location: "next_step",
          }}
          className="mt-8 inline-flex h-12 items-center bg-foreground px-5 text-[15px] font-medium text-background"
        >
          Start a Conversation <span aria-hidden="true" className="ml-2">→</span>
        </TrackLink>
      </div>
    </section>
  );
}
