import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";
import { LenisProvider } from "@/components/motion/lenis-provider";
import { MotionProvider } from "@/components/motion/provider";
import { PageEnter } from "@/components/motion/page-enter";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <MotionProvider>
      <LenisProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          {/* PageEnter stays inside main so flex-1 still applies to it */}
          <main className="flex-1">
            <PageEnter>{children}</PageEnter>
          </main>
          <Footer />
          {/* Analytics — only on public pages, not admin */}
          <Analytics />
        </div>
      </LenisProvider>
    </MotionProvider>
  );
}
