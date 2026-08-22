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
        "relative px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "text-foreground font-semibold"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <span>{children}</span>
      {isActive && (
        <span
          className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

