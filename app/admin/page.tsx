import Link from "next/link";
import {
  FolderOpen,
  Briefcase,
  Video,
  MessageSquareQuote,
  Shield,
  Mail,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

interface DashboardStat {
  label: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  sublabel?: string;
}

async function getDashboardStats() {
  try {
    const supabase = await createClient();

    const [projects, services, videos, testimonials, proof, messages] =
      await Promise.all([
        supabase.from("projects").select("id, published", { count: "exact" }),
        supabase.from("services").select("id, published", { count: "exact" }),
        supabase.from("videos").select("id", { count: "exact" }),
        supabase.from("testimonials").select("id, published", { count: "exact" }),
        supabase.from("proof_items").select("id", { count: "exact" }),
        supabase
          .from("contact_submissions")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
      ]);

    const publishedProjects = projects.data?.filter((p) => p.published).length ?? 0;
    const draftProjects = (projects.data?.length ?? 0) - publishedProjects;

    return {
      projects: projects.data?.length ?? 0,
      publishedProjects,
      draftProjects,
      services: services.data?.length ?? 0,
      publishedServices: services.data?.filter((s) => s.published).length ?? 0,
      videos: videos.data?.length ?? 0,
      testimonials: testimonials.data?.length ?? 0,
      publishedTestimonials: testimonials.data?.filter((t) => t.published).length ?? 0,
      proof: proof.data?.length ?? 0,
      newMessages: messages.count ?? 0,
    };
  } catch {
    return {
      projects: 0,
      publishedProjects: 0,
      draftProjects: 0,
      services: 0,
      publishedServices: 0,
      videos: 0,
      testimonials: 0,
      publishedTestimonials: 0,
      proof: 0,
      newMessages: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards: DashboardStat[] = [
    {
      label: "Projects",
      value: stats.projects,
      href: "/admin/projects",
      icon: <FolderOpen className="h-5 w-5" />,
      sublabel: `${stats.publishedProjects} published, ${stats.draftProjects} draft`,
    },
    {
      label: "Services",
      value: stats.services,
      href: "/admin/services",
      icon: <Briefcase className="h-5 w-5" />,
      sublabel: `${stats.publishedServices} published`,
    },
    {
      label: "Videos",
      value: stats.videos,
      href: "/admin/videos",
      icon: <Video className="h-5 w-5" />,
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      href: "/admin/testimonials",
      icon: <MessageSquareQuote className="h-5 w-5" />,
      sublabel: `${stats.publishedTestimonials} published`,
    },
    {
      label: "Proof",
      value: stats.proof,
      href: "/admin/proof",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      label: "New Messages",
      value: stats.newMessages,
      href: "/admin/messages?status=new",
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Portfolio content overview.
      </p>

      {/* Stats grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/5 text-primary">
              {card.icon}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">
                  {card.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {card.label}
                </span>
              </div>
              {card.sublabel && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {card.sublabel}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <p className="text-sm font-medium text-muted-foreground">Quick actions</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/projects/new">
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/services/new">
              <Plus className="h-3.5 w-3.5" />
              New Service
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/videos/new">
              <Plus className="h-3.5 w-3.5" />
              Add Video
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/testimonials/new">
              <Plus className="h-3.5 w-3.5" />
              Add Testimonial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
