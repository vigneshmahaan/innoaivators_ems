"use server";

import { createClient } from "@/lib/supabase/server";
import type { Notification, NotificationType } from "@/lib/types";

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
}: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
  });
  if (error) throw new Error(error.message);
}

export async function getNotifications(userId: string, limit = 20): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
