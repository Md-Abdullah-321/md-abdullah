import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Geometric "A" brand signature.
 * Minimalist, architectural mark representing connected systems, precision geometry, and data bridging.
 */
export function BrandMark({ className, size = "md" }: BrandMarkProps) {
  const sizeMap = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-foreground transition-colors", sizeMap[size], className)}
      aria-label="Md Abdullah Logo"
    >
      {/* Precision Geometric 'A' Mark */}
      <path
        d="M12 3L4 20H8.5L12 11.5L15.5 20H20L12 3Z"
        fill="currentColor"
      />
      {/* Precision Data Bridge */}
      <rect
        x="7.5"
        y="14.5"
        width="9"
        height="2"
        fill="var(--primary)"
        rx="0.5"
      />
    </svg>
  );
}
