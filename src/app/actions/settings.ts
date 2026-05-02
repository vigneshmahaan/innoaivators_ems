"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { updateCompanySettings } from "@/services/settings-service";
import { companySettingsSchema, departmentSchema, designationSchema, holidaySchema, announcementSchema } from "@/lib/schemas";
import { createDepartment, updateDepartment, createDesignation } from "@/services/employee-service";
import { createClient } from "@/lib/supabase/server";

export async function updateCompanySettingsAction(_: { error?: string; success?: boolean }, formData: FormData) {
  try {
    await requireRole("admin");
    const input = Object.fromEntries(formData.entries());

    const parse = companySettingsSchema.safeParse({
      company_name: input.company_name,
      address: input.address || undefined,
      city: input.city || undefined,
      state: input.state || undefined,
      country: input.country || undefined,
      zip_code: input.zip_code || undefined,
      phone: input.phone || undefined,
      email: input.email || undefined,
      website: input.website || undefined,
      timezone: input.timezone,
      currency: input.currency,
      currency_symbol: input.currency_symbol,
      work_start_time: input.work_start_time,
      work_end_time: input.work_end_time,
      grace_period_minutes: input.grace_period_minutes,
      half_day_hours: input.half_day_hours,
      full_day_hours: input.full_day_hours,
    });

    if (!parse.success) return { error: parse.error.issues[0].message };

    await updateCompanySettings(parse.data);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update settings." };
  }
}

export async function createDepartmentAction(_: { error?: string; success?: boolean }, formData: FormData) {
  try {
    await requireRole("admin");
    const input = {
      name: String(formData.get("name") ?? "").trim(),
      code: String(formData.get("code") ?? "").trim() || undefined,
      description: String(formData.get("description") ?? "").trim() || undefined,
      head_id: String(formData.get("head_id") ?? "") || undefined,
    };

    const parse = departmentSchema.safeParse(input);
    if (!parse.success) return { error: parse.error.issues[0].message };

    await createDepartment(parse.data);
    revalidatePath("/admin/departments");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create department." };
  }
}

export async function updateDepartmentAction(_: { error?: string; success?: boolean }, formData: FormData) {
  try {
    await requireRole("admin");
    const id = String(formData.get("id") ?? "");
    const input = {
      name: String(formData.get("name") ?? "").trim() || undefined,
      code: String(formData.get("code") ?? "").trim() || undefined,
      description: String(formData.get("description") ?? "").trim() || undefined,
      head_id: String(formData.get("head_id") ?? "") || undefined,
    };

    await updateDepartment(id, input);
    revalidatePath("/admin/departments");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update department." };
  }
}

export async function createDesignationAction(_: { error?: string; success?: boolean }, formData: FormData) {
  try {
    await requireRole("admin");
    const input = {
      title: String(formData.get("title") ?? "").trim(),
      department_id: String(formData.get("department_id") ?? "") || undefined,
      description: String(formData.get("description") ?? "").trim() || undefined,
      level: Number(formData.get("level") ?? 1),
    };

    const parse = designationSchema.safeParse(input);
    if (!parse.success) return { error: parse.error.issues[0].message };

    await createDesignation(parse.data);
    revalidatePath("/admin/designations");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create designation." };
  }
}

export async function createHolidayAction(_: { error?: string; success?: boolean }, formData: FormData) {
  try {
    await requireRole("admin");
    const input = {
      name: String(formData.get("name") ?? "").trim(),
      date: String(formData.get("date") ?? ""),
      type: String(formData.get("type") ?? "public") as "public" | "optional" | "restricted",
      description: String(formData.get("description") ?? "").trim() || undefined,
      recurring: formData.get("recurring") === "true",
    };

    const parse = holidaySchema.safeParse(input);
    if (!parse.success) return { error: parse.error.issues[0].message };

    const supabase = await createClient();
    const { error } = await supabase.from("holidays").insert(parse.data);
    if (error) return { error: error.message };

    revalidatePath("/admin/holidays");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create holiday." };
  }
}

export async function deleteHolidayAction(formData: FormData) {
  try {
    await requireRole("admin");
    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    const { error } = await supabase.from("holidays").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/holidays");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete holiday." };
  }
}

export async function createAnnouncementAction(_: { error?: string; success?: boolean }, formData: FormData) {
  try {
    const user = await requireRole("admin");
    const supabase = await createClient();

    const departmentIds = formData.getAll("department_ids") as string[];
    const input = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      type: String(formData.get("type") ?? "company") as "company" | "department" | "general",
      department_ids: departmentIds.length > 0 ? departmentIds : undefined,
      priority: String(formData.get("priority") ?? "normal") as "low" | "normal" | "high" | "urgent",
      pinned: formData.get("pinned") === "true",
      expires_at: String(formData.get("expires_at") ?? "") || null,
    };

    const parse = announcementSchema.safeParse(input);
    if (!parse.success) return { error: parse.error.issues[0].message };

    const { error } = await supabase.from("announcements").insert({
      ...parse.data,
      published_by: user.id,
    });
    if (error) return { error: error.message };

    revalidatePath("/admin/announcements");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create announcement." };
  }
}

export async function deleteAnnouncementAction(formData: FormData) {
  try {
    await requireRole("admin");
    const id = String(formData.get("id") ?? "");
    const supabase = await createClient();
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/announcements");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete announcement." };
  }
}
