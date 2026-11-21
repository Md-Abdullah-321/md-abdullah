import { RichText } from "@/components/ui/rich-text";

/** The stored outcome, plus before/after text when those fields exist. */
export function CaseChanged({
  content,
  before,
  after,
}: {
  content: string;
  before?: string | null;
  after?: string | null;
}) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,4vw,56px)] py-14 md:py-20">
        <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.14em] text-green-deep uppercase">
          <span className="h-px w-5 bg-primary" aria-hidden="true" />
          What changed
        </p>
        <h2 className="mt-4 max-w-3xl font-sans text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.035em] text-foreground sm:text-[2.25rem]">
          What now runs on its own.
        </h2>
        {(before || after) && (
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {before ? (
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">Before</p>
                <RichText content={before} className="mt-3 text-[15px] leading-7 text-muted-foreground" />
              </div>
            ) : null}
            {after ? (
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-green-deep uppercase">After</p>
                <RichText content={after} className="mt-3 text-[15px] leading-7 text-muted-foreground" />
              </div>
            ) : null}
          </div>
        )}
        <RichText
          content={content}
          className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-[17px] sm:leading-8"
        />
      </div>
    </section>
  );
}
