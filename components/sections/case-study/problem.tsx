import { RichText } from "@/components/ui/rich-text";

/** The stored problem text, with a plain heading. No invented summary. */
export function CaseProblem({ content }: { content: string }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,4vw,56px)] py-14 md:py-20">
        <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.14em] text-green-deep uppercase">
          <span className="h-px w-5 bg-primary" aria-hidden="true" />
          The business problem
        </p>
        <h2 className="mt-4 max-w-3xl font-sans text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.035em] text-foreground sm:text-[2.25rem]">
          Where the work got stuck.
        </h2>
        <RichText
          content={content}
          className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-[17px] sm:leading-8"
        />
      </div>
    </section>
  );
}
