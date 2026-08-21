import { cn } from "@/lib/utils";

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: TypographyElement;
}

const styles = {
  display:
    "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
  h1: "text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl",
  h2: "text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl",
  h3: "text-xl font-semibold tracking-tight sm:text-2xl",
  h4: "text-lg font-semibold tracking-tight",
  bodyLarge: "text-lg leading-relaxed",
  body: "text-base leading-relaxed",
  bodySmall: "text-sm leading-relaxed",
  caption: "text-xs text-muted-foreground",
  label: "text-sm font-medium leading-none",
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

/** Utility: get raw class string for a typography variant */
export const typographyStyles = styles;
