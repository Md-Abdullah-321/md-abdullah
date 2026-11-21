import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Body } from "@/components/ui/typography";
import { AboutPortrait } from "@/components/sections/about/portrait";
import { getSiteSettings } from "@/lib/supabase/settings";
import { resolveExternalImageUrl } from "@/lib/media/image-url";
import { generatePersonJsonLd, JsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Md Abdullah is an Automation & Integration Engineer who connects business tools, automates repetitive work, and builds custom workflows.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Md Abdullah",
    description:
      "Md Abdullah is an Automation & Integration Engineer who connects business tools, automates repetitive work, and builds custom workflows.",
  },
};

const automateItems = ["Routine follow-ups", "Data movement between systems", "Notifications and reminders", "Record keeping and updates", "Lead assignment and routing"];
const humanItems = ["Relationship conversations", "Complex judgment calls", "Exception handling", "Strategic decisions", "Creative problem solving"];
const capabilities = [
  ["01", "CRM & sales systems", "I set up the CRM around how the team actually works."],
  ["02", "Automation", "I remove repetitive handoffs, follow-ups, and manual updates."],
  ["03", "Integrations & APIs", "I connect systems that need to share data but do not have a direct link."],
  ["04", "AI automation", "I use AI when it can handle a useful part of the process without making things harder to manage."],
  ["05", "Custom software", "I build the missing pieces when existing platforms are not enough."],
];
const tools = ["GoHighLevel", "n8n", "Make", "Zapier", "OpenAI", "Stripe", "NMI", "WordPress", "Node.js", "Supabase", "React", "Next.js"];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-primary">{children}</p>;
}

function ListColumn({ title, items, accent = false }: { title: string; items: string[]; accent?: boolean }) {
  return <div className="border-t border-border/80 pt-5"><p className={`font-mono text-[11px] font-semibold tracking-[0.16em] ${accent ? "text-primary" : "text-muted-foreground"}`}>{title}</p><ul className="mt-6 space-y-3 text-sm leading-6 text-foreground/80">{items.map((item) => <li className="flex gap-4" key={item}><span className={`mt-[11px] h-1 w-1 shrink-0 rounded-full ${accent ? "bg-primary" : "bg-border"}`} />{item}</li>)}</ul></div>;
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const profileImageUrl = resolveExternalImageUrl(settings.profile_image_url);

  return <><JsonLd data={generatePersonJsonLd(settings)} /><div className="bg-background">
    <section className="pt-14 md:pt-20">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-[clamp(20px,4vw,56px)] lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <div>
          <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.14em] text-green-deep uppercase">
            <span className="h-px w-5 bg-primary" aria-hidden="true" />
            About
          </p>
          <h1 className="mt-4 max-w-3xl font-sans text-[2.15rem] leading-[1.08] font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            GoHighLevel Automation &amp; Integration Engineer.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Based in Dhaka. I work with businesses in the US, the UK and Australia.
          </p>
          {settings.bio ? <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{settings.bio}</p> : null}
        </div>
        <AboutPortrait src={profileImageUrl} name={settings.name} />
      </div>
    </section>

    <Section className="relative bg-surface-muted/45"><Container><div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24"><div className="max-w-md"><Label>HOW I THINK</Label><h2 className="mt-5 font-mono text-3xl font-semibold leading-[1.04] tracking-[-0.06em] sm:text-5xl">Automation is not about automating everything.</h2></div><div><p className="max-w-2xl text-xl leading-8 text-foreground sm:text-2xl sm:leading-9">The best systems remove the repetitive work so people can focus on the decisions that actually require them.</p><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">I start by understanding how the business operates. Sometimes the answer is a CRM workflow. Sometimes it is an API integration. Sometimes it is custom software. And sometimes the best answer is to leave something alone.</p><div className="mt-12 grid gap-10 sm:grid-cols-2"><ListColumn title="AUTOMATE" items={automateItems} accent /><ListColumn title="KEEP HUMAN" items={humanItems} /></div></div></div></Container></Section>

    <Section><Container><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><Label>BACKGROUND</Label><h2 className="mt-5 font-mono text-3xl font-semibold leading-[1.04] tracking-[-0.06em] sm:text-5xl">How I got here.</h2></div><div className="max-w-2xl space-y-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"><p>I started from software development and gradually moved closer to the business process itself. The more systems I worked with, the more I noticed that the hardest problems were rarely about writing code.</p><p>They were about making different systems, people, and processes work together. That is what pushed me toward automation and integrations.</p></div></div></Container></Section>

    <Section className="border-y border-border/70 bg-background"><Container><div className="max-w-3xl"><Label>WHAT I WORK ON</Label><h2 className="mt-5 font-mono text-3xl font-semibold leading-[1.04] tracking-[-0.06em] sm:text-5xl">The business problem comes first.</h2><Body className="mt-6 text-muted-foreground">The tools change from project to project. The work is finding the gap, then building the right system around it.</Body></div><div className="mt-16 divide-y divide-border/80 border-y border-border/80">{capabilities.map(([number, title, copy]) => <article className="grid gap-5 py-8 sm:grid-cols-[64px_0.85fr_1.15fr] sm:items-start sm:gap-8" key={number}><Label>{number}</Label><h3 className="font-mono text-xl font-semibold uppercase leading-tight tracking-[-0.04em] text-foreground sm:text-2xl">{title}</h3><p className="max-w-md text-base leading-7 text-muted-foreground">{copy}</p></article>)}</div></Container></Section>

    <Section className="pb-20 md:pb-28"><Container><div className="flex flex-col gap-6 border-t border-border/80 pt-6 sm:flex-row sm:items-baseline sm:justify-between"><Label>TOOLS I USE</Label><div className="flex max-w-3xl flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-muted-foreground">{tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div></Container></Section>
  </div></>;
}
