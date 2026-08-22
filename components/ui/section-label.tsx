import { cn } from "@/lib/utils";

interface SectionLabelProps {
  number?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ number, children, className }: SectionLabelProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 font-mono text-[11px] sm:text-[12px] font-medium tracking-[0.08em] uppercase text-muted-foreground", className)}>
      {number && (
        <>
          <span className="text-foreground/80">{number}</span>
          <span className="text-border" aria-hidden="true">/</span>
        </>
      )}
      <span>{children}</span>
    </div>
  );
}
