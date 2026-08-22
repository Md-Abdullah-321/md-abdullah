"use client";

import { cn } from "@/lib/utils";
import { Clock, Zap } from "lucide-react";

/**
 * Desktop: Two-column before/after using CSS layout.
 * No SVG. Strong typography. Clear hierarchy.
 */
export function ProcessDesktop() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* ─── LEFT: How it often works ─── */}
      <div className="rounded-xl border border-border/70 bg-card p-6 md:p-8">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
          How it often works
        </p>

        <div className="mt-6 space-y-5">
          <Step number="01" label="Website" sub="New enquiry arrives" />
          <Step number="02" label="Form submitted" sub="Lead information captured" detail="Sarah Miller · 09:42 AM" />
          <Step number="03" label="CRM" sub="Lead created" detail="Status: New · Unassigned" />
          <Divider />
          <ManualStep label="Manual handoff" sub="Someone has to notice and assign this" />
          <ManualStep label="Follow-up" sub="Someone has to remember to send the message" detail="3 hours later..." />
          <Divider />
          <FadedStep label="Customer waiting" sub="Lead may have moved on" />
        </div>
      </div>

      {/* ─── RIGHT: What changes ─── */}
      <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-6 md:p-8">
        <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60">
          What changes
        </p>

        <div className="mt-6 space-y-5">
          <ActiveStep number="01" label="Website" sub="Enquiry arrives" />
          <ActiveStep number="02" label="CRM" sub="Lead created and routed automatically" />
          <ActiveStep number="03" label="Automation" sub="Follow-up starts immediately" isHighlight detail="Message sent · 09:42 AM" />
          <ActiveStep number="04" label="Calendar" sub="Next available slot offered" />
          <ActiveStep number="05" label="CRM updated" sub="Record stays current automatically" />
          <ActiveStep number="06" label="Team notified" sub="Only when human judgment is needed" isMuted />
        </div>
      </div>
    </div>
  );
}

/* ─── Left-side components ────────────────────────────── */

function Step({ number, label, sub, detail }: { number: string; label: string; sub: string; detail?: string }) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 font-mono text-[11px] font-bold text-border/80">{number}</span>
      <div>
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground/70">{sub}</p>
        {detail && <p className="mt-0.5 font-mono text-[9px] text-muted-foreground/50">{detail}</p>}
      </div>
    </div>
  );
}

function ManualStep({ label, sub, detail }: { label: string; sub: string; detail?: string }) {
  return (
    <div className="flex gap-3">
      <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning/60" />
      <div>
        <p className="text-[13px] font-semibold text-warning/80">{label}</p>
        <p className="text-[11px] text-muted-foreground/70">{sub}</p>
        {detail && <p className="mt-0.5 font-mono text-[9px] text-muted-foreground/50">{detail}</p>}
      </div>
    </div>
  );
}

function FadedStep({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex gap-3 opacity-50">
      <span className="shrink-0 text-[11px]">·</span>
      <div>
        <p className="text-[12px] text-muted-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground/60">{sub}</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-dashed border-warning/20" />;
}

/* ─── Right-side components ───────────────────────────── */

function ActiveStep({ number, label, sub, detail, isHighlight, isMuted }: { number: string; label: string; sub: string; detail?: string; isHighlight?: boolean; isMuted?: boolean }) {
  return (
    <div className={cn("flex gap-3", isMuted && "opacity-60")}>
      <span className={cn("shrink-0 font-mono text-[11px] font-bold", isHighlight ? "text-primary" : "text-primary/40")}>
        {number}
      </span>
      <div>
        <div className="flex items-center gap-2">
          <p className={cn("text-[13px] font-semibold", isHighlight ? "text-primary" : "text-foreground")}>{label}</p>
          {isHighlight && <Zap className="h-3 w-3 text-primary/60" />}
        </div>
        <p className="text-[11px] text-muted-foreground/70">{sub}</p>
        {detail && <p className="mt-0.5 font-mono text-[9px] text-primary/40">{detail}</p>}
      </div>
    </div>
  );
}
