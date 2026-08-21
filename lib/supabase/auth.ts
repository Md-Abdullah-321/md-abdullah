/**
 * Auth utilities for server-side authentication checks.
 *
 * Use requireAuth() at the start of any admin server action
 * to verify the caller is authenticated independently of proxy/middleware.
 */

import { createClient } from "./server";

export class AuthError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Verify the current user is authenticated.
 * Throws AuthError if not.
 *
 * Usage in server actions:
 * ```ts
 * const user = await requireAuth();
 * // proceed with mutation
 * ```
 */
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthError();
  }

  return user;
}
