import { ContactLink } from "@/components/analytics/contact-link";
import { getSiteSettings } from "@/lib/supabase/settings";
import { Logo } from "./logo";

type ContactMethod = "email" | "whatsapp" | "upwork" | "fiverr" | "linkedin";

const PAGES = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  const elsewhere: {
    label: string;
    href: string;
    contactMethod?: ContactMethod;
  }[] = [];
  if (settings.link_linkedin) elsewhere.push({ label: "LinkedIn", href: settings.link_linkedin, contactMethod: "linkedin" });
  if (settings.link_github) elsewhere.push({ label: "GitHub", href: settings.link_github });
  if (settings.link_youtube) elsewhere.push({ label: "YouTube", href: settings.link_youtube });
  if (settings.link_upwork) elsewhere.push({ label: "Upwork", href: settings.link_upwork, contactMethod: "upwork" });
  if (settings.link_fiverr) elsewhere.push({ label: "Fiverr", href: settings.link_fiverr, contactMethod: "fiverr" });
  if (settings.link_twitter) elsewhere.push({ label: "Twitter", href: settings.link_twitter });

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-[1240px] px-[clamp(20px,4vw,56px)] py-14 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-[340px] text-sm text-muted-foreground">
              GoHighLevel Automation &amp; Integration Engineer. I connect CRMs,
              calendars, messaging and voice agents into systems that run on
              their own.
            </p>
          </div>
          <div>
            <p className="mb-3.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-faint">
              PAGES
            </p>
            <ul className="text-sm leading-[2.1]">
              {PAGES.map((page) => (
                <li key={page.href}>
                  <a href={page.href} className="hover:text-green-deep">
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {elsewhere.length > 0 ? (
            <div>
              <p className="mb-3.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-faint">
                ELSEWHERE
              </p>
              <ul className="text-sm leading-[2.1]">
                {elsewhere.map((link) => (
                  <li key={link.href}>
                    {link.contactMethod ? (
                      <ContactLink
                        href={link.href}
                        contactMethod={link.contactMethod}
                        location="footer"
                        external
                        className="hover:text-green-deep"
                      >
                        {link.label} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </ContactLink>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-deep"
                      >
                        {link.label} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-[22px] font-mono text-[11px] text-ink-faint sm:flex-row sm:justify-between">
          <span>
            © {year} {settings.name}
          </span>
          {settings.public_email ? (
            <ContactLink
              href={`mailto:${settings.public_email}`}
              contactMethod="email"
              location="footer"
              className="hover:text-green-deep"
            >
              {settings.public_email}
            </ContactLink>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
