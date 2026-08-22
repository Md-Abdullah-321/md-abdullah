import { cn } from "@/lib/utils";

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: TypographyElement;
}

/**
 * Editorial Typography Scale:
 * Controlled, readable, restrained, high typographic integrity.
 */
const styles = {
  display:
    "font-mono text-[2rem] sm:text-[2.5rem] lg:text-[2.875rem] font-semibold leading-[1.12] tracking-[-0.03em] text-foreground text-balance",
  h1: "font-mono text-[1.75rem] sm:text-[2.125rem] md:text-[2.375rem] font-semibold leading-[1.15] tracking-[-0.025em] text-foreground text-balance",
  h2: "font-mono text-[1.375rem] sm:text-[1.625rem] md:text-[1.875rem] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground text-balance",
  h3: "font-mono text-[1.125rem] sm:text-[1.25rem] font-semibold leading-[1.3] tracking-[-0.015em] text-foreground",
  h4: "font-mono text-base font-semibold leading-[1.4] text-foreground",
  bodyLarge: "font-sans text-base sm:text-[1.0625rem] leading-[1.65] text-muted-foreground max-w-[65ch]",
  body: "font-sans text-sm sm:text-base leading-[1.6] text-muted-foreground max-w-[65ch]",
  bodySmall: "font-sans text-xs sm:text-sm leading-[1.55] text-muted-foreground",
  caption: "font-mono text-xs text-muted-foreground",
  label: "font-mono text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground",
} as const;


const defaultElements: Record<keyof typeof styles, TypographyElement> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  bodyLarge: "p",
  body: "p",
  bodySmall: "p",
  caption: "span",
  label: "span",
};

function createTypography(variant: keyof typeof styles) {
  function TypographyComponent({
    children,
    className,
    as,
  }: TypographyProps) {
    const Component = as || defaultElements[variant];
    return (
      <Component className={cn(styles[variant], className)}>
        {children}
      </Component>
    );
  }
  TypographyComponent.displayName = `Typography.${variant}`;
  return TypographyComponent;
}

export const Display = createTypography("display");
export const H1 = createTypography("h1");
export const H2 = createTypography("h2");
export const H3 = createTypography("h3");
export const H4 = createTypography("h4");
export const BodyLarge = createTypography("bodyLarge");
export const Body = createTypography("body");
export const BodySmall = createTypography("bodySmall");
export const Caption = createTypography("caption");
export const Label = createTypography("label");

export const typographyStyles = styles;

