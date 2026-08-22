import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  arrow?: "diagonal" | "right" | "none";
}

export function TextLink({
  href,
  children,
  className,
  external,
  arrow = "right",
}: TextLinkProps) {
  const isExternal = external || href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary",
        className
      )}
    >
      <span className="relative">
        {children}
        <span
          className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-200 group-hover:w-full"
          aria-hidden="true"
        />
      </span>
      {arrow === "right" && (
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 text-muted-foreground group-hover:text-primary" />
      )}
      {arrow === "diagonal" && (
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-muted-foreground group-hover:text-primary" />
      )}
    </Link>
  );
}
