"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { mainNavItems, NAV_DESTINATIONS } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";
import { Logo } from "./logo";
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
          : "border-border/70 bg-background/85"
      )}
    >
      <Container>
        <div className="flex h-[4.25rem] items-center justify-between md:h-[4.6rem]">
          {/* Identity & Brand Signature */}
          <Logo />

          {/* Desktop nav */}
          <nav
            className="hidden items-center md:flex"
            aria-label="Main navigation"
          >
            <div className="flex items-center gap-0.5 lg:gap-1">
              {mainNavItems
                .filter((item) => item.href !== "/contact")
                .map((item) => {
                  const destination = NAV_DESTINATIONS[item.href];
                  return (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      onClick={
                        destination
                          ? () =>
                              pushDataLayerEvent({
                                event: "nav_click",
                                destination,
                                location: "header",
                              })
                          : undefined
                      }
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
            </div>
          </nav>

          {/* Desktop CTA + Mobile toggle */}
          <div className="flex items-center gap-4 md:gap-5">
            <Button
              size="md"
              variant="primary"
              asChild
              className="hidden px-4 md:inline-flex"
            >
              <Link
                href="/contact"
                onClick={() =>
                  pushDataLayerEvent({
                    event: "cta_click",
                    cta_name: "start_a_conversation",
                    location: "header",
                  })
                }
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
