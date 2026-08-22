import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  label?: string;
  dashed?: boolean;
}

export function Divider({ className, label, dashed }: DividerProps) {
  if (label) {
    return (
      <div className={cn("relative flex items-center py-4", className)}>
        <div
          className={cn(
            "flex-grow border-t border-border",
            dashed && "border-dashed"
          )}
          aria-hidden="true"
        />
        <span className="shrink-0 px-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
          {label}
        </span>
        <div
          className={cn(
            "flex-grow border-t border-border",
            dashed && "border-dashed"
          )}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <hr
      className={cn(
        "border-t border-border w-full my-6",
        dashed && "border-dashed",
        className
      )}
    />
  );
}
