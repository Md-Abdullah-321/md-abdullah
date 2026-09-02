import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getSiteSettings } from "@/lib/supabase/settings";
import { cn } from "@/lib/utils";
import { ContactLink } from "@/components/analytics/contact-link";
import { ArrowUpRight, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Md Abdullah what is taking too much time in your business and start a direct conversation.",
};

// Brand icon paths from simple-icons (CC0) — lucide v1 no longer ships brand icons.
const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";
const UPWORK_PATH =
  "M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z";
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

type MethodKind = "email" | "whatsapp" | "upwork" | "linkedin";

type ContactMethod = {
  kind: MethodKind;
  label: string;
  detail: string;
  description: string;
  action: string;
  href: string;
  primary?: boolean;
  external?: boolean;
};

/**
 * Constant presentation copy for the contact list. Only the destinations
 * (email address / URLs) come from Admin → Settings.
 */
const METHOD_COPY = {
  email: {
    label: "EMAIL",
    description:
      "Best for project details, requirements and longer conversations.",
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
  linkedin: {
    label: "LINKEDIN",
    detail: "Professional connection",
    description: "Connect with me professionally or start a conversation.",
    action: "Connect on LinkedIn",
  },
} as const;

function BrandIcon({ path, className }: { path: string; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

/**
 * Icon sizes per surface. The desktop row keeps its existing boxed icon
 * proportions; the mobile card renders a small inline icon that follows the
 * hero proof card's accent language.
 */
const ICON_CLASSES: Record<MethodKind, { card: string; row: string }> = {
  email: { card: "h-4 w-4", row: "h-7 w-7 lg:h-9 lg:w-9" },
  whatsapp: { card: "h-4 w-4", row: "h-7 w-7 lg:h-9 lg:w-9" },
  upwork: { card: "h-[11px] w-4", row: "h-[19px] w-7 lg:h-[27px] lg:w-10" },
  linkedin: { card: "h-4 w-4", row: "h-[27px] w-[27px] lg:h-[34px] lg:w-[34px]" },
};

function ContactIcon({ kind, className }: { kind: MethodKind; className: string }) {
  switch (kind) {
    case "email":
      return <Mail className={className} strokeWidth={2} aria-hidden="true" />;
    case "whatsapp":
      return <BrandIcon path={WHATSAPP_PATH} className={className} />;
    case "upwork":
      return <BrandIcon path={UPWORK_PATH} className={className} />;
    case "linkedin":
      return <BrandIcon path={LINKEDIN_PATH} className={className} />;
  }
}

/**
 * One contact method. Desktop (sm+) keeps the existing 5-column row grid.
 * Mobile renders a small proof card that reuses the homepage hero's
 * UpworkProof design language: bordered surface with the pale-green clipped
 * corner, mono metadata row with the number as a quiet annotation, platform
 * + icon, detail, divider, description and a text CTA.
 */
function ContactRow({
  number,
  method,
}: {
  number: number;
  method: ContactMethod;
}) {
  return (
    <ContactLink
      className="group block"
      href={method.href}
      contactMethod={method.kind}
      location="contact_page"
      external={method.external}
    >
      {/* Mobile card — mirrors the hero UpworkProof card. */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm sm:hidden">
        <div
          className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-accent/70"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                Contact method
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <ContactIcon
                  kind={method.kind}
                  className={cn(
                    ICON_CLASSES[method.kind].card,
                    "shrink-0 text-primary"
                  )}
                />
                <span className="font-mono text-sm font-semibold tracking-[0.06em]">
                  {method.label}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {method.detail}
              </p>
            </div>
            <p className="shrink-0 font-mono text-xs text-muted-foreground">
              {String(number).padStart(2, "0")}
            </p>
          </div>
          <div className="mt-5 border-t border-border/70 pt-4">
            <p className="max-w-[38ch] text-sm leading-relaxed text-foreground/85">
              {method.description}
            </p>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 whitespace-nowrap font-mono text-[11px] font-semibold tracking-[0.08em] text-foreground transition-colors group-hover:text-primary">
            {method.action}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* Desktop row — unchanged from the existing design. */}
      <div
        className={`hidden sm:grid sm:grid-cols-[44px_56px_minmax(0,0.9fr)_minmax(0,1.3fr)_190px] sm:items-center sm:gap-4 sm:px-6 sm:py-9 sm:min-h-[7.5rem] lg:grid-cols-[70px_90px_285px_1fr_190px] ${method.primary ? "sm:bg-accent/45" : ""}`}
      >
        <span className="font-mono text-sm font-semibold tracking-[-0.04em] text-primary">
          {String(number).padStart(2, "0")}
        </span>
        <span className="flex h-14 w-14 items-center justify-center justify-self-center rounded-[14px] border border-border/80 bg-surface text-primary lg:h-[60px] lg:w-[60px]">
          <ContactIcon
            kind={method.kind}
            className={ICON_CLASSES[method.kind].row}
          />
        </span>
        <div className="self-center">
          <p className="font-mono text-sm font-semibold tracking-[0.12em] text-foreground">
            {method.label}
          </p>
          <p className="mt-2 text-sm text-foreground/80">{method.detail}</p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {method.description}
        </p>
        <span className="inline-flex items-center gap-2 justify-self-end whitespace-nowrap font-mono text-[11px] font-semibold tracking-[0.08em] text-foreground transition-colors group-hover:text-primary">
          {method.action}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </ContactLink>
  );
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.public_email;

  // Constant copy from METHOD_COPY combined with destinations from the CMS.
  const methods: ContactMethod[] = [
    ...(email
      ? [
          {
            ...METHOD_COPY.email,
            kind: "email" as const,
            detail: email,
            href: `mailto:${email}`,
            primary: true,
          },
        ]
      : []),
    ...(settings.link_whatsapp
      ? [
          {
            ...METHOD_COPY.whatsapp,
            kind: "whatsapp" as const,
            href: settings.link_whatsapp,
            external: true,
          },
        ]
      : []),
    ...(settings.link_upwork
      ? [
          {
            ...METHOD_COPY.upwork,
            kind: "upwork" as const,
            href: settings.link_upwork,
            external: true,
          },
        ]
      : []),
    ...(settings.link_linkedin
      ? [
          {
            ...METHOD_COPY.linkedin,
            kind: "linkedin" as const,
            href: settings.link_linkedin,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <main className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none absolute -right-72 -top-24 -z-10 h-[42rem] w-[42rem] rounded-full bg-accent/45 blur-3xl" />
      <div className="pointer-events-none absolute -left-72 bottom-24 -z-10 hidden h-[34rem] w-[34rem] rounded-full border border-primary/[0.07] bg-primary/[0.025] lg:block" />
      <Section className="pt-20 md:pt-32 lg:pt-40">
        <Container>
          <RevealGroup as="header" className="max-w-4xl" stagger={0.08}>
            <RevealItem variant="label">
              <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-primary">
                LET&apos;S TALK
              </p>
            </RevealItem>
            <RevealItem variant="heading">
              <h1 className="mt-6 max-w-4xl font-mono text-4xl font-semibold leading-[1.01] tracking-[-0.07em] text-foreground sm:text-6xl lg:text-8xl">
                Tell me what you&apos;re
                <br />
                <span className="text-primary">trying to fix.</span>
              </h1>
            </RevealItem>
            <RevealItem variant="body">
              <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                If something in your business is taking too much time, tell me
                what is happening. You do not need to know the technical
                solution. I&apos;ll take a look and tell you how I&apos;d
                approach it.
              </p>
            </RevealItem>
          </RevealGroup>
          <RevealGroup
            className="mt-16 max-w-6xl space-y-4 sm:space-y-0 sm:divide-y sm:divide-border/80 sm:overflow-hidden sm:rounded-md sm:border sm:border-border/80"
            stagger={0.05}
          >
            {methods.map((method, index) => (
              <RevealItem key={method.label + index} variant="item">
                <ContactRow number={index + 1} method={method} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
      {email && (
        <Section className="pt-0 md:pt-0">
          <Container>
            <Reveal variant="body" className="flex flex-col gap-4 border-t border-border/80 pt-7 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">
                  PREFER ANOTHER WAY?
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Email is usually the easiest place to start.
                </p>
              </div>
              <ContactLink
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-foreground transition-colors hover:text-primary"
                href={`mailto:${email}`}
                contactMethod="email"
                location="contact_page"
              >
                {email}
                <ArrowUpRight className="h-4 w-4" />
              </ContactLink>
            </Reveal>
          </Container>
        </Section>
      )}
    </main>
  );
}
