import { cn } from "@/lib/utils";

/**
 * Static stand-in for the lead diagram.
 * Shown before WebGL starts, and kept for reduced motion, no WebGL,
 * and low-power phones. Same drawing language: graph paper, matte tiles,
 * thin navy outlines. No motion.
 */

const TILES: Array<{
  label: string;
  sub: string;
  icon: "voice" | "sms" | "crm" | "email" | "cal";
  className: string;
  live?: boolean;
}> = [
  { label: "Voice Agent", sub: "Voice AI", icon: "voice", className: "left-[58%] top-[6%] lg:left-[64%] lg:top-[8%]" },
  { label: "SMS", sub: "Twilio", icon: "sms", className: "left-[74%] top-[30%] lg:left-[78%] lg:top-[30%]" },
  { label: "CRM", sub: "GoHighLevel", icon: "crm", className: "left-[28%] top-[22%] lg:left-[34%] lg:top-[26%]", live: true },
  { label: "Email", sub: "Mailgun", icon: "email", className: "left-[16%] top-[58%] lg:left-[26%] lg:top-[58%]" },
  { label: "Calendar", sub: "Booking", icon: "cal", className: "left-[62%] top-[60%] lg:left-[68%] lg:top-[60%]" },
];

function TileIcon({ icon }: { icon: (typeof TILES)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-7 w-7 text-foreground",
    "aria-hidden": true as const,
  };

  if (icon === "crm") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="4" rx="1" />
        <rect x="4" y="10" width="16" height="4" rx="1" />
        <rect x="4" y="16" width="16" height="4" rx="1" />
      </svg>
    );
  }
  if (icon === "sms") {
    return (
      <svg {...common}>
        <path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  if (icon === "email") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="1.5" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    );
  }
  if (icon === "voice") {
    return (
      <svg {...common}>
        <path d="M5 10v4M9 7v10M12 4v16M15 8v8M19 10v4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="4" y="5" width="16" height="15" rx="1.5" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </svg>
  );
}

export function LeadFallback({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0", className)} aria-hidden="true">
      <div
        className="absolute inset-[-10%] opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(16 24 40 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(16 24 40 / 0.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(circle at 50% 45%, #000 20%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 45%, #000 20%, transparent 72%)",
        }}
      />
      {TILES.map((tile) => (
        <div key={tile.label} className={cn("absolute w-[92px] -translate-x-1/2 lg:w-[108px]", tile.className)}>
          <div className="mb-1.5 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[4px] border border-border bg-white px-2 py-1 font-mono text-[9px] font-semibold tracking-wide text-foreground shadow-[0_1px_0_rgb(16_24_40/0.04)] lg:text-[11px]">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full border border-ink-faint",
                tile.live && "border-primary bg-primary"
              )}
            />
            {tile.label}
            <span className="hidden font-normal text-ink-faint lg:inline">{tile.sub}</span>
          </div>
          <div className="mx-auto flex aspect-square w-[68px] items-center justify-center rounded-[10px] border border-foreground bg-white shadow-[0_10px_18px_rgb(16_24_40/0.08)] lg:w-[76px]">
            <TileIcon icon={tile.icon} />
          </div>
        </div>
      ))}
    </div>
  );
}
