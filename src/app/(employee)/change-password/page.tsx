import { requireAuth } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ first?: string }>;
}) {
  const user = await requireAuth();
  const params = await searchParams;
  const isFirst = params.first === "true";

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {isFirst ? "Set Your Password" : "Change Password"}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {isFirst
            ? "Please change your temporary password before continuing."
            : "Update your account password."}
        </p>
      </div>
      <ChangePasswordForm isFirst={isFirst} />
    </div>
  );
}
