"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics/client";
import { EVENTS } from "@/lib/analytics/events";
import { submitContactForm, type ContactFormState } from "./action";

const initialState: ContactFormState = {
  success: false,
  errors: {},
  message: "",
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  if (state.success && state.message) {
    // Track successful submission
    track(EVENTS.CONTACT_FORM_SUBMITTED);
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Thank you</h3>
        <p className="text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          onFocus={() => track(EVENTS.CONTACT_FORM_STARTED)}
          className={cn(
            "mt-1.5 block w-full rounded-md border bg-background px-3 py-2.5 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            state.errors.name ? "border-destructive" : "border-input"
          )}
          placeholder="Your name"
          aria-describedby={state.errors.name ? "name-error" : undefined}
        />
        {state.errors.name && (
          <p id="name-error" className="mt-1 text-xs text-destructive">
            {state.errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          className={cn(
            "mt-1.5 block w-full rounded-md border bg-background px-3 py-2.5 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            state.errors.email ? "border-destructive" : "border-input"
          )}
          placeholder="you@company.com"
          aria-describedby={state.errors.email ? "email-error" : undefined}
        />
        {state.errors.email && (
          <p id="email-error" className="mt-1 text-xs text-destructive">
            {state.errors.email}
          </p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium">
          Company <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          autoComplete="organization"
          className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Company name"
        />
      </div>

      {/* Message — primary field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          What are you trying to improve? <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={cn(
            "mt-1.5 block w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            state.errors.message ? "border-destructive" : "border-input"
          )}
          placeholder="Describe the process or workflow you want to improve. You don't need to know the technical solution. Just explain what's happening and what you'd like to change."
          aria-describedby={state.errors.message ? "message-error" : undefined}
        />
        {state.errors.message && (
          <p id="message-error" className="mt-1 text-xs text-destructive">
            {state.errors.message}
          </p>
        )}
      </div>

      {/* Current systems */}
      <div>
        <label htmlFor="systems" className="block text-sm font-medium">
          Current systems{" "}
          <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <input
          type="text"
          id="systems"
          name="systems"
          className="mt-1.5 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="e.g., HubSpot, GoHighLevel, Stripe, Google Calendar..."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Any tools or platforms you currently use. Don&apos;t worry about
          being technical.
        </p>
      </div>

      {/* General error message */}
      {state.message && !state.success && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" loading={isPending}>
        Send Message
      </Button>
    </form>
  );
}
