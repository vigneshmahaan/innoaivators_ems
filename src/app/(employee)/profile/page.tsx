import { getCurrentUserProfile } from "@/lib/auth";
import { getEmployeeDashboardData } from "@/lib/data";
import { Card, Badge } from "@/components/ui";
import { StatCard } from "@/components/stat-card";
import { User, Mail, IdCard, ShieldCheck, Calendar, Zap } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const data = await getEmployeeDashboardData(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Column: Avatar and Quick Info */}
        <Card className="flex flex-col items-center justify-center p-8 text-center md:w-1/3">
          <div className="relative mb-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
              <span className="text-5xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 rounded-full border-4 border-slate-900 bg-green-500 p-2 shadow-lg">
              <Zap size={16} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">{user.name}</h1>
          <p className="text-sm font-medium text-slate-400">{user.role.toUpperCase()}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="success" className="capitalize">
              {user.status}
            </Badge>
            <Badge variant="info" className="capitalize">
              {user.employee_id}
            </Badge>
          </div>
        </Card>

        {/* Right Column: Detailed Stats Overview */}
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <StatCard
            title="Attendance"
            value={`${data.stats.attendancePercentage}%`}
            description="Overall reliability"
            icon={<ShieldCheck size={24} className="text-green-400" />}
            color="green"
            index={0}
          />
          <StatCard
            title="Total Hours"
            value={data.stats.totalHours}
            description="Total logged time"
            icon={<Calendar size={24} className="text-blue-400" />}
            color="blue"
            index={1}
          />
          <StatCard
            title="Tasks Completed"
            value={data.stats.tasksCompleted}
            description="Success rate"
            icon={<Zap size={24} className="text-orange-400" />}
            color="orange"
            index={2}
          />
          <StatCard
            title="Productivity"
            value={data.stats.productivityScore}
            description="Current score"
            icon={<TrendingUp size={24} className="text-purple-400" />}
            color="purple"
            index={3}
          />
        </div>
      </div>

      {/* Profile Details Card */}
      <Card className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-100">
          <IdCard className="text-blue-400" /> Personal Details
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</p>
            <div className="flex items-center gap-3 text-slate-200">
              <User size={18} className="text-slate-400" />
              <span className="text-lg">{user.name}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Employee ID</p>
            <div className="flex items-center gap-3 text-slate-200">
              <IdCard size={18} className="text-slate-400" />
              <span className="text-lg">{user.employee_id}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</p>
            <div className="flex items-center gap-3 text-slate-200">
              <Mail size={18} className="text-slate-400" />
              <span className="text-lg">{user.email ?? "Not provided"}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Permissions</p>
            <div className="flex items-center gap-3 text-slate-200">
              <ShieldCheck size={18} className="text-slate-400" />
              <span className="text-lg capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Re-using TrendingUp icon locally
function TrendingUp({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
