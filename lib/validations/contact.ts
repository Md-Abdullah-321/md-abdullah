/**
 * Contact form validation — shared between client and server.
 */

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
  systems: string;
  /** Honeypot field — should always be empty */
  website?: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_COMPANY_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_SYSTEMS_LENGTH = 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: ContactFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name
  const name = data.name.trim();
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be under ${MAX_NAME_LENGTH} characters.`;
  }

  // Email
  const email = data.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (email.length > MAX_EMAIL_LENGTH) {
    errors.email = "Email address is too long.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Message
  const message = data.message.trim();
  if (!message) {
    errors.message = "Please describe what you're trying to improve.";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be under ${MAX_MESSAGE_LENGTH} characters.`;
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function sanitizeContactForm(data: ContactFormData): ContactFormData {
  return {
    name: data.name.trim().slice(0, MAX_NAME_LENGTH),
    email: data.email.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH),
    company: data.company.trim().slice(0, MAX_COMPANY_LENGTH),
    message: data.message.trim().slice(0, MAX_MESSAGE_LENGTH),
    systems: data.systems.trim().slice(0, MAX_SYSTEMS_LENGTH),
  };
}
