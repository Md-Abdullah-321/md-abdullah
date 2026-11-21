"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mainNavItems, NAV_DESTINATIONS } from "@/data/navigation";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";

const wrap =
  "mx-auto flex h-full w-full max-w-[1240px] items-center justify-between gap-3 px-[clamp(20px,4vw,56px)]";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full overflow-x-clip border-b border-border bg-background">
      <div className={wrap}>
        <Logo />

        <nav className="hidden lg:block" aria-label="Main navigation">
          <ul className="flex items-center gap-8">
            {mainNavItems.map((item) => {
              const destination = NAV_DESTINATIONS[item.href];
              return (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="px-0 text-sm font-normal text-foreground/75 hover:text-green-deep"
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
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            size="md"
            variant="primary"
            asChild
            className="h-[34px] rounded-[6px] px-3 text-[12.5px] hover:translate-y-0 lg:h-[38px] lg:px-4 lg:text-sm"
          >
            <Link
              href="/#contact"
              onClick={() =>
                pushDataLayerEvent({
                  event: "cta_click",
                  cta_name: "start_a_conversation",
                  location: "header",
                })
              }
            >
              Start a Conversation
              <span aria-hidden="true">→</span>
            </Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
