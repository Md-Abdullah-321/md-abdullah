import Link from "next/link";
import { Container } from "@/components/layout/container";
import { getSiteSettings } from "@/lib/supabase/settings";
import { mainNavItems } from "@/data/navigation";

export async function Footer() {
  const settings = await getSiteSettings();

  const socialLinks = [
    settings.link_linkedin && { label: "LinkedIn", href: settings.link_linkedin },
    settings.link_github && { label: "GitHub", href: settings.link_github },
    settings.link_upwork && { label: "Upwork", href: settings.link_upwork },
    settings.link_youtube && { label: "YouTube", href: settings.link_youtube },
    settings.link_twitter && { label: "Twitter", href: settings.link_twitter },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-border bg-surface-muted">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Identity */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-sm font-bold">{settings.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {settings.title}
              </p>
              {settings.public_email && (
                <a
                  href={`mailto:${settings.public_email}`}
                  className="mt-3 block text-sm text-muted-foreground hover:text-foreground"
                >
                  {settings.public_email}
                </a>
              )}
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pages
              </p>
              <nav className="mt-3 flex flex-col gap-2" aria-label="Footer navigation">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Professional links */}
            {socialLinks.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Professional
                </p>
                <nav className="mt-3 flex flex-col gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {settings.name}. All rights
              reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
