import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_NAME = "Md Abdullah";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/images/favicon%20v1.png",
  },
  title: {
    default: `${SITE_NAME} | Automation & Integration Engineer`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Automation & Integration Engineer designing robust backend pipelines, CRM architectures, and AI-assisted workflows.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Automation & Integration Engineer`,
    description:
      "Automation & Integration Engineer designing robust backend pipelines, CRM architectures, and AI-assisted workflows.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "ln6TtPt0EnU3JsikTLeb_qmOUTwhOpusXI14ezpshK8",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
        <GoogleTagManager />
        {children}
      </body>
    </html>
  );
}


