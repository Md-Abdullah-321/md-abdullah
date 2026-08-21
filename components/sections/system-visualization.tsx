import {
  Globe,
  FormInput,
  MessageCircle,
  Users,
  Zap,
  Bot,
  Cable,
  Calendar,
  CreditCard,
  Server,
  LayoutDashboard,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { H2, Body } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/* ─── Data Model ──────────────────────────────────────── */

type SystemCategory = "input" | "orchestration" | "output";

interface SystemNodeData {
  id: string;
  label: string;
  category: SystemCategory;
  icon: React.ReactNode;
  description?: string;
}

const systemNodes: SystemNodeData[] = [
  // Input layer — customer-facing entry points
  {
    id: "website",
    label: "Website",
    category: "input",
    icon: <Globe className="h-4 w-4" />,
    description: "Where leads and customers arrive",
  },
  {
    id: "forms",
    label: "Forms",
    category: "input",
    icon: <FormInput className="h-4 w-4" />,
    description: "Data collection and intake",
  },
  {
    id: "chat",
    label: "Chat",
    category: "input",
    icon: <MessageCircle className="h-4 w-4" />,
    description: "Real-time conversations",
  },

  // Orchestration layer — the connective tissue
  {
    id: "crm",
    label: "CRM",
    category: "orchestration",
    icon: <Users className="h-4 w-4" />,
    description: "Central source of truth",
  },
  {
    id: "automation",
    label: "Automation",
    category: "orchestration",
    icon: <Zap className="h-4 w-4" />,
    description: "Workflows and triggers",
  },
  {
    id: "ai",
    label: "AI",
    category: "orchestration",
    icon: <Bot className="h-4 w-4" />,
    description: "Intelligent decisions",
  },
  {
    id: "integrations",
    label: "APIs",
    category: "orchestration",
    icon: <Cable className="h-4 w-4" />,
    description: "System connections",
  },

  // Output layer — business actions and results
  {
    id: "calendar",
    label: "Calendar",
    category: "output",
    icon: <Calendar className="h-4 w-4" />,
    description: "Scheduling and appointments",
  },
  {
    id: "payments",
    label: "Payments",
    category: "output",
    icon: <CreditCard className="h-4 w-4" />,
    description: "Invoices and transactions",
  },
  {
    id: "internal",
    label: "Internal Tools",
    category: "output",
    icon: <Server className="h-4 w-4" />,
    description: "Backend and admin systems",
  },
  {
    id: "dashboards",
    label: "Dashboards",
    category: "output",
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: "Visibility and reporting",
  },
];

const categoryMeta: Record<
  SystemCategory,
  { label: string; accent: string }
> = {
  input: { label: "Customer-Facing", accent: "border-primary/30" },
  orchestration: {
    label: "Automation & Intelligence",
    accent: "border-primary/50",
  },
  output: { label: "Business Systems", accent: "border-primary/30" },
};

/* ─── Components ──────────────────────────────────────── */

function SystemNode({ node }: { node: SystemNodeData }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-xs">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/5 text-primary">
        {node.icon}
      </span>
      <div className="min-w-0">
        <span className="block text-sm font-medium leading-tight">
          {node.label}
        </span>
        {node.description && (
          <span className="block text-[11px] leading-tight text-muted-foreground">
            {node.description}
          </span>
        )}
      </div>
    </div>
  );
}

function FlowArrow({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      aria-hidden="true"
    >
      {/* Vertical arrow */}
      <div className="flex flex-col items-center">
        <div className="h-6 w-px bg-border" />
        <div className="h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-border" />
      </div>
    </div>
  );
}

function CategoryGroup({
  category,
  nodes,
}: {
  category: SystemCategory;
  nodes: SystemNodeData[];
}) {
  const meta = categoryMeta[category];

  return (
    <div
      className={cn(
        "rounded-xl border bg-surface-muted/50 p-4 sm:p-5",
        meta.accent
      )}
    >
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {meta.label}
      </p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {nodes.map((node) => (
          <SystemNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────── */

export function SystemVisualization() {
  const inputNodes = systemNodes.filter((n) => n.category === "input");
  const orchestrationNodes = systemNodes.filter(
    (n) => n.category === "orchestration"
  );
  const outputNodes = systemNodes.filter((n) => n.category === "output");

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            What gets built
          </p>
          <H2 className="mt-2">One connected system, not scattered tools</H2>
          <Body className="mt-4 text-muted-foreground">
            Your business already has the pieces — website, CRM, calendar,
            payments, communication. I connect them into a single reliable
            process where data flows automatically from one step to the next.
          </Body>
        </div>

        {/* Visualization */}
        <div
          className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-0"
          role="img"
          aria-label="Connected business systems: customer-facing inputs flow through an automation and intelligence layer into business systems and outputs."
        >
          {/* Layer 1: Inputs */}
          <CategoryGroup category="input" nodes={inputNodes} />

          <FlowArrow className="py-1" />

          {/* Layer 2: Orchestration (emphasized) */}
          <CategoryGroup category="orchestration" nodes={orchestrationNodes} />

          <FlowArrow className="py-1" />

          {/* Layer 3: Outputs */}
          <CategoryGroup category="output" nodes={outputNodes} />
        </div>
      </Container>
    </Section>
  );
}
