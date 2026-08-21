"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  success: boolean;
  error?: string;
}

const VALID_STATUSES = ["new", "reviewed", "archived"] as const;

export async function updateMessageStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { success: false, error: "Invalid status." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[Admin] Update message status error:", error.message);
    return { success: false, error: "Failed to update status." };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[Admin] Delete message error:", error.message);
    return { success: false, error: "Failed to delete message." };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

export async function getNewMessageCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
