"use client";

import { cn } from "@/lib/utils";
import { entryNodes, engineModules, outcomeNodes, techStack } from "./data";

/**
 * Desktop system visualization.
 * Uses SVG for connections + CSS grid for node placement.
 * Three-tier layout: entries (top) → engine (center) → outcomes (bottom).
 */
export function HeroSystemDesktop({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full", className)} aria-label="Business automation architecture" role="img">
      {/* SVG connections layer */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 600 540"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          <radialGradient id="dsk-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Engine glow */}
        <ellipse cx="300" cy="270" rx="130" ry="80" fill="url(#dsk-glow)" />

        {/* Entry → Engine connections */}
        <path d="M 80,70 Q 180,160 235,220" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.45" id="flow-a1" />
        <path d="M 190,55 Q 240,140 260,210" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M 300,50 Q 300,130 300,210" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M 410,55 Q 360,140 340,210" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.35" id="flow-b1" />
        <path d="M 520,70 Q 420,160 365,220" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />

        {/* Engine → Outcome connections */}
        <path d="M 235,320 Q 180,380 100,430" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M 260,330 Q 230,390 210,440" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M 300,335 Q 300,390 300,440" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M 340,330 Q 370,390 400,440" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M 365,320 Q 430,380 510,430" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.4" id="flow-a2" />

        {/* Animated data particles — Flow A: Website → Engine → Follow-up */}
        <circle r="4" fill="var(--primary)" opacity="0.75">
          <animateMotion dur="3.5s" repeatCount="indefinite" begin="0s">
            <mpath xlinkHref="#flow-a1" />
          </animateMotion>
        </circle>
        <circle r="4" fill="var(--primary)" opacity="0.65">
          <animateMotion dur="3.5s" repeatCount="indefinite" begin="1.8s">
            <mpath xlinkHref="#flow-a2" />
          </animateMotion>
        </circle>

        {/* Animated data particles — Flow B: Voice AI → Engine */}
        <circle r="3.5" fill="var(--primary)" opacity="0.55">
          <animateMotion dur="4.5s" repeatCount="indefinite" begin="1s">
            <mpath xlinkHref="#flow-b1" />
          </animateMotion>
        </circle>

        {/* Engine border rings */}
        <ellipse cx="300" cy="270" rx="115" ry="65" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.3" />
        <ellipse cx="300" cy="270" rx="100" ry="52" stroke="var(--primary)" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="6 4" />
      </svg>

      {/* ─── HTML Content Layer ─── */}
      <div className="relative grid h-[540px] grid-rows-[auto_1fr_auto] gap-0" style={{ width: "100%" }}>
        {/* ── Top: Entry nodes ── */}
        <div className="flex items-start justify-between px-4 pt-2">
          {entryNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium shadow-sm transition-transform duration-200 hover:scale-105 hover:border-primary/30 hover:shadow-md"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{node.label}</span>
              </div>
            );
          })}
        </div>

        {/* ── Center: Engine ── */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-primary/30 bg-gradient-to-b from-primary/[0.06] to-primary/[0.02] px-8 py-5 shadow-lg backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/60">
              Automation Engine
            </p>
            <div className="flex items-center gap-4">
              {engineModules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div key={mod.id} className="flex flex-col items-center gap-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] font-semibold text-foreground/70">{mod.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-flow" />
              <span className="text-[9px] text-muted-foreground">System active · Data flowing</span>
            </div>
            {/* Tech markers */}
            <p className="pt-1 text-[8px] text-muted-foreground/70">
              {techStack.join(" · ")}
            </p>
          </div>
        </div>

        {/* ── Bottom: Outcome nodes ── */}
        <div className="flex items-end justify-between px-4 pb-2">
          {outcomeNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/80 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm transition-transform duration-200 hover:scale-105 hover:border-primary/20"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
                <span>{node.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
