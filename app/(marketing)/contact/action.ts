"use server";

import {
  validateContactForm,
  sanitizeContactForm,
  hasErrors,
  type ContactFormData,
  type ValidationErrors,
} from "@/lib/validations/contact";

export interface ContactFormState {
  success: boolean;
  errors: ValidationErrors;
  message: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Extract form data
  const raw: ContactFormData = {
    name: formData.get("name") as string ?? "",
    email: formData.get("email") as string ?? "",
    company: formData.get("company") as string ?? "",
    message: formData.get("message") as string ?? "",
    systems: formData.get("systems") as string ?? "",
    website: formData.get("website") as string ?? "",
  };

  // Honeypot check — if filled, silently succeed (bot submission)
  if (raw.website) {
    return { success: true, errors: {}, message: "" };
  }

  // Validate
  const errors = validateContactForm(raw);
  if (hasErrors(errors)) {
    return {
      success: false,
      errors,
      message: "Please fix the errors above.",
    };
  }

  // Sanitize
  const data = sanitizeContactForm(raw);

  // Submit to Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Supabase not configured — log and return success for dev
      console.log("[Contact] Supabase not configured. Submission data:", {
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message.slice(0, 50) + "...",
        systems: data.systems,
      });
      return {
        success: true,
        errors: {},
        message: "Message received. I'll get back to you soon.",
      };
    }

    // Dynamic import to avoid loading Supabase when not needed
    const { createServerClient } = await import("@supabase/ssr");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Expected in Server Actions
          }
        },
      },
    });

    const { error, data: insertedData } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      message: data.message,
      systems: data.systems || null,
      status: "new",
    }).select("id").single();

    if (error) {
      console.error("[Contact] Supabase insert error:", error.message);
      return {
        success: false,
        errors: {},
        message: "Something went wrong. Please try again or reach out directly.",
      };
    }

    // Send email notification (non-blocking — failure doesn't affect submission)
    try {
      const { notifyContactSubmission } = await import("@/lib/email/notifications");
      await notifyContactSubmission({
        id: insertedData?.id,
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.message,
        systems: data.systems || null,
        submittedAt: new Date(),
      });
    } catch (emailErr) {
      console.error("[Contact] Email notification error:", emailErr);
      // Non-fatal — submission is already stored
    }

    return {
      success: true,
      errors: {},
      message: "Message received. I'll get back to you soon.",
    };
  } catch (err) {
    console.error("[Contact] Unexpected error:", err);
    return {
      success: false,
      errors: {},
      message: "Something went wrong. Please try again.",
    };
  }
}
