export interface SystemStage {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  items: {
    name: string;
    detail: string;
    tech?: string;
  }[];
}

export interface SystemScenario {
  id: string;
  name: string;
  badge: string;
  input: string;
  aiAction: string;
  crmAction: string;
  outcome: string;
  payload: {
    event: string;
    leadType: string;
    routing: string;
    automation: string;
  };
}

export const systemStages: SystemStage[] = [
  {
    id: "inputs",
    stepNumber: "01",
    title: "Inbound Capture",
    subtitle: "Multi-channel entrypoints",
    items: [
      { name: "Website Forms", detail: "Capture & validate", tech: "WordPress / Web" },
      { name: "WhatsApp & SMS", detail: "Instant webhook trigger", tech: "Twilio / Meta" },
      { name: "Voice & Email", detail: "Transcript parsing", tech: "Voice AI" },
    ],
  },
  {
    id: "processing",
    stepNumber: "02",
    title: "AI & Logic Engine",
    subtitle: "Evaluation & routing",
    items: [
      { name: "Intent Classification", detail: "Parse needs & urgency", tech: "OpenAI" },
      { name: "Validation & Enrichment", detail: "Verify domain & data", tech: "n8n / APIs" },
      { name: "Pipeline Routing", detail: "Select precise workflow", tech: "Make / Backend" },
    ],
  },
  {
    id: "crm",
    stepNumber: "03",
    title: "Core CRM & Data",
    subtitle: "Unified source of truth",
    items: [
      { name: "Opportunity Sync", detail: "Stage update & tagging", tech: "GoHighLevel" },
      { name: "Contact History", detail: "Log full activity trail", tech: "HubSpot / SQL" },
    ],
  },
  {
    id: "outcomes",
    stepNumber: "04",
    title: "Automated Outcomes",
    subtitle: "Zero manual friction",
    items: [
      { name: "Calendar Booking", detail: "Instant invite dispatched", tech: "Google / Cal" },
      { name: "Payment & Invoicing", detail: "Quote & deposit link", tech: "Stripe" },
      { name: "Team Notification", detail: "Alert when needed", tech: "Slack / Teams" },
    ],
  },
];

export const systemScenarios: SystemScenario[] = [
  {
    id: "lead-qual",
    name: "High-Value Inbound Lead",
    badge: "Active Pipeline",
    input: "Web Form Submission (Enterprise Query)",
    aiAction: "OpenAI parses budget & classifies as Priority Tier-1",
    crmAction: "GoHighLevel creates deal & assigns account executive",
    outcome: "Dispatches customized calendar link + Slack alert in 12s",
    payload: {
      event: "lead.qualified",
      leadType: "Enterprise",
      routing: "fast_track_ae",
      automation: "100% automated handoff",
    },
  },
  {
    id: "voice-booking",
    name: "Voice AI Inbound Call",
    badge: "24/7 Voice Workflow",
    input: "Missed Call / Voice Inquiry via Twilio",
    aiAction: "Voice AI transcribes intent and answers FAQs",
    crmAction: "Logs audio summary & creates CRM contact card",
    outcome: "Sends SMS confirmation with deposit link via Stripe",
    payload: {
      event: "call.completed",
      leadType: "Inbound Service",
      routing: "instant_sms_checkout",
      automation: "Zero human delay",
    },
  },
];

