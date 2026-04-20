import { Card, Badge } from "@/components/ui";
import { EmployeeCharts } from "@/components/employee-charts";
import { requireRole } from "@/lib/auth";
import { getEmployeeDashboardData } from "@/lib/data";
import { ListTodo, Clock, CheckCircle2, TrendingUp, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { StatCard } from "@/components/stat-card";

export default async function EmployeeDashboardPage() {
  const user = await requireRole("employee");
  const data = await getEmployeeDashboardData(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Employee Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user.name}. Here's your current overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Working Hours" 
          value={data.stats.totalHours} 
          icon={<Clock size={20} />} 
          color="blue" 
          index={0} 
        />
        <StatCard 
          title="Attendance %" 
          value={`${data.stats.attendancePercentage}%`} 
          icon={<TrendingUp size={20} />} 
          color="purple" 
          index={1} 
        />
        <StatCard 
          title="Pending Tasks" 
          value={data.stats.pendingTasksCount} 
          icon={<ListTodo size={20} />} 
          color="orange" 
          index={2} 
          description="Assigned by Admin"
        />
        <StatCard 
          title="Tasks Completed" 
          value={data.stats.tasksCompleted} 
          icon={<CheckCircle2 size={20} />} 
          color="green" 
          index={3} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Performance Trends
          </h2>
          <EmployeeCharts attendance={data.attendance} logs={data.logs} />
        </div>

        {/* Recent Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ListTodo size={20} className="text-orange-500" />
              Recent Assignments
            </h2>
            <Link href="/tasks" className="text-xs text-blue-400 font-bold hover:underline">View All</Link>
          </div>
          
          <div className="space-y-3">
            {data.tasks.length === 0 ? (
              <Card className="p-8 text-center bg-slate-900 border-slate-800">
                <p className="text-sm text-slate-500 italic">No tasks assigned yet.</p>
              </Card>
            ) : (
              data.tasks.slice(0, 3).map((task) => (
                <Card key={task.id} className="p-4 bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-200 text-sm">{task.title}</h3>
                      <Badge variant={task.status === "Pending" ? "warning" : "info"}>{task.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-blue-500" />
                        {(task.admin as any)?.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-purple-500" />
                        {task.deadline ? format(new Date(task.deadline), "MMM dd") : "No date"}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
