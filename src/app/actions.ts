"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, requireRole } from "@/lib/auth";

export async function loginAction(_: { error?: string }, formData: FormData) {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  let email = identifier;
  if (!identifier.includes("@")) {
    const { data } = await supabase
      .from("users")
      .select("email")
      .eq("employee_id", identifier)
      .maybeSingle();
    email = data?.email ?? "";
  }

  if (!email) {
    return { error: "No account found for this employee ID/email." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unable to load user profile." };

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
  
  // Only allow employees to login through this route
  if (profile?.role === "admin") {
    return { error: "Admins must use the admin login portal." };
  }
  
  redirect("/dashboard");
}

export async function adminLoginAction(_: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  if (!email) {
    return { error: "Email is required." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unable to load user profile." };

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
  
  // Only allow admins to login through this route
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Only admins can access the admin portal. Please use employee login." };
  }
  
  redirect("/admin/dashboard");
}

export async function adminSignupAction(_: { error?: string }, formData: FormData) {
  const admin = createAdminClient();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  // Check if admin already exists (use admin client to bypass RLS)
  const { data: existingAdmin } = await admin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingAdmin) {
    return { error: "This email is already registered." };
  }

  // Create auth user (using admin client with service role key)
  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    return { error: authError?.message || "Failed to create account." };
  }

  // Create admin profile (using admin client to bypass RLS)
  const { error: profileError } = await admin.from("users").insert({
    id: authUser.user.id,
    employee_id: `ADMIN-${Date.now()}`,
    name,
    email,
    role: "admin",
    status: "active",
    is_first_login: true,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    return { error: "Failed to create admin profile." };
  }

  redirect("/admin-login");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

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

    if (existing) {
      return { error: "You have already started work today." };
    }

    const { error } = await supabase.from("attendance").insert({
      user_id: user.id,
      date: today,
      login_time: new Date().toISOString(),
    });

    if (error) {
      return { error: "Failed to start work." };
    }

    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { error: undefined }; // Success
  } catch (err) {
    console.error("Error in startWorkAction:", err);
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

    if (!attendance) {
      return { error: "No active work session found. Click 'Start Work' first." };
    }

    if (!attendance.login_time) {
      return { error: "Invalid work session. Please start work again." };
    }

    if (attendance.logout_time) {
      return { error: "You have already ended work today." };
    }

    const logoutTime = new Date();
    const totalHours =
      (logoutTime.getTime() - new Date(attendance.login_time).getTime()) / (1000 * 60 * 60);

    const { error } = await supabase
      .from("attendance")
      .update({ 
        logout_time: logoutTime.toISOString(), 
        total_hours: Number(totalHours.toFixed(2)) 
      })
      .eq("id", attendance.id);

    if (error) {
      return { error: "Failed to end work." };
    }

    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { error: undefined }; // Success
  } catch (err) {
    console.error("Error in endWorkAction:", err);
    return { error: err instanceof Error ? err.message : "Failed to end work." };
  }
}

export async function submitDailyLogAction(formData: FormData) {
  const user = await requireAuth();
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const payload = {
    user_id: user.id,
    date: today,
    task_title: String(formData.get("task_title") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "In Progress"),
    hours_spent: Number(formData.get("hours_spent") ?? 0),
  };

  const { error } = await supabase.from("daily_logs").insert(payload);
  if (error) return;
  revalidatePath("/daily-log");
  revalidatePath("/history");
}

export async function changePasswordAction(formData: FormData) {
  await requireAuth();
  const oldPassword = String(formData.get("old_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");
  const identifier = String(formData.get("email") ?? "");
  const supabase = await createClient();

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: identifier,
    password: oldPassword,
  });
  if (verifyError) return;

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("users").update({ is_first_login: false }).eq("id", user.id);
  }
}

export async function createEmployeeAction(_: { error?: string }, formData: FormData) {
  try {
    await requireRole("admin");
    const admin = createAdminClient();
    const supabase = await createClient();
    
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const employee_id = String(formData.get("employee_id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "employee");
    const department = String(formData.get("department") ?? "").trim();

    // Validation
    if (!employee_id || !name || !email || !password || !department) {
      return { error: "All fields are required." };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }

    // Check if employee ID already exists (use admin client to bypass RLS)
    const { data: existingId } = await admin
      .from("users")
      .select("id")
      .eq("employee_id", employee_id)
      .maybeSingle();

    if (existingId) {
      return { error: "Employee ID already exists." };
    }

    // Check if email already exists (use admin client to bypass RLS)
    const { data: existingEmail } = await admin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingEmail) {
      return { error: "Email already registered." };
    }

    // Create auth user
    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authUser?.user) {
      return { error: authError?.message || "Failed to create auth user." };
    }

    // Create user profile (use admin client to bypass RLS)
    const { error: profileError } = await admin.from("users").insert({
      id: authUser.user.id,
      employee_id,
      name,
      email,
      role,
      department,
      status: "active",
      is_first_login: true,
    });

    if (profileError) {
      // Rollback: delete the auth user if profile creation fails
      await admin.auth.admin.deleteUser(authUser.user.id);
      return { error: `Failed to create employee profile: ${profileError.message}` };
    }

    // Revalidate both pages to update counts
    revalidatePath("/admin/employees");
    revalidatePath("/admin/dashboard");
    return { error: undefined }; // Success - no error
  } catch (err) {
    console.error("Error in createEmployeeAction:", err);
    return { error: err instanceof Error ? err.message : "Failed to create employee." };
  }
}

export async function resetPasswordAction(formData: FormData) {
  await requireRole("admin");
  const admin = createAdminClient();
  const supabase = await createClient();
  const userId = String(formData.get("user_id") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");

  const { error } = await admin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (error) return;

  await supabase.from("users").update({ is_first_login: true }).eq("id", userId);
}
