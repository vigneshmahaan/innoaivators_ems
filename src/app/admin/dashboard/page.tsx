import { Card } from "@/components/ui";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { StatCard } from "@/components/stat-card";
import { getAdminDashboardData } from "@/lib/data";
import { requireRole } from "@/lib/auth";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-slate-100">
            <TrendingUp size={20} className="text-orange-400" />
            Top Performers
          </h2>
          <ModernTable>
            <ModernTableHeader>
              <tr>
                <ModernTableCell header>Name</ModernTableCell>
                <ModernTableCell header>Score</ModernTableCell>
              </tr>
            </ModernTableHeader>
            <ModernTableBody>
              {data.topPerformers.map((item, idx) => (
                <ModernTableRow key={idx} index={idx}>
                  <ModernTableCell className="font-medium">
                    {(item.users as { name?: string })?.name ?? "-"}
                  </ModernTableCell>
                  <ModernTableCell className="font-bold text-blue-400">
                    {item.final_score}
                  </ModernTableCell>
                </ModernTableRow>
              ))}
            </ModernTableBody>
          </ModernTable>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-slate-100">
            <Clock size={20} className="text-blue-400" />
            Recent Activity (Daily Logs)
          </h2>
          <div className="space-y-4">
            {data.recentLogs.length === 0 ? (
              <p className="py-8 text-center text-slate-500 italic">No recent activity found.</p>
            ) : (
              data.recentLogs.map((log: any, idx) => (
                <div 
                  key={log.id} 
                  className={cn(
                    "p-3 rounded-lg border border-slate-700/50 bg-slate-800/30",
                    "hover:bg-slate-800/50 transition-colors"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-200 text-sm">{log.users?.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{log.date}</span>
                  </div>
                  <p className="text-xs text-slate-100 font-medium mb-1">{log.task_title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{log.description}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
