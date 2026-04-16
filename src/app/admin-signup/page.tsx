import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { AdminSignupPageClient } from "@/components/admin-signup-page-client";

export default async function AdminSignupPage() {
  const profile = await getCurrentUserProfile();

  // If already logged in, redirect to their dashboard
  if (profile) {
    if (profile.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/employee/dashboard");
    }
  }

  return <AdminSignupPageClient />;
}
