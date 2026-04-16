import { changePasswordAction } from "@/app/actions";
import { Button, Card, Input } from "@/components/ui";
import { requireRole } from "@/lib/auth";

export default async function ChangePasswordPage() {
  const user = await requireRole("employee");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Change Password</h1>
      <Card>
        <form action={changePasswordAction} className="space-y-4">
          <input type="hidden" name="email" value={user.email ?? ""} />
          <div><label className="mb-1 block text-sm">Old Password</label><Input name="old_password" type="password" required /></div>
          <div><label className="mb-1 block text-sm">New Password</label><Input name="new_password" type="password" minLength={8} required /></div>
          <Button type="submit">Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
