import type { LucideIcon } from "lucide-react";
import {
  Globe,
  FormInput,
  MessageSquare,
  Mic,
  Mail,
  Users,
  Zap,
  Bot,
  Cable,
  Calendar,
  CreditCard,
  Send,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

export interface SystemNode {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const entryNodes: SystemNode[] = [
  { id: "website", label: "Website", icon: Globe },
  { id: "forms", label: "Forms", icon: FormInput },
  { id: "chatbot", label: "Chatbot", icon: MessageSquare },
  { id: "voiceai", label: "Voice AI", icon: Mic },
  { id: "email", label: "Email", icon: Mail },
];

export const engineModules: SystemNode[] = [
  { id: "crm", label: "CRM", icon: Users },
  { id: "workflows", label: "Workflows", icon: Zap },
  { id: "ai", label: "AI", icon: Bot },
  { id: "apis", label: "APIs", icon: Cable },
];

export const outcomeNodes: SystemNode[] = [
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "messaging", label: "Messaging", icon: Send },
  { id: "followup", label: "Follow-up", icon: RefreshCw },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export const techStack = ["GoHighLevel", "n8n", "OpenAI", "APIs"];
