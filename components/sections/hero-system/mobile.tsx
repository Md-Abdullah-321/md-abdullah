"use client";

import { useState } from "react";
import { ArrowDown, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { systemStages, systemScenarios } from "./data";

export function HeroSystemMobile({ className }: { className?: string }) {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const currentScenario = systemScenarios[activeScenarioIndex];

  return (
    <div className={cn("w-full rounded-lg border border-border bg-surface p-4 shadow-sm text-foreground", className)}>
      {/* ─── Mobile Header & Scenario Toggle ────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
            System Pipeline
          </span>
        </div>

        <div className="flex items-center gap-1 bg-surface-muted p-0.5 rounded border border-border">
          {systemScenarios.map((scenario, idx) => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenarioIndex(idx)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                activeScenarioIndex === idx
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {scenario.badge.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Stacked Stages ─────────────────────────── */}
      <div className="pt-3 space-y-2">
        {systemStages.map((stage, idx) => {
          const isLast = idx === systemStages.length - 1;
          return (
            <div key={stage.id} className="relative">
              <div className="rounded border border-border/80 bg-surface-muted/30 p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-semibold text-primary">
                      {stage.stepNumber}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {stage.title}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {stage.items[0]?.tech?.split(" / ")[0]}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap gap-1">
                  {stage.items.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded bg-background border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>

              {!isLast && (
                <div className="flex justify-center py-1 text-muted-foreground" aria-hidden="true">
                  <ArrowDown className="h-3 w-3 opacity-60" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Active Flow Summary ────────────────────── */}
      <div className="mt-3 rounded border border-border/80 bg-surface-muted/50 p-2.5 text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>{currentScenario.name}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>&lt;15s</span>
          </div>
        </div>

        <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
          {currentScenario.outcome}
        </p>

        <div className="mt-2 rounded bg-foreground text-background px-2 py-1 font-mono text-[9px] truncate">
          <span className="text-emerald-400">{currentScenario.payload.event}</span> → {currentScenario.payload.automation}
        </div>
      </div>
    </div>
  );
}

