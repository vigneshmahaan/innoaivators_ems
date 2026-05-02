"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { submitLeaveSchema } from "@/lib/schemas";
import { createNotification } from "@/services/notification-service";

export async function submitLeaveRequestAction(
  _: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const leave_type = String(formData.get("leave_type") ?? "").trim();
    const from_date = String(formData.get("from_date") ?? "");
    const to_date = String(formData.get("to_date") ?? "");
    const reason = String(formData.get("reason") ?? "").trim();

    const parse = submitLeaveSchema.safeParse({ leave_type, from_date, to_date, reason });
    if (!parse.success) return { error: parse.error.issues[0].message };

    const { error } = await supabase.from("leave_requests").insert({
      user_id: user.id,
      leave_type,
      from_date,
      to_date,
      reason,
      status: "Pending",
    });

    if (error) return { error: `Failed to submit leave request: ${error.message}` };

    revalidatePath("/leave");
    revalidatePath("/admin/leaves");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to submit leave request." };
  }
}

export async function reviewLeaveRequestAction(formData: FormData) {
  try {
    const adminUser = await requireRole("admin");
    const supabase = await createClient();

    const leaveId = String(formData.get("leave_id") ?? "");
    const status = String(formData.get("status") ?? "");
    const employee_id = String(formData.get("employee_id") ?? "");

    if (!["Approved", "Rejected"].includes(status)) return { error: "Invalid status." };

    const { error } = await supabase
      .from("leave_requests")
      .update({
        status,
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", leaveId);

    if (error) return { error: "Failed to review leave request." };

    await createNotification({
      userId: employee_id,
      title: `Leave Request ${status}`,
      message: `Your leave request has been ${status.toLowerCase()} by admin.`,
      type: status === "Approved" ? "success" : "warning",
    });

    revalidatePath("/admin/leaves");
    revalidatePath("/leave");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to process leave request." };
  }
}
