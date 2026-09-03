"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative px-3 py-1.5 text-sm font-medium tracking-[-0.01em] transition-colors",
        isActive
          ? "text-foreground font-semibold"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <span className="relative">
        {children}
        <span
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 rounded-full bg-foreground/60 transition-transform duration-150 ease-out",
            !isActive && "group-hover:scale-x-100"
          )}
          aria-hidden="true"
        />
      </span>
      {isActive && (
        <span
          className="absolute inset-x-3 bottom-0 h-px bg-foreground/70 rounded-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

