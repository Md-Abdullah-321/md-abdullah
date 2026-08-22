/**
 * Mobile process — simple vertical composition.
 * No SVG coordinate positioning. Just document flow.
 */
export function ProcessMobile() {
  return (
    <div className="space-y-10">
      {/* BEFORE */}
      <div>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          How it often works
        </p>
        <div className="space-y-3 border-l-2 border-border pl-5">
          <MobileStep label="Website" sublabel="New enquiry · 09:42 AM" />
          <MobileStep label="CRM" sublabel="Lead created · Unassigned" />
          <MobileStep label="Manual handoff" sublabel="Someone has to remember to act" isManual />
          <MobileStep label="Follow-up" sublabel="Sent 3 hours later" isMuted />
          <MobileStep label="Customer waiting" isMuted />
        </div>
      </div>

      {/* BRIDGE */}
      <div className="pl-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary/60">
          The handoff changes
        </p>
      </div>

      {/* AFTER */}
      <div>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary/70">
          What changes
        </p>
        <div className="space-y-3 border-l-2 border-primary/40 pl-5">
          <MobileStep label="Website" sublabel="Enquiry arrives" isActive />
          <MobileStep label="CRM" sublabel="Lead routed automatically" isActive />
          <MobileStep label="Automation" sublabel="Follow-up starts immediately" isActive isHighlight />
          <MobileStep label="Calendar" sublabel="Next step offered" isActive />
          <MobileStep label="CRM updated" sublabel="Record stays current" isActive />
          <MobileStep label="Team steps in" sublabel="Only when judgment needed" />
        </div>
      </div>
    </div>
  );
}

function MobileStep({
  label,
  sublabel,
  isManual,
  isMuted,
  isActive,
  isHighlight,
}: {
  label: string;
  sublabel?: string;
  isManual?: boolean;
  isMuted?: boolean;
  isActive?: boolean;
  isHighlight?: boolean;
}) {
  return (
    <div className={isMuted ? "opacity-50" : ""}>
      <p className={`font-heading text-[13px] font-semibold ${isManual ? "text-warning/80" : isHighlight ? "text-primary" : "text-foreground"}`}>
        {label}
        {isManual && <span className="ml-2 text-[8px] font-bold uppercase tracking-wider text-warning/60">manual</span>}
      </p>
      {sublabel && (
        <p className="text-[11px] text-muted-foreground/70">{sublabel}</p>
      )}
    </div>
  );
}
