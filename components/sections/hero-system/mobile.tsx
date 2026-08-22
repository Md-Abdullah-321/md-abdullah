"use client";

import { cn } from "@/lib/utils";
import { entryNodes, engineModules, outcomeNodes, techStack } from "./data";

/**
 * Mobile system visualization — vertical flow layout.
 * Uses normal document flow (flex/grid), not absolute positioning.
 */
export function HeroSystemMobile({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[360px]", className)}>
      {/* Entry Points */}
      <div className="rounded-xl border border-border bg-card/80 p-4">
        <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          Entry Points
        </p>
        <div className="flex flex-wrap gap-2">
          {entryNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium"
              >
                <Icon className="h-3 w-3 text-primary" />
                {node.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <svg width="24" height="32" viewBox="0 0 24 32">
          <line x1="12" y1="0" x2="12" y2="24" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.4" />
          <polygon points="7,22 12,30 17,22" fill="var(--primary)" fillOpacity="0.4" />
        </svg>
      </div>

      {/* Automation Engine */}
      <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-primary/[0.02] p-5 shadow-sm">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-primary/70">
          Automation Engine
        </p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {engineModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[8px] font-medium text-foreground/70">{mod.label}</span>
              </div>
            );
          })}
        </div>
        {/* Status */}
        <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-primary/10 pt-3">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-flow" />
          <span className="text-[9px] text-muted-foreground">System active</span>
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <svg width="24" height="32" viewBox="0 0 24 32">
          <line x1="12" y1="0" x2="12" y2="24" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.4" />
          <polygon points="7,22 12,30 17,22" fill="var(--primary)" fillOpacity="0.4" />
        </svg>
      </div>

      {/* Business Outcomes */}
      <div className="rounded-xl border border-border bg-card/80 p-4">
        <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          Business Outcomes
        </p>
        <div className="grid grid-cols-2 gap-2">
          {outcomeNodes.slice(0, 4).map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="flex items-center gap-1.5 rounded-md border border-border/70 bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground"
              >
                <Icon className="h-3 w-3 text-muted-foreground/60" />
                {node.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech markers */}
      <p className="mt-4 text-center text-[9px] text-muted-foreground">
        <span className="font-medium">Powered by </span>
        {techStack.join(" · ")}
      </p>
    </div>
  );
}
