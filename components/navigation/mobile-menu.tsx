"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { mainNavItems, NAV_DESTINATIONS } from "@/data/navigation";
import { durations, easings } from "@/lib/motion";
import { pushDataLayerEvent } from "@/lib/analytics/data-layer";

export function MobileMenu() {
  const pathname = usePathname();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // The menu is considered open only while the route is unchanged since it
  // was opened. Route changes (link clicks, back/forward) close it naturally.
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const isOpen = openPathname !== null && openPathname === pathname;

  const open = useCallback(() => {
    setOpenPathname(pathname);
    // Let the drawer mount before moving focus into it.
    requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [pathname]);

  const close = useCallback(() => {
    setOpenPathname(null);
    // Return focus to the trigger once the drawer has unmounted.
    requestAnimationFrame(() => openButtonRef.current?.focus());
  }, []);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  return (
    <>
      {/* Hamburger trigger — mobile only */}
      <button
        ref={openButtonRef}
        type="button"
        onClick={open}
        className="rounded-md p-2 text-foreground/80 transition-colors hover:bg-surface-muted hover:text-foreground md:hidden"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[60] flex flex-col bg-background md:hidden"
            style={{ height: "100dvh" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast, ease: easings.out }}
            data-lenis-prevent
          >
            {/* Top bar: logo + close */}
            <div className="flex h-[4.25rem] shrink-0 items-center justify-between px-4 sm:px-6">
              <Logo eventLocation="mobile_menu" onClick={close} />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="rounded-md p-2 text-foreground/80 transition-colors hover:bg-surface-muted hover:text-foreground"
                aria-label="Close menu"
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Divider below the top bar */}
            <div className="mx-4 h-px shrink-0 bg-border sm:mx-6" aria-hidden="true" />

            {/* Scrollable middle: nav + CTA */}
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-6">
              <nav
                id="mobile-nav"
                aria-label="Mobile navigation"
                className="flex flex-col"
              >
                {mainNavItems
                  .filter((item) => item.href !== "/contact")
                  .map((item, index) => {
                    const destination = NAV_DESTINATIONS[item.href];
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{
                          duration: durations.normal,
                          ease: easings.out,
                          delay: durations.fast + index * 0.04,
                        }}
                        className="border-b border-border/60 last:border-b-0"
                      >
                        <Link
                          href={item.href}
                          onClick={() => {
                            close();
                            if (destination) {
                              pushDataLayerEvent({
                                event: "nav_click",
                                destination,
                                location: "mobile_menu",
                              });
                            }
                          }}
                          className={`flex min-h-14 items-center justify-between py-3 font-mono text-2xl font-medium tracking-[-0.02em] transition-colors ${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="font-mono text-xs text-muted-foreground/50">
                            0{index + 1}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
              </nav>

              <div className="mt-auto pt-10">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full justify-center"
                  asChild
                >
                  <Link
                    href="/contact"
                    onClick={() => {
                      close();
                      pushDataLayerEvent({
                        event: "cta_click",
                        cta_name: "start_a_conversation",
                        location: "mobile_menu",
                      });
                    }}
                  >
                    Start a Conversation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
