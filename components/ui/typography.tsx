import { cn } from "@/lib/utils";

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: TypographyElement;
}

/**
 * Typography scale:
 *
 * Display:   42→48→56→64px  (headings font, weight 600, tight tracking)
 * H1:        36→42→48px
 * H2:        28→32→40px
 * H3:        22→24→28px
 * H4:        18px
 * BodyLarge: 18px
 * Body:      16px
 * BodySmall: 14px
 * Caption:   12px
 * Label:     13px
 */
const styles = {
  display:
    "font-heading text-[2.625rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem]",
  h1: "font-heading text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.015em] sm:text-[2.625rem] md:text-[3rem]",
  h2: "font-heading text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] sm:text-[2rem] md:text-[2.5rem]",
  h3: "font-heading text-[1.375rem] font-semibold leading-[1.2] tracking-[-0.005em] sm:text-[1.5rem] md:text-[1.75rem]",
  h4: "font-heading text-lg font-semibold leading-[1.3]",
  bodyLarge: "text-lg leading-[1.6]",
  body: "text-base leading-[1.6]",
  bodySmall: "text-sm leading-[1.6]",
  caption: "text-xs text-muted-foreground",
  label: "text-[13px] font-medium leading-none",
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
