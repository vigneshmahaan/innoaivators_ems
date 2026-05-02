"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuditAction } from "@/lib/types";

export async function logAuditEvent({
  userId,
  userName,
  action,
  entityType,
  entityId,
  oldData,
  newData,
}: {
  userId?: string;
  userName?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  try {
    await supabase.from("audit_logs").insert({
      user_id: userId,
      user_name: userName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_data: oldData,
      new_data: newData,
    });
  } catch {
    // Silently fail audit logs to not disrupt user flow
  }
}

export async function getAuditLogs({
  limit = 50,
  entityType,
  userId,
}: {
  limit?: number;
  entityType?: string;
  userId?: string;
} = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (entityType) {
    query = query.eq("entity_type", entityType);
  }
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}
