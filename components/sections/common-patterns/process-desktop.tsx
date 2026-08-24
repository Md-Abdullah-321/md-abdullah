const beforeSteps = [
  ["01", "Website", "New enquiry arrives", "neutral"],
  ["02", "Form submitted", "Lead information captured", "neutral"],
  ["03", "CRM", "Lead created", "neutral"],
  ["04", "Manual handoff", "Someone has to notice and assign this", "manual"],
  ["05", "Follow up", "Someone has to remember to send the message", "manual"],
  ["06", "Customer waits", "The next step depends on someone being available", "waiting"],
] as const;

const afterSteps = [
  ["01", "Website", "Enquiry arrives"],
  ["02", "CRM", "Lead created and routed automatically"],
  ["03", "Automation", "Follow up starts immediately"],
  ["04", "Calendar", "Next available slot offered"],
  ["05", "CRM updated", "Record stays current automatically"],
  ["06", "Team notified", "Only when human judgement is needed"],
] as const;

export function ProcessDesktop() {
  return (
    <div className="relative grid gap-10 md:grid-cols-[0.82fr_1fr] md:gap-14 lg:gap-20">
      <div className="border-l border-border/80 pl-5 md:pl-7">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/65">
          How it often works
        </p>
        <div className="mt-6 space-y-5">
          {beforeSteps.map(([number, label, description, tone]) => (
            <BeforeStep key={number} number={number} label={label} description={description} tone={tone} />
          ))}
        </div>
      </div>

      <div className="relative rounded-lg border border-primary/15 bg-card/80 p-6 shadow-xs md:p-8">
        <div className="absolute -left-14 top-1/2 hidden w-14 -translate-y-1/2 items-center md:flex" aria-hidden="true">
          <span className="h-px w-full bg-primary/30" />
          <span className="absolute right-0 h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
          What changes
        </p>
        <div className="mt-6 space-y-5">
          {afterSteps.map(([number, label, description]) => (
            <AfterStep key={number} number={number} label={label} description={description} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BeforeStep({
  number,
  label,
  description,
  tone,
}: {
  number: string;
  label: string;
  description: string;
  tone: "neutral" | "manual" | "waiting";
}) {
  const toneClass = tone === "manual" ? "text-warning/90" : tone === "waiting" ? "text-muted-foreground/60" : "text-foreground";
  const opacityClass = tone === "waiting" ? "opacity-55" : tone === "manual" ? "opacity-85" : "";

  return (
    <div className={`grid grid-cols-[28px_1fr] gap-3 ${opacityClass}`}>
      <span className="font-mono text-[10px] text-muted-foreground/50">{number}</span>
      <div>
        <p className={`font-heading text-sm font-semibold ${toneClass}`}>{label}</p>
        <p className="mt-0.5 max-w-[31ch] text-xs leading-relaxed text-muted-foreground/75">{description}</p>
        {tone === "manual" && <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-warning/60">needs a person</span>}
      </div>
    </div>
  );
}

function AfterStep({ number, label, description }: { number: string; label: string; description: string }) {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-3">
      <span className="font-mono text-[10px] font-semibold text-primary/70">{number}</span>
      <div className="relative">
        <span className="absolute -left-[18px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        <p className="font-heading text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 max-w-[34ch] text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
