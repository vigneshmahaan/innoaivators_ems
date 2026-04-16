import { Card } from "@/components/ui";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { StatCard } from "@/components/stat-card";
import { getAdminDashboardData } from "@/lib/data";
import { requireRole } from "@/lib/auth";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  await requireRole("admin");
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={data.totalEmployees}
          icon={<Users size={24} />}
          color="blue"
          index={0}
        />
        <StatCard
          title="Active Today"
          value={data.activeToday}
          icon={<UserCheck size={24} />}
          color="green"
          index={1}
        />
        <StatCard
          title="Total Hours Worked"
          value={Math.round(data.totalHours)}
          icon={<Clock size={24} />}
          color="purple"
          index={2}
        />
        <StatCard
          title="Average Productivity"
          value={`${data.averageProductivity}%`}
          icon={<TrendingUp size={24} />}
          color="orange"
          index={3}
        />
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Top Performers</h2>
        <ModernTable>
          <ModernTableHeader>
            <tr>
              <ModernTableCell header>Name</ModernTableCell>
              <ModernTableCell header>Employee ID</ModernTableCell>
              <ModernTableCell header>Score</ModernTableCell>
            </tr>
          </ModernTableHeader>
          <ModernTableBody>
            {data.topPerformers.map((item, idx) => (
              <ModernTableRow key={idx} index={idx}>
                <ModernTableCell>{(item.users as { name?: string })?.name ?? "-"}</ModernTableCell>
                <ModernTableCell>{(item.users as { employee_id?: string })?.employee_id ?? "-"}</ModernTableCell>
                <ModernTableCell className="font-semibold text-blue-400">{item.final_score}</ModernTableCell>
              </ModernTableRow>
            ))}
          </ModernTableBody>
        </ModernTable>
      </div>
    </div>
  );
}
