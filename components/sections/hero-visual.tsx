import {
  Globe,
  Users,
  Zap,
  Bot,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemNodeData {
  icon: React.ReactNode;
  label: string;
}

const nodes: SystemNodeData[] = [
  { icon: <Globe className="h-4 w-4" />, label: "Website" },
  { icon: <Users className="h-4 w-4" />, label: "CRM" },
  { icon: <Zap className="h-4 w-4" />, label: "Automation" },
  { icon: <Bot className="h-4 w-4" />, label: "AI" },
  { icon: <MessageSquare className="h-4 w-4" />, label: "Communication" },
  { icon: <Calendar className="h-4 w-4" />, label: "Calendar" },
];

/**
 * Hero visual — simplified connected-systems diagram.
 * Communicates "I connect the moving parts of a business."
 *
 * Architecture note: This component can be swapped for a personal video
 * (VideoEmbed) or a richer interactive visualization later. The parent
 * Hero component treats this as a replaceable visual slot.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-0 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8",
        className
      )}
      aria-label="Connected business systems visualization"
      role="img"
    >
      {nodes.map((node, index) => (
        <div key={node.label} className="contents">
          {/* Connector line */}
          {index > 0 && (
            <div className="h-5 w-px bg-border" aria-hidden="true" />
          )}

          {/* Node */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 shadow-xs">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/5 text-primary">
              {node.icon}
            </span>
            <span className="text-sm font-medium">{node.label}</span>
          </div>
        </div>
      ))}

      {/* Subtle label */}
      <p className="mt-5 text-center text-xs text-muted-foreground">
        Connected through automation &amp; intelligent workflows
      </p>
    </div>
  );
}
