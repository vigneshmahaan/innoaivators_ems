import { requireRole } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/data";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";

export default async function AdminDashboardPage() {
  await requireRole("admin");
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Overview of your organization
          </p>
        </div>
      </div>
      <AdminDashboardClient data={data} />
    </div>
  );
}
