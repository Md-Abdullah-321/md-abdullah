"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:bg-foreground/90 shadow-xs active:scale-[0.99]",
        secondary:
          "bg-surface-muted text-foreground border border-border hover:bg-muted/70 hover:border-foreground/20",
        outline:
          "border border-border bg-surface/50 text-foreground hover:bg-surface-muted hover:border-foreground/30",
        ghost: "hover:bg-surface-muted text-foreground",
        accent:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:scale-[0.99]",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90",
        link: "text-foreground underline-offset-4 hover:underline hover:text-primary p-0 h-auto font-normal",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9.5 px-4 text-sm",
        lg: "h-11 px-5 text-sm sm:text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  /** Render as child element (e.g., Link) instead of button */
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, icon, children, disabled, asChild, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {children}
          </>
        ) : icon ? (
          <>
            <span aria-hidden="true">{icon}</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };

