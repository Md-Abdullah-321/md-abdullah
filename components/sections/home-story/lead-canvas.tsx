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
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    let idleId = 0;
    let timeoutId = 0;
    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      window.removeEventListener("scroll", begin);
      window.removeEventListener("pointerdown", begin);
      if (timeoutId) window.clearTimeout(timeoutId);
      if (browser.cancelIdleCallback && idleId) browser.cancelIdleCallback(idleId);
      timeoutId = 0;
      idleId = 0;
      start();
    };

    if (mobile) {
      // Phones get the drawing on the first scroll, or a few seconds after
      // load. Starting it immediately keeps the main thread busy through the
      // opening paint.
      window.addEventListener("scroll", begin, { passive: true });
      window.addEventListener("pointerdown", begin, { passive: true });
      timeoutId = window.setTimeout(begin, 5000);
    } else if (browser.requestIdleCallback) {
      idleId = browser.requestIdleCallback(begin, { timeout: 800 });
    } else {
      timeoutId = window.setTimeout(begin, 200);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", begin);
      window.removeEventListener("pointerdown", begin);
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
