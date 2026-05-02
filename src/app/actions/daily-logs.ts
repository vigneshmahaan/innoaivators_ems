"use server";

import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

export async function submitDailyLogAction(
  _: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const today = format(new Date(), "yyyy-MM-dd");

    const task_title = String(formData.get("task_title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const status = String(formData.get("status") ?? "In Progress");
    const hours_spent = Number(formData.get("hours_spent") ?? 0);

    if (!task_title) return { error: "Task title is required." };
    if (hours_spent <= 0 || hours_spent > 24) return { error: "Hours must be between 0 and 24." };

    const { error } = await supabase.from("daily_logs").insert({
      user_id: user.id,
      date: today,
      task_title,
      description,
      status,
      hours_spent,
    });

    if (error) return { error: `Failed to submit log: ${error.message}` };

    revalidatePath("/daily-log");
    revalidatePath("/history");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to submit log." };
  }
}
