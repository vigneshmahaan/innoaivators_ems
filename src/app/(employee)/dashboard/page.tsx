import { requireAuth } from "@/lib/auth";
import { getEmployeeDashboardData } from "@/lib/data";
import { EmployeeDashboardClient } from "@/components/employee-dashboard-client";

export default async function EmployeeDashboardPage() {
  const user = await requireAuth();
  const data = await getEmployeeDashboardData(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Welcome back, {user.name}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Here&apos;s what&apos;s happening today
        </p>
      </div>
      <EmployeeDashboardClient data={data} />
    </div>
  );
}
