import { redirect } from "next/navigation";
import { ModernLoginForm } from "@/components/modern-login-form";
import { getCurrentUserProfile } from "@/lib/auth";

export default async function LoginPage() {
  const profile = await getCurrentUserProfile();
  if (profile) {
    redirect(profile.role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <ModernLoginForm />
    </main>
  );
}
