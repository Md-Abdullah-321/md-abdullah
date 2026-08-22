import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { mainNavItems } from "@/data/navigation";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <Container className="max-w-[1240px]">
        <div className="flex h-14 items-center justify-between">
          {/* Identity */}
          <Link href="/" className="text-sm font-bold tracking-tight">
            Md Abdullah
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {mainNavItems
              .filter((item) => item.href !== "/contact")
              .map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
          </nav>

          {/* Desktop CTA + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Button size="sm" asChild className="hidden md:inline-flex">
              <Link href="/contact">
                Let&apos;s Talk
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
