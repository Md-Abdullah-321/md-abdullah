import { getHomepageHeroTestimonials } from "@/lib/supabase/queries";
import { getSiteSettings } from "@/lib/supabase/settings";
import { ProofCard, type ProofQuote } from "./proof-card";

const STATS = [
  ["35+", "GHL subaccounts managed"],
  ["10+", "Agencies supported"],
  ["10+", "A2P registrations"],
] as const;

function attribution(name: string, company: string | null) {
  const client = name.trim();
  const org = company?.trim();
  return org ? `${client} · ${org}` : client;
}

export async function HomeProof() {
  const settings = await getSiteSettings();
  const testimonials = await getHomepageHeroTestimonials(settings.hero_testimonial_id);
  const quotes: ProofQuote[] = testimonials.map((item) => ({
    id: item.id,
    quote: item.quote.replaceAll("enthusistic", "enthusiastic"),
    attribution: attribution(item.client_name, item.company),
  }));

  return (
    <section id="reviews" className="scroll-mt-16 border-t border-border bg-background py-[88px] lg:py-[140px]">
      <div className="mx-auto w-full max-w-[1240px] px-[clamp(20px,4vw,56px)]">
        <div className="grid items-start gap-9 lg:grid-cols-[5fr_6fr] lg:gap-[72px]">
          <div>
            <p className="flex items-center gap-2.5 font-mono text-[10.5px] font-medium tracking-[0.1em] text-green-deep uppercase lg:gap-3 lg:text-xs lg:tracking-[0.14em]">
              <span className="h-px w-[18px] bg-primary lg:w-7" aria-hidden="true" />
              Reviews
            </p>
            <h2 className="mt-5 font-mono text-[clamp(34px,3.8vw,52px)] leading-[1.06] font-semibold tracking-[-0.04em]">
              What clients
              <br />
              say on <span className="text-primary">Upwork.</span>
            </h2>
            <p className="mt-[22px] max-w-[430px] text-[17px] text-muted-foreground">
              The reviews are public. Read them in full on my Upwork profile, including the ones that aren&apos;t quoted here.
            </p>
          </div>
          <ProofCard quotes={quotes} upworkUrl={settings.link_upwork} />
        </div>
        <div className="mt-14 grid border-t border-foreground lg:mt-24 lg:grid-cols-3">
          {STATS.map(([value, label], index) => (
            <div
              key={label}
              className={`border-b border-border py-[22px] lg:border-b-0 lg:border-r lg:py-7 lg:pr-7 ${index > 0 ? "lg:pl-7" : ""} ${index === STATS.length - 1 ? "border-b-0 lg:border-r-0" : ""}`}
            >
              <b className="block font-mono text-[clamp(44px,5vw,64px)] leading-none font-semibold tracking-[-0.05em]">
                {value}
              </b>
              <span className="mt-3.5 block font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
