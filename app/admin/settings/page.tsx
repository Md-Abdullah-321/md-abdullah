import { getSiteSettings } from "@/lib/supabase/settings";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, client_name, company")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Portfolio-wide configuration. Changes apply across the public site.
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings} testimonials={testimonials ?? []} />
      </div>
    </div>
  );
}
