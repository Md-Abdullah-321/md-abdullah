import type { Service } from "@/types";

/**
 * Services — single source of truth.
 *
 * Feeds: homepage Services Overview and /services page.
 * Content is problem-first: explain what business situation
 * needs this service, then what gets built.
 */

export interface ServiceWithContext extends Service {
  /** The business problem that signals a need for this service */
  problem: string;
  /** What I build or improve in this category */
  solution: string;
  /** Lucide icon name (rendered in the component) */
  iconName: "users" | "zap" | "cable" | "bot" | "code";
}

export const services: ServiceWithContext[] = [
  {
    id: "crm",
    title: "CRM & Business Systems",
    shortDescription:
      "Design CRM structure, pipelines, and workflows around how your business actually operates.",
    problem:
      "Your CRM exists but doesn't reflect the real process — fields are wrong, pipelines are outdated, and nobody trusts the data.",
    solution:
      "I restructure the system around your actual operations so it becomes a reliable source of truth.",
    iconName: "users",
    order: 1,
  },
  {
    id: "automation",
    title: "Workflow Automation",
    shortDescription:
      "Automate repetitive processes, follow-ups, notifications, and internal operations.",
    problem:
      "Your team spends hours on manual follow-ups, status updates, and moving information between steps.",
    solution:
      "I build automations that handle the repetitive work so people focus on what requires human judgment.",
    iconName: "zap",
    order: 2,
  },
  {
    id: "integration",
    title: "API & System Integrations",
    shortDescription:
      "Connect websites, CRMs, payment systems, communication tools, and databases.",
    problem:
      "Your tools run in isolation — the website doesn't talk to the CRM, the CRM doesn't talk to billing.",
    solution:
      "I connect systems through APIs and integrations so data flows automatically between them.",
    iconName: "cable",
    order: 3,
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    shortDescription:
      "Apply AI where it genuinely improves a business process.",
    problem:
      "There are decisions, classifications, or responses in your workflow that still need a human for every instance.",
    solution:
      "I integrate AI into specific workflow steps — qualification, routing, responses, or knowledge retrieval.",
    iconName: "bot",
    order: 4,
  },
  {
    id: "custom-software",
    title: "Custom Software & Internal Tools",
    shortDescription:
      "Build dashboards, portals, backends, or specialized tools when platforms aren't enough.",
    problem:
      "Off-the-shelf platforms can't handle your specific workflow, reporting needs, or internal process.",
    solution:
      "I build the exact tool your team needs — no unnecessary features, no platform limitations.",
    iconName: "code",
    order: 5,
  },
];

/** Get services sorted by order */
export function getServices(): ServiceWithContext[] {
  return [...services].sort((a, b) => a.order - b.order);
}
