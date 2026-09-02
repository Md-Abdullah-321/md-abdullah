import { Container } from "@/components/layout/container";
import { ContactLink } from "@/components/analytics/contact-link";
import { getSiteSettings } from "@/lib/supabase/settings";

type ContactMethod = "email" | "whatsapp" | "upwork" | "linkedin";

export async function Footer() {
  const settings = await getSiteSettings();

  const links: {
    label: string;
    href: string;
    contactMethod?: ContactMethod;
  }[] = [
    settings.link_linkedin && { label: "LinkedIn", href: settings.link_linkedin, contactMethod: "linkedin" },
    settings.link_github && { label: "GitHub", href: settings.link_github },
    settings.link_youtube && { label: "YouTube", href: settings.link_youtube },
    settings.link_upwork && { label: "Upwork", href: settings.link_upwork, contactMethod: "upwork" },
    settings.link_twitter && { label: "Twitter", href: settings.link_twitter },
  ].filter(Boolean) as {
    label: string;
    href: string;
    contactMethod?: ContactMethod;
  }[];

  const renderConnectLink = (link: { label: string; href: string; contactMethod?: ContactMethod }) => {
    if (link.contactMethod) {
      return (
        <ContactLink
          key={link.href}
          href={link.href}
          contactMethod={link.contactMethod}
          location="footer"
          external
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
          <span className="sr-only"> (opens in new tab)</span>
        </ContactLink>
      );
    }
    return (
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
    );
  };

  return (
    <footer className="border-t border-border bg-surface-muted">
      <Container>
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
              <ContactLink
                href={`mailto:${settings.public_email}`}
                contactMethod="email"
                location="footer"
                className="mt-3 inline-block text-sm text-foreground/70 hover:text-foreground"
              >
                {settings.public_email}
              </ContactLink>
            )}
          </div>

          {/* Professional links */}
          {links.length > 0 && (
            <div className="mt-8 md:mt-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Connect
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {links.map(renderConnectLink)}
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
