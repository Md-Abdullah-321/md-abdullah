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

export function ProcessMobile() {
  return (
    <div className="space-y-9">
      <ProcessGroup label="How it often works" steps={beforeSteps} />

      <div className="flex items-center gap-3 pl-1" aria-hidden="true">
        <span className="h-px w-10 bg-primary/35" />
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary/70">same process, connected</span>
      </div>

      <ProcessGroup label="What changes" steps={afterSteps} active />
    </div>
  );
}

function ProcessGroup({
  label,
  steps,
  active = false,
}: {
  label: string;
  steps: readonly (readonly [string, string, string, string] | readonly [string, string, string])[];
  active?: boolean;
}) {
  return (
    <div className={`border-l pl-5 ${active ? "border-primary/45" : "border-border/80"}`}>
      <p className={`font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${active ? "text-primary" : "text-muted-foreground/65"}`}>
        {label}
      </p>
      <div className="mt-5 space-y-5">
        {steps.map((step) => {
          const [number, title, description, tone] = step;
          const isManual = tone === "manual";
          const isWaiting = tone === "waiting";
          return (
            <div key={number} className={isWaiting ? "opacity-55" : isManual ? "opacity-85" : ""}>
              <div className="flex items-baseline gap-3">
                <span className={`font-mono text-[10px] ${active ? "text-primary/70" : "text-muted-foreground/50"}`}>{number}</span>
                <p className={`font-heading text-sm font-semibold ${isManual ? "text-warning/90" : active ? "text-foreground" : isWaiting ? "text-muted-foreground/60" : "text-foreground"}`}>
                  {title}
                </p>
              </div>
              <p className="mt-1 pl-7 text-xs leading-relaxed text-muted-foreground/75">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
