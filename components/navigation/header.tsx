"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/brand-mark";
import { Container } from "@/components/layout/container";
import { mainNavItems } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";

export function Header() {
  // Subtle state change once the page scrolls — the bar gains a slightly
  // stronger background, nothing else moves.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors",
        scrolled
          ? "border-border bg-background/95"
          : "border-border/80 bg-background/90"
      )}
    >
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* Identity & Brand Signature */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="Md Abdullah Home"
          >
            <BrandMark size="sm" className="text-foreground group-hover:text-primary transition-colors" />
            <div className="flex items-center">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Md Abdullah
              </span>
              <span className="hidden sm:inline-block border-l border-border pl-2.5 ml-2.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Automation &amp; Systems
              </span>
            </div>
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
          <div className="flex items-center gap-3">
            <Button size="sm" variant="primary" asChild className="hidden md:inline-flex">
              <Link href="/contact">
                Start a Conversation
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
