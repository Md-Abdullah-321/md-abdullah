import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Md Abdullah",
  title: "Automation & Integration Engineer",
  description:
    "I help businesses connect their tools, automate repetitive work, and remove manual handoffs.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  links: {
    // Social links will be added when ready
  },
};
