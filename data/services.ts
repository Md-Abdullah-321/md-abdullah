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
      "I set up the CRM around the way your team actually works.",
    problem:
      "Your CRM exists but doesn't match the real process. Fields are wrong, pipelines are outdated, and nobody trusts the data.",
    solution:
      "I restructure the CRM around your actual operations so it becomes something the team actually uses.",
    iconName: "users",
    order: 1,
  },
  {
    id: "automation",
    title: "Workflow Automation",
    shortDescription:
      "I automate repetitive follow-ups, notifications, and internal tasks.",
    problem:
      "Your team spends hours on manual follow-ups, status updates, and moving information between steps.",
    solution:
      "I build automations that handle the repetitive work so people can focus on what needs a human.",
    iconName: "zap",
    order: 2,
  },
  {
    id: "integration",
    title: "API & System Integrations",
    shortDescription:
      "I connect websites, CRMs, payment systems, communication tools, and databases.",
    problem:
      "Your tools run separately. The website doesn't talk to the CRM. The CRM doesn't talk to billing.",
    solution:
      "I connect them through APIs and integrations so data moves without someone copying it by hand.",
    iconName: "cable",
    order: 3,
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    shortDescription:
      "I use AI when it can handle a useful part of the process without making the system harder to manage.",
    problem:
      "There are decisions, classifications, or responses in your workflow that still need a human for every single one.",
    solution:
      "I add AI to specific workflow steps like qualification, routing, responses, or knowledge lookup.",
    iconName: "bot",
    order: 4,
  },
  {
    id: "custom-software",
    title: "Custom Software & Internal Tools",
    shortDescription:
      "I build dashboards, portals, backends, or specialized tools when off-the-shelf software is not enough.",
    problem:
      "Off-the-shelf platforms can't handle your specific workflow, reporting needs, or internal process.",
    solution:
      "I build the exact tool your team needs. No unnecessary features, no platform limitations.",
    iconName: "code",
    order: 5,
  },
];

/** Get services sorted by order */
export function getServices(): ServiceWithContext[] {
  return [...services].sort((a, b) => a.order - b.order);
}
