"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, requireRole } from "@/lib/auth";
import { logAuditEvent } from "@/services/audit-service";
import { loginSchema, adminLoginSchema, adminSignupSchema, changePasswordSchema } from "@/lib/schemas";

export async function loginAction(_: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const parse = loginSchema.safeParse({ identifier, password });
  if (!parse.success) return { error: parse.error.issues[0].message };

  let email = identifier;
  if (!identifier.includes("@")) {
    const { data } = await supabase
      .from("users")
      .select("email")
      .eq("employee_id", identifier)
      .maybeSingle();
    email = data?.email ?? "";
  }

  if (!email) return { error: "No account found for this employee ID/email." };

  const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const user = signInData.user;
  if (!user) return { error: "Unable to load user profile." };

  const { data: profile } = await supabase
    .from("users")
    .select("role, status, is_first_login, name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.status !== "active") {
    await supabase.auth.signOut();
    return { error: "Your account is inactive. Please contact HR." };
  }

  if (profile?.role === "admin") {
    await supabase.auth.signOut();
    return { error: "Admins must use the admin login portal." };
  }

  await logAuditEvent({
    userId: user.id,
    userName: profile?.name,
    action: "login",
    entityType: "auth",
  });

  if (profile?.is_first_login) {
    redirect("/change-password?first=true");
  }

  redirect("/dashboard");
}

export async function adminLoginAction(_: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const parse = adminLoginSchema.safeParse({ email, password });
  if (!parse.success) return { error: parse.error.issues[0].message };

  const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const user = signInData.user;
  if (!user) return { error: "Unable to load user profile." };

  const { data: profile } = await supabase
    .from("users")
    .select("role, status, name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.status !== "active") {
    await supabase.auth.signOut();
    return { error: "Your account is inactive." };
  }

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Only admins can access the admin portal." };
  }

  await logAuditEvent({
    userId: user.id,
    userName: profile?.name,
    action: "login",
    entityType: "auth",
  });

  redirect("/admin/dashboard");
}

export async function adminSignupAction(_: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const admin = createAdminClient();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const parse = adminSignupSchema.safeParse({ name, email, password });
  if (!parse.success) return { error: parse.error.issues[0].message };

  const { data: existingAdmin } = await admin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingAdmin) return { error: "This email is already registered." };

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    return { error: authError?.message || "Failed to create account." };
  }

  const { error: profileError } = await admin.from("users").insert({
    id: authUser.user.id,
    employee_id: `ADMIN-${Date.now()}`,
    name,
    email,
    role: "admin",
    status: "active",
    is_first_login: false,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    return { error: "Failed to create admin profile." };
  }

  redirect("/admin-login");
}

export async function logoutAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .maybeSingle();

    await logAuditEvent({
      userId: user.id,
      userName: profile?.name,
      action: "logout",
      entityType: "auth",
    });
  }

  await supabase.auth.signOut();
  redirect("/login");
}

export async function changePasswordAction(
  _: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await requireAuth();
    const oldPassword = String(formData.get("old_password") ?? "");
    const newPassword = String(formData.get("new_password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");
    const supabase = await createClient();

    const parse = changePasswordSchema.safeParse({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    if (!parse.success) return { error: parse.error.issues[0].message };

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: oldPassword,
    });
    if (verifyError) return { error: "Current password is incorrect." };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: `Failed to update password: ${error.message}` };

    await supabase.from("users").update({ is_first_login: false }).eq("id", user.id);

    await logAuditEvent({
      userId: user.id,
      userName: user.name,
      action: "reset_password",
      entityType: "auth",
    });

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to change password." };
  }
}

export async function createEmployeeAction(_: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  try {
    await requireRole("admin");
    const admin = createAdminClient();

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const employee_id = String(formData.get("employee_id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const department = String(formData.get("department") ?? "").trim();
    const position = String(formData.get("position") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!employee_id || !name || !email || !password || !department) {
      return { error: "All required fields must be filled." };
    }
    if (password.length < 8) return { error: "Password must be at least 8 characters." };

    const { data: existingId } = await admin
      .from("users")
      .select("id")
      .eq("employee_id", employee_id)
      .maybeSingle();
    if (existingId) return { error: "Employee ID already exists." };

    const { data: existingEmail } = await admin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existingEmail) return { error: "Email already registered." };

    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authUser?.user) {
      return { error: authError?.message || "Failed to create auth user." };
    }

    const { error: profileError } = await admin.from("users").insert({
      id: authUser.user.id,
      employee_id,
      name,
      email,
      role: "employee",
      department,
      position: position || null,
      phone: phone || null,
      status: "active",
      is_first_login: true,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(authUser.user.id);
      return { error: `Failed to create employee profile: ${profileError.message}` };
    }

    // Create onboarding items
    const defaultOnboarding = [
      { title: "Complete profile information", category: "general" },
      { title: "Submit ID proof documents", category: "documents" },
      { title: "IT equipment setup", category: "it_setup" },
      { title: "HR orientation", category: "hr" },
    ];

    await admin.from("onboarding_items").insert(
      defaultOnboarding.map((item) => ({
        user_id: authUser.user.id,
        ...item,
      }))
    );

    // Log employment history
    await admin.from("employment_history").insert({
      user_id: authUser.user.id,
      event_type: "hired",
      new_value: `${department} - ${position || "N/A"}`,
      effective_date: new Date().toISOString(),
      notes: "Employee onboarded via EMS",
    });

    revalidatePath("/admin/employees");
    revalidatePath("/admin/dashboard");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create employee." };
  }
}

export async function updateEmployeeStatusAction(formData: FormData) {
  try {
    const adminUser = await requireRole("admin");
    const supabase = await createClient();
    const userId = String(formData.get("user_id") ?? "");
    const status = String(formData.get("status") ?? "");

    if (!userId || !["active", "inactive"].includes(status)) {
      return { error: "Invalid request." };
    }

    const { data: existing } = await supabase
      .from("users")
      .select("status")
      .eq("id", userId)
      .maybeSingle();

    const { error } = await supabase.from("users").update({ status }).eq("id", userId);
    if (error) return { error: "Failed to update status." };

    await logAuditEvent({
      userId: adminUser.id,
      userName: adminUser.name,
      action: "update",
      entityType: "employee_status",
      entityId: userId,
      oldData: { status: existing?.status },
      newData: { status },
    });

    revalidatePath("/admin/employees");
    revalidatePath("/admin/dashboard");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update status." };
  }
}

export async function resetPasswordAction(
  _: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const adminUser = await requireRole("admin");
    const admin = createAdminClient();
    const userId = String(formData.get("user_id") ?? "");
    const newPassword = String(formData.get("new_password") ?? "");

    if (!userId) return { error: "User ID is required." };
    if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };

    const { error } = await admin.auth.admin.updateUserById(userId, { password: newPassword });
    if (error) return { error: `Failed to reset password: ${error.message}` };

    await admin.from("users").update({ is_first_login: true }).eq("id", userId);

    await logAuditEvent({
      userId: adminUser.id,
      userName: adminUser.name,
      action: "reset_password",
      entityType: "employee",
      entityId: userId,
    });

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to reset password." };
  }
}
