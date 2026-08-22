import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/supabase/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  const links = [
    settings.link_linkedin && { label: "LinkedIn", href: settings.link_linkedin },
    settings.link_github && { label: "GitHub", href: settings.link_github },
    settings.link_youtube && { label: "YouTube", href: settings.link_youtube },
    settings.link_upwork && { label: "Upwork", href: settings.link_upwork },
    settings.link_twitter && { label: "Twitter", href: settings.link_twitter },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-border bg-surface-muted">
      <Container className="max-w-[1240px]">
        {/* ─── Primary CTA Area ─── */}
        <div className="py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Next step
          </p>
          <h2 className="mt-3 max-w-[900px] font-heading text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.02em] md:text-[3.5rem] lg:text-[4rem]">
            Have a process
            <br />
            <span className="text-primary">that needs fixing?</span>
          </h2>
          <p className="mt-5 max-w-[620px] text-base leading-relaxed text-muted-foreground md:text-[17px]">
            If work is still moving between people, spreadsheets, inboxes, and
            tools that don&apos;t talk to each other, tell me what&apos;s
            happening. We can figure out where to start.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Start a Conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/work">See My Work</Link>
            </Button>
          </div>
        </div>

        {/* ─── Identity + Links ─── */}
        <div className="border-t border-border py-10 md:flex md:items-start md:justify-between md:gap-12">
          {/* Identity */}
          <div className="max-w-md">
            <p className="font-heading text-base font-semibold">{settings.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{settings.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80">
              I connect business tools through automation, APIs, AI, CRM
              platforms, and custom software.
            </p>
            {settings.public_email && (
              <a
                href={`mailto:${settings.public_email}`}
                className="mt-3 inline-block text-sm text-foreground/70 hover:text-foreground"
              >
                {settings.public_email}
              </a>
            )}
          </div>

          {/* Professional links */}
          {links.length > 0 && (
            <div className="mt-8 md:mt-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Connect
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Bottom ─── */}
        <div className="border-t border-border/50 py-5">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
