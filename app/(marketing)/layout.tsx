import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Analytics — only on public pages, not admin */}
      <Analytics />
    </div>
  );
}
