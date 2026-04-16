import { redirect } from "next/navigation";
import { AdminLoginPageClient } from "@/components/admin-login-page-client";
import { getCurrentUserProfile } from "@/lib/auth";

export default async function AdminLoginPage() {
  const profile = await getCurrentUserProfile();
  if (profile) {
    if (profile.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/dashboard");
    }
  }

  return <AdminLoginPageClient />;
}
