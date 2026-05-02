import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { AdminSignupForm } from "@/components/admin-signup-form";

export default async function AdminSignupPage() {
  const user = await getCurrentUserProfile();
  if (user) {
    redirect(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-base)" }}>
      <AdminSignupForm />
    </div>
  );
}
