import { SubtleParallax } from "@/components/motion/subtle-parallax";

export function HomepageAtmosphere({ children }: { children: React.ReactNode }) {
  return (
    <div className="homepage-canvas relative isolate overflow-hidden [&_.bg-surface-muted]:!bg-surface-muted/70 [&_.bg-white]:!bg-transparent">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {/* The two large blobs drift very slowly — everything else stays static. */}
        <SubtleParallax className="absolute -right-64 -top-64 h-[42rem] w-[42rem]" range={14}>
          <div className="h-full w-full rounded-full bg-accent/45" />
        </SubtleParallax>
        <SubtleParallax className="absolute -left-72 top-[34rem] h-[38rem] w-[38rem]" range={10}>
          <div className="h-full w-full rounded-full border border-primary/[0.07] bg-primary/[0.025]" />
        </SubtleParallax>
        <div className="dot-grid absolute right-8 top-[44rem] h-36 w-36 opacity-25 [mask-image:radial-gradient(circle,black,transparent_72%)]" />
        <div className="dot-grid absolute bottom-[24rem] left-4 h-28 w-28 opacity-20 [mask-image:radial-gradient(circle,black,transparent_72%)]" />
        <svg className="absolute -right-10 top-[18rem] h-[34rem] w-[28rem] text-primary/[0.1]" viewBox="0 0 320 560" fill="none">
          <path d="M12 530C112 472 88 374 168 286C222 226 252 146 314 20" stroke="currentColor" strokeWidth="1" />
          <path d="M48 558C144 486 126 404 198 310C250 242 272 166 320 66" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg className="absolute -left-16 top-[72rem] h-[28rem] w-[24rem] text-primary/[0.08]" viewBox="0 0 280 460" fill="none">
          <path d="M6 24C88 78 90 164 138 224C184 282 220 338 274 454" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
