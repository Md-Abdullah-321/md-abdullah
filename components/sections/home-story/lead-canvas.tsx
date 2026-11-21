"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { LeadFallback } from "./lead-fallback";
import type { LeadScene } from "./create-lead-scene";

type Mode = "loading" | "webgl";

function wantsStaticDiagram(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!gl) return true;
  gl.getExtension("WEBGL_lose_context")?.loseContext();

  const mobile = window.matchMedia("(max-width: 1023px)").matches;
  if (!mobile) return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return true;
  const network = nav.connection?.effectiveType;
  if (network === "slow-2g" || network === "2g") return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
  if (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2) return true;
  return false;
}

/**
 * Lazy WebGL diagram. The fallback is in the server HTML, so the hero is
 * never a blank box. three.js is imported only after idle, and only when
 * the device can use it.
 */
export function LeadCanvas({
  progressRef,
}: {
  progressRef?: RefObject<number>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("loading");

  useEffect(() => {
    const host = hostRef.current;
    const tags = tagsRef.current;
    if (!host || !tags) return;

    if (wantsStaticDiagram()) return;

    let cancelled = false;
    let scene: LeadScene | null = null;
    let raf = 0;
    let observer: IntersectionObserver | null = null;
    const visible = { current: true };

    const start = () => {
      if (cancelled) return;
      void import("./create-lead-scene").then(({ createLeadScene }) => {
        if (cancelled || !hostRef.current || !tagsRef.current) return;
        scene = createLeadScene(hostRef.current, tagsRef.current);
        if (!scene) return;

        observer = new IntersectionObserver(
          (entries) => {
            visible.current = entries[0]?.isIntersecting ?? false;
          },
          { threshold: 0 }
        );
        observer.observe(hostRef.current);

        let revealed = false;
        const loop = () => {
          raf = requestAnimationFrame(loop);
          if (!scene) return;
          if (!visible.current || document.hidden) return;
          scene.tick(progressRef?.current ?? 0);
          if (!revealed) {
            revealed = true;
            setMode("webgl");
          }
        };
        raf = requestAnimationFrame(loop);
      });
    };

    const browser = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = browser.requestIdleCallback
      ? browser.requestIdleCallback(() => start(), { timeout: 600 })
      : 0;
    const timeoutId = browser.requestIdleCallback ? 0 : window.setTimeout(start, 200);

    return () => {
      cancelled = true;
      if (browser.cancelIdleCallback && idleId) browser.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
      cancelAnimationFrame(raf);
      observer?.disconnect();
      scene?.dispose();
      scene = null;
    };
  }, [progressRef]);

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden">
      <div ref={tagsRef} className="pointer-events-none absolute inset-0 z-[2]" />
      <LeadFallback
        className={
          mode === "webgl"
            ? "z-[3] opacity-0 transition-opacity duration-500"
            : "z-[3] opacity-100"
        }
      />
    </div>
  );
}
