"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

export async function markNotificationReadAction(notificationId: string) {
  const user = await requireAuth();
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function markAllNotificationsReadAction() {
  const user = await requireAuth();
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);
  revalidatePath("/dashboard");
}
