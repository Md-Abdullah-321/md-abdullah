import { ContactLink } from "@/components/analytics/contact-link";
import { getSiteSettings } from "@/lib/supabase/settings";

type Kind = "email" | "whatsapp" | "upwork" | "fiverr" | "linkedin";

type Row = {
  kind: Kind;
  label: string;
  detail: string;
  description: string;
  action: string;
  href: string;
  external?: boolean;
};

/**
 * Same channel copy as the contact page. Destinations come from settings.
 */
const COPY = {
  email: {
    label: "EMAIL",
    description: "Best for project details, requirements and longer conversations.",
    action: "Send an email",
  },
  whatsapp: {
    label: "WHATSAPP",
    detail: "Start a direct conversation.",
    description: "Best if you want to ask a quick question or discuss an idea.",
    action: "Open WhatsApp",
  },
  upwork: {
    label: "UPWORK",
    detail: "Client work and reviews",
    description: "See my work history, client reviews and recent projects.",
    action: "View my Upwork profile",
  },
  fiverr: {
    label: "FIVERR",
    detail: "Hire me through Fiverr",
    description: "Browse my services and send a project request through Fiverr.",
    action: "View Fiverr Profile",
  },
  linkedin: {
    label: "LINKEDIN",
    detail: "Professional connection",
    description: "Connect with me professionally or start a conversation.",
    action: "Connect on LinkedIn",
  },
} as const;

function Icon({ kind }: { kind: Kind }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    "aria-hidden": true as const,
  };
  if (kind === "email") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
      </svg>
    );
  }
  if (kind === "whatsapp") {
    return (
      <svg {...common}>
        <path d="M4 20l1.3-4A8 8 0 1 1 8.4 19L4 20z" />
        <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 9.5z" strokeWidth="1.3" />
      </svg>
    );
  }
  if (kind === "upwork") {
    return (
      <svg {...common}>
        <path d="M4 6v5a4 4 0 0 0 8 0V6" />
        <path d="M12 11c1 3 2.5 5 5 5a3.5 3.5 0 0 0 0-7c-2.5 0-4 2-5 8l-1 4" />
      </svg>
    );
  }
  if (kind === "fiverr") {
    return (
      <svg {...common}>
        <path d="M9 20V10h7v10" />
        <path d="M6 10h4M9 10V8a3 3 0 0 1 3-3h1" />
        <circle cx="16" cy="6.5" r=".9" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10v7M7.5 7v.01M11.5 17v-7M11.5 13a3 3 0 0 1 5 0v4" />
    </svg>
  );
}

export async function HomeContact() {
  const settings = await getSiteSettings();
  const rows: Row[] = [];
  if (settings.public_email) {
    rows.push({
      kind: "email",
      ...COPY.email,
      detail: settings.public_email,
      href: `mailto:${settings.public_email}`,
    });
  }
  if (settings.link_whatsapp) {
    rows.push({ kind: "whatsapp", ...COPY.whatsapp, href: settings.link_whatsapp, external: true });
  }
  if (settings.link_upwork) {
    rows.push({ kind: "upwork", ...COPY.upwork, href: settings.link_upwork, external: true });
  }
  if (settings.link_fiverr) {
    rows.push({ kind: "fiverr", ...COPY.fiverr, href: settings.link_fiverr, external: true });
  }
  if (settings.link_linkedin) {
    rows.push({ kind: "linkedin", ...COPY.linkedin, href: settings.link_linkedin, external: true });
  }

  return (
    <section id="contact" className="scroll-mt-16 border-t border-border bg-background py-[88px] lg:py-[140px]">
      <div className="mx-auto w-full max-w-[1240px] px-[clamp(20px,4vw,56px)]">
        <p className="flex items-center gap-2.5 font-mono text-[10.5px] font-medium tracking-[0.1em] text-green-deep uppercase lg:gap-3 lg:text-xs lg:tracking-[0.14em]">
          <span className="h-px w-[18px] bg-primary lg:w-7" aria-hidden="true" />
          Let&apos;s talk
        </p>
        <h2 className="mt-5 max-w-[16ch] font-mono text-[clamp(40px,5.4vw,76px)] leading-[1.02] font-semibold tracking-[-0.04em]">
          Tell me what you&apos;re
          <br />
          <span className="text-primary">trying to fix.</span>
        </h2>
        <p className="mt-6 max-w-[560px] text-lg text-muted-foreground">
          If something in your business is taking too much time, tell me what is happening. You don&apos;t need to know the technical solution. I&apos;ll take a look and tell you how I&apos;d approach it.
        </p>
        <div className="mt-11 border-t border-foreground lg:mt-[72px]">
          {rows.map((row, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <ContactLink
                key={row.kind}
                href={row.href}
                contactMethod={row.kind}
                location="home_contact"
                external={row.external}
                className="group grid grid-cols-[44px_minmax(0,1fr)] items-start gap-x-4 gap-y-1 border-b border-border py-[22px] transition-colors hover:bg-primary/[0.035] lg:grid-cols-[56px_60px_minmax(0,1.1fr)_minmax(0,1.4fr)_210px] lg:items-center lg:gap-6 lg:px-1.5 lg:py-[26px]"
              >
                <span className="hidden font-mono text-[13px] text-green-deep lg:block">{number}</span>
                <span className="row-span-3 grid h-11 w-11 place-items-center rounded-lg border border-border bg-white text-primary transition-colors group-hover:border-primary lg:row-span-1">
                  <Icon kind={row.kind} />
                </span>
                <span>
                  <span className="block font-mono text-[13px] font-semibold tracking-[0.14em] group-hover:text-green-deep">
                    <span className="mr-2 font-medium text-green-deep lg:hidden">{number}</span>
                    {row.label}
                  </span>
                  <span className="mt-0.5 block text-[15px] text-foreground/80 group-hover:text-green-deep">
                    {row.detail}
                  </span>
                </span>
                <span className="col-start-2 text-[15px] text-muted-foreground group-hover:text-green-deep lg:col-auto">
                  {row.description}
                </span>
                <span className="col-start-2 mt-2 inline-flex items-center gap-2 font-mono text-[13px] group-hover:text-green-deep lg:col-auto lg:mt-0 lg:justify-self-end">
                  {row.action}
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </ContactLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
