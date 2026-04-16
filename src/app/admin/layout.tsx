import { requireRole } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("admin");

  return (
    <AdminLayoutClient user={{ name: user.name, email: user.email ?? "" }}>
      {children}
    </AdminLayoutClient>
  );
}
