import { redirect } from "next/navigation";
import { ModernLoginForm } from "@/components/modern-login-form";
import { getCurrentUserProfile } from "@/lib/auth";

export default async function LoginPage() {
  const profile = await getCurrentUserProfile();
  if (profile) {
    redirect(profile.role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ModernLoginForm />
    </main>
  );
}
