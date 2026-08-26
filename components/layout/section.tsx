import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /** Reduce vertical padding for denser sections */
  compact?: boolean;
  /** HTML element to render */
  as?: "section" | "div" | "article";
  /** Optional ID for the section */
  id?: string;
}

export function Section({
  children,
  className,
  compact,
  as: Component = "section",
  id = "",
}: SectionProps) {
  return (
    <Component
      id={id}
      className={cn(
        compact ? "py-12 md:py-16" : "py-16 md:py-24 lg:py-24",
        className,
      )}
    >
      {children}
    </Component>
  );
}
