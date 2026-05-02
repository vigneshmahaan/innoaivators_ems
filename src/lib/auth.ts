import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserRole } from "@/lib/types";

export const getCurrentUserProfile = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("users")
    .select("id, employee_id, name, email, role, status, is_first_login, department, position, phone, hire_date")
    .eq("id", user.id)
    .maybeSingle();

  return data as UserProfile | null;
});

export async function requireAuth() {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    redirect("/login");
  }
  return profile;
}

export async function requireRole(role: UserRole) {
  const profile = await requireAuth();
  if (profile.role !== role) {
    redirect(role === "admin" ? "/dashboard" : "/admin/dashboard");
  }
  return profile;
}

export async function requireActiveUser() {
  const profile = await requireAuth();
  if (profile.status !== "active") {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login?error=account_inactive");
  }
  return profile;
}
