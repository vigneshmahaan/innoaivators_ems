import { Card } from "@/components/ui";
import { EmployeeCharts } from "@/components/employee-charts";
import { requireRole } from "@/lib/auth";
import { getEmployeeDashboardData } from "@/lib/data";

export default async function EmployeeDashboardPage() {
  const user = await requireRole("employee");
  const data = await getEmployeeDashboardData(user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Total Working Hours</p><p className="text-2xl font-bold">{data.stats.totalHours}</p></Card>
        <Card><p className="text-sm text-slate-500">Attendance %</p><p className="text-2xl font-bold">{data.stats.attendancePercentage}%</p></Card>
        <Card><p className="text-sm text-slate-500">Tasks Completed</p><p className="text-2xl font-bold">{data.stats.tasksCompleted}</p></Card>
        <Card><p className="text-sm text-slate-500">Productivity Score</p><p className="text-2xl font-bold">{data.stats.productivityScore}</p></Card>
      </div>
      <EmployeeCharts attendance={data.attendance} logs={data.logs} />
    </div>
  );
}
