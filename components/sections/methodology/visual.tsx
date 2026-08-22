"use client";

import { cn } from "@/lib/utils";
import { Globe, Users, Zap, Cable, Calendar, Send, CheckCircle2 } from "lucide-react";

interface MethodologyVisualProps {
  activeStep: number;
  className?: string;
}

/**
 * Methodology visual — shows the system state as structured content.
 * Each step reveals more structure/connection in the business system.
 * Uses HTML/CSS (not SVG) for reliable rendering.
 */
export function MethodologyVisual({ activeStep, className }: MethodologyVisualProps) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-6 md:p-8", className)}>
      {/* State label */}
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary/60">
        {labels[activeStep]}
      </p>

      {/* Visual content changes per step */}
      <div className="mt-5 min-h-[320px]">
        {activeStep === 0 && <StateUnderstand />}
        {activeStep === 1 && <StateMap />}
        {activeStep === 2 && <StateDesign />}
        {activeStep === 3 && <StateBuild />}
        {activeStep === 4 && <StateConnect />}
        {activeStep === 5 && <StateImprove />}
      </div>
    </div>
  );
}

const labels = [
  "Current state",
  "Process mapped",
  "System designed",
  "Building",
  "Connected",
  "Running",
];

/* ─── State Components ────────────────────────────────── */

function StateUnderstand() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Business systems in use:</p>
      <div className="grid grid-cols-2 gap-3">
        <SystemItem icon={Globe} label="Website" status="Active" />
        <SystemItem icon={Users} label="CRM" status="Active" />
        <SystemItem icon={Calendar} label="Calendar" status="Active" />
        <SystemItem icon={Send} label="Email" status="Active" />
      </div>
      <div className="mt-4 rounded-lg bg-muted/50 p-3">
        <p className="text-[11px] font-medium text-muted-foreground">
          Current state: Tools exist but work separately.
          Information still moves between them by hand.
        </p>
      </div>
    </div>
  );
}

function StateMap() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Process flow identified:</p>
      <div className="space-y-2">
        <FlowStep label="Website" sublabel="Lead arrives" connected />
        <FlowStep label="CRM" sublabel="Lead created" connected />
        <FlowStep label="Manual handoff" sublabel="Someone assigns" isWarning />
        <FlowStep label="Follow-up" sublabel="Someone remembers" isWarning />
        <FlowStep label="Calendar" sublabel="If lead hasn't left" isMuted />
      </div>
      <div className="mt-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-warning/80">2 manual handoffs</span> found.
          Response depends on someone noticing in time.
        </p>
      </div>
    </div>
  );
}

function StateDesign() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">What the system looks like:</p>
      <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">What gets automated</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <MiniNode label="Workflow triggers" />
          <MiniNode label="AI routing" />
          <MiniNode label="Auto follow-up" />
          <MiniNode label="CRM sync" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>Human involvement: decisions only</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}

function StateBuild() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Implementation:</p>
      <div className="space-y-2">
        <BuildItem label="CRM pipeline restructured" done />
        <BuildItem label="Workflow triggers configured" done />
        <BuildItem label="API connections built" done />
        <BuildItem label="AI qualification logic" active />
        <BuildItem label="Follow-up sequences" pending />
        <BuildItem label="Calendar integration" pending />
      </div>
    </div>
  );
}

function StateConnect() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Everything connected:</p>
      <div className="space-y-2">
        <FlowStep label="Website" sublabel="Lead arrives" connected isActive />
        <FlowStep label="CRM" sublabel="Auto-assigned" connected isActive />
        <FlowStep label="Automation" sublabel="Follow-up instant" connected isActive isAccent />
        <FlowStep label="Calendar" sublabel="Slot offered" connected isActive />
        <FlowStep label="CRM" sublabel="Record updated" connected isActive />
        <FlowStep label="Team" sublabel="Notified when needed" connected />
      </div>
    </div>
  );
}

function StateImprove() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">System status:</p>
      <div className="space-y-2">
        <StatusRow label="Manual handoffs" value="Removed" good />
        <StatusRow label="Follow-ups" value="Automatic" good />
        <StatusRow label="CRM updates" value="In sync" good />
        <StatusRow label="Team involvement" value="When needed" good />
      </div>
      <div className="mt-4 rounded-lg border border-success/20 bg-success/5 p-3">
        <p className="text-[11px] text-muted-foreground">
          System running. Team only gets involved for qualified conversations and real decisions.
        </p>
      </div>
    </div>
  );
}

/* ─── Micro-components ────────────────────────────────── */

function SystemItem({ icon: Icon, label, status }: { icon: typeof Globe; label: string; status: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background p-2.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
      <div>
        <p className="text-[11px] font-medium">{label}</p>
        <p className="text-[9px] text-muted-foreground/50">{status}</p>
      </div>
    </div>
  );
}

function FlowStep({ label, sublabel, connected, isWarning, isMuted, isActive, isAccent }: { label: string; sublabel: string; connected?: boolean; isWarning?: boolean; isMuted?: boolean; isActive?: boolean; isAccent?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", isMuted && "opacity-50")}>
      <div className={cn(
        "h-2 w-2 rounded-full",
        isAccent ? "bg-primary" : isActive ? "bg-primary/60" : isWarning ? "bg-warning/60" : "bg-border"
      )} />
      {connected && <div className={cn("h-px w-4", isActive ? "bg-primary/40" : "bg-border")} />}
      <div>
        <p className={cn("text-[12px] font-medium", isAccent && "text-primary", isWarning && "text-warning/80")}>{label}</p>
        <p className="text-[10px] text-muted-foreground/60">{sublabel}</p>
      </div>
    </div>
  );
}

function MiniNode({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-primary/15 bg-primary/[0.03] px-2.5 py-1.5">
      <p className="text-[10px] font-medium text-primary/70">{label}</p>
    </div>
  );
}

function BuildItem({ label, done, active, pending }: { label: string; done?: boolean; active?: boolean; pending?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <CheckCircle2 className={cn("h-3.5 w-3.5", done ? "text-success" : active ? "text-primary" : "text-border")} />
      <p className={cn("text-[12px]", done ? "text-foreground/70" : active ? "font-medium text-foreground" : "text-muted-foreground/50")}>{label}</p>
    </div>
  );
}

function StatusRow({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/50 bg-background px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={cn("text-[11px] font-semibold", good ? "text-success" : "text-foreground")}>{value}</p>
    </div>
  );
}
