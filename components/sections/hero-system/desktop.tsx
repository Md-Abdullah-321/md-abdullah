"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Cpu, Database, Send, Sparkles, Terminal } from "lucide-react";
import { systemStages, systemScenarios } from "./data";

export function HeroSystemDesktop() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const currentScenario = systemScenarios[activeScenarioIndex];

  const getStageIcon = (id: string) => {
    switch (id) {
      case "inputs":
        return <Terminal className="h-3.5 w-3.5 text-muted-foreground" />;
      case "processing":
        return <Cpu className="h-3.5 w-3.5 text-primary" />;
      case "crm":
        return <Database className="h-3.5 w-3.5 text-muted-foreground" />;
      case "outcomes":
        return <Send className="h-3.5 w-3.5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full rounded-lg border border-border bg-surface shadow-sm overflow-hidden text-foreground">
      {/* ─── Header: System Control Bar ────────────────── */}
      <div className="flex items-center justify-between border-b border-border bg-surface-muted/60 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/80">
              Live Pipeline Architecture
            </span>
          </div>
          <span className="hidden xl:inline-block text-border" aria-hidden="true">|</span>
          <span className="hidden xl:inline-block font-mono text-[10px] text-muted-foreground">
            Zero-latency webhook orchestration
          </span>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded border border-border/80">
          {systemScenarios.map((scenario, idx) => {
            const isSelected = activeScenarioIndex === idx;
            return (
              <button
                key={scenario.id}
                onClick={() => setActiveScenarioIndex(idx)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                  isSelected
                    ? "bg-foreground text-background font-medium shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {scenario.badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Main Pipeline Grid: 4 Connected Stages ────── */}
      <div className="p-4 bg-surface">
        <div className="grid grid-cols-4 gap-2.5 relative">
          {systemStages.map((stage, idx) => {
            const isHovered = hoveredStage === stage.id;
            const isLast = idx === systemStages.length - 1;

            return (
              <div
                key={stage.id}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                className={`relative flex flex-col justify-between rounded border p-3 transition-all duration-150 ${
                  isHovered
                    ? "border-primary/50 bg-accent/20"
                    : "border-border/80 bg-surface-muted/30 hover:border-border"
                }`}
              >
                {/* Stage Header */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                    <div className="flex items-center gap-1.5">
                      {getStageIcon(stage.id)}
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {stage.stepNumber}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                      {stage.id === "processing" ? "Engine" : "Node"}
                    </span>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-[13px] font-semibold text-foreground leading-tight">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Stage Items */}
                  <div className="mt-3 space-y-1.5">
                    {stage.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="rounded bg-background/90 border border-border/60 px-2 py-1.5 text-[11px]"
                      >
                        <div className="font-medium text-foreground leading-tight flex items-center justify-between">
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-border/40 font-mono text-[9.5px] text-muted-foreground">
                          <span>{item.detail}</span>
                          {item.tech && (
                            <span className="text-primary font-medium">{item.tech.split(" / ")[0]}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow connector indicator */}
                {!isLast && (
                  <div
                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden lg:flex h-4 w-4 items-center justify-center rounded-full bg-surface border border-border shadow-xs text-muted-foreground"
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-2.5 w-2.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Live Execution Flow Story ───────────────── */}
        <div className="mt-3 rounded border border-border/80 bg-surface-muted/40 p-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
                Active Scenario: {currentScenario.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>Automated in &lt;15s</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-[11.5px]">
            <div className="rounded bg-background p-2 border border-border/60">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                1. Captured Input
              </span>
              <span className="font-medium text-foreground mt-0.5 block leading-tight">
                {currentScenario.input}
              </span>
            </div>
            <div className="rounded bg-background p-2 border border-border/60">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-primary font-semibold">
                2. AI &amp; Logic Decision
              </span>
              <span className="font-medium text-foreground mt-0.5 block leading-tight">
                {currentScenario.aiAction}
              </span>
            </div>
            <div className="rounded bg-background p-2 border border-border/60">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                3. Direct Outcome
              </span>
              <span className="font-medium text-foreground mt-0.5 block leading-tight">
                {currentScenario.outcome}
              </span>
            </div>
          </div>

          {/* Code/Payload Trace */}
          <div className="mt-2 flex items-center justify-between rounded bg-foreground text-background px-3 py-1.5 font-mono text-[10px]">
            <span className="text-muted-foreground">
              payload: <span className="text-emerald-400">{`{ event: "${currentScenario.payload.event}", leadType: "${currentScenario.payload.leadType}", route: "${currentScenario.payload.routing}" }`}</span>
            </span>
            <span className="text-primary-foreground font-medium hidden sm:inline-block">
              {currentScenario.payload.automation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

