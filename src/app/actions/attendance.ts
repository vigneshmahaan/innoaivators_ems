"use server";

import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

export async function startWorkAction(_: { error?: string }, formData: FormData) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const today = format(new Date(), "yyyy-MM-dd");

    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    if (existing) return { error: "You have already started work today." };

    const { error } = await supabase.from("attendance").insert({
      user_id: user.id,
      date: today,
      login_time: new Date().toISOString(),
    });

    if (error) return { error: "Failed to start work. Please try again." };

    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to start work." };
  }
}

export async function endWorkAction(_: { error?: string }, formData: FormData) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const today = format(new Date(), "yyyy-MM-dd");

    const { data: attendance } = await supabase
      .from("attendance")
      .select("id,login_time,logout_time")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    if (!attendance) return { error: "No active work session found. Click 'Start Work' first." };
    if (!attendance.login_time) return { error: "Invalid work session. Please start work again." };
    if (attendance.logout_time) return { error: "You have already ended work today." };

    const logoutTime = new Date();
    const totalHours =
      (logoutTime.getTime() - new Date(attendance.login_time).getTime()) / (1000 * 60 * 60);

    const { error } = await supabase
      .from("attendance")
      .update({
        logout_time: logoutTime.toISOString(),
        total_hours: Number(totalHours.toFixed(2)),
      })
      .eq("id", attendance.id);

    if (error) return { error: "Failed to end work." };

    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to end work." };
  }
}
