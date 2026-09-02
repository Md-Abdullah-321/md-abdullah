"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/supabase/settings";
import { saveSettings } from "./action";

const initialResult = { success: false, error: undefined as string | undefined };

const inputClass =
  "mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface TestimonialOption {
  id: string;
  client_name: string;
  company: string | null;
}

export function SettingsForm({
  settings,
  testimonials,
}: {
  settings: SiteSettings;
  testimonials: TestimonialOption[];
}) {
  const boundAction = saveSettings.bind(null, settings.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialResult);

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
          Settings saved successfully.
        </div>
      )}

      {/* Profile */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Profile</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={settings.name}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Professional Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={settings.title}
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium">
            Short Bio / Positioning
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={2}
            defaultValue={settings.bio}
            placeholder="One or two sentences about what you do"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="profile_image_url" className="block text-sm font-medium">
            Profile Image URL
          </label>
          <input
            type="url"
            id="profile_image_url"
            name="profile_image_url"
            defaultValue={settings.profile_image_url ?? ""}
            placeholder="https://..."
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Direct image URL, or a Google Drive share link. The file must be shared as
            &quot;Anyone with the link&quot;.
          </p>
        </div>
      </fieldset>

      {/* Contact */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="public_email" className="block text-sm font-medium">
              Public Email
            </label>
            <input
              type="email"
              id="public_email"
              name="public_email"
              defaultValue={settings.public_email}
              placeholder="hello@example.com"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">Displayed publicly on the portfolio.</p>
          </div>
          <div>
            <label htmlFor="contact_url" className="block text-sm font-medium">
              Contact Page URL
            </label>
            <input
              type="text"
              id="contact_url"
              name="contact_url"
              defaultValue={settings.contact_url}
              placeholder="/contact"
              className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div>
          <label htmlFor="booking_url" className="block text-sm font-medium">
            Booking URL <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <input
            type="url"
            id="booking_url"
            name="booking_url"
            defaultValue={settings.booking_url ?? ""}
            placeholder="https://calendly.com/... or leave empty"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </fieldset>

      {/* Professional Links */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Professional Links</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="link_linkedin" className="block text-sm font-medium">LinkedIn</label>
            <input type="url" id="link_linkedin" name="link_linkedin" defaultValue={settings.link_linkedin ?? ""} placeholder="https://linkedin.com/in/..." className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div>
            <label htmlFor="link_whatsapp" className="block text-sm font-medium">WhatsApp</label>
            <input type="url" id="link_whatsapp" name="link_whatsapp" defaultValue={settings.link_whatsapp ?? ""} placeholder="https://wa.me/15551234567" className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <p className="mt-1 text-xs text-muted-foreground">Use https://wa.me/ followed by the number in international format — opens a direct chat on desktop and mobile.</p>
          </div>
          <div>
            <label htmlFor="link_github" className="block text-sm font-medium">GitHub</label>
            <input type="url" id="link_github" name="link_github" defaultValue={settings.link_github ?? ""} placeholder="https://github.com/..." className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div>
            <label htmlFor="link_upwork" className="block text-sm font-medium">Upwork</label>
            <input type="url" id="link_upwork" name="link_upwork" defaultValue={settings.link_upwork ?? ""} placeholder="https://upwork.com/..." className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div>
            <label htmlFor="link_youtube" className="block text-sm font-medium">YouTube</label>
            <input type="url" id="link_youtube" name="link_youtube" defaultValue={settings.link_youtube ?? ""} placeholder="https://youtube.com/..." className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div>
            <label htmlFor="link_twitter" className="block text-sm font-medium">Twitter / X</label>
            <input type="url" id="link_twitter" name="link_twitter" defaultValue={settings.link_twitter ?? ""} placeholder="https://x.com/..." className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
        </div>
      </fieldset>

      {/* Homepage */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Homepage</legend>
        <div>
          <label htmlFor="hero_testimonial_id" className="block text-sm font-medium">
            Homepage Hero Testimonial
          </label>
          <select
            id="hero_testimonial_id"
            name="hero_testimonial_id"
            defaultValue={settings.hero_testimonial_id ?? ""}
            className={inputClass}
          >
            <option value="">Most recent published testimonial</option>
            {testimonials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.client_name}
                {t.company ? ` · ${t.company}` : ""}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Displayed in the Homepage Hero proof card. Shows the most recent
            published testimonial when left empty.
          </p>
        </div>
      </fieldset>

      {/* Site Metadata */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Site Metadata</legend>
        <div>
          <label htmlFor="site_title" className="block text-sm font-medium">Site Title</label>
          <input
            type="text"
            id="site_title"
            name="site_title"
            defaultValue={settings.site_title}
            placeholder="Name | Title"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">Used in browser tabs and search results.</p>
        </div>
        <div>
          <label htmlFor="site_description" className="block text-sm font-medium">Site Description</label>
          <textarea
            id="site_description"
            name="site_description"
            rows={2}
            defaultValue={settings.site_description}
            placeholder="Brief description for search engines"
            className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </fieldset>

      {/* Submit */}
      <div className="border-t border-border pt-6">
        <Button type="submit" loading={isPending}>
          Save Settings
        </Button>
      </div>
    </form>
  );
}
