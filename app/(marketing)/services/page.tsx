import type { Metadata } from "next";
import { ServicesOverview } from "@/components/sections/services-overview";

export const metadata: Metadata = {
  title: "Services",
  description:
    "CRM, automation, integrations and AI workflows that help teams spend less time moving information around.",
};

export default function ServicesPage() {
  return <ServicesOverview />;
}
