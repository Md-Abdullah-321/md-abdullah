"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mainNavItems } from "@/data/navigation";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close on escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);


  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <div className="md:hidden">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-2 text-foreground/80 hover:bg-surface-muted hover:text-foreground transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-14 z-40 bg-background/80 backdrop-blur-sm"
            data-lenis-prevent
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <nav
            id="mobile-nav"
            role="dialog"
            aria-label="Mobile navigation"
            data-lenis-prevent
            className="fixed inset-x-0 top-14 z-50 border-b border-border bg-background p-5 shadow-lg"
          >
            <div className="flex flex-col gap-1">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-surface-muted text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-muted/50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <Button size="lg" variant="primary" className="w-full justify-center" asChild>
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  Start a Conversation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

