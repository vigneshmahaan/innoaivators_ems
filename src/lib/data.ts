import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getCompanySettings } from "@/services/settings-service";
import type {
  EmployeeDashboardData,
  AdminDashboardData,
  AttendanceRecord,
  DailyLog,
  LeaveRequest,
  SalaryRecord,
  Task,
  Notification,
  PerformanceStat,
  Announcement,
  LeaveBalance,
  AuditLog,
  UserProfile,
} from "@/lib/types";

// ─── EMPLOYEE DATA ─────────────────────────────────────────────────────────

export async function getEmployeeDashboardData(userId: string): Promise<EmployeeDashboardData> {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const [
    { data: attendance },
    { data: logs },
    { data: performance },
    { data: tasks },
    { data: notifications },
    { data: todayAttendance },
    { data: announcements },
    { data: leaveBalances },
  ] = await Promise.all([
    supabase
      .from("attendance")
      .select("id,date,total_hours,login_time,logout_time")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(30),
    supabase
      .from("daily_logs")
      .select("id,date,status,hours_spent,task_title,description")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(30),
    supabase
      .from("performance_stats")
      .select("date,total_score,attendance_score,task_score")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(30),
    supabase
      .from("tasks")
      .select("*, admin:admin_id(name), category:category_id(name,color)")
      .eq("employee_id", userId)
      .order("assign_date", { ascending: false })
      .limit(20),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("attendance")
      .select("id,login_time,logout_time")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle(),
    supabase
      .from("announcements")
      .select("*")
      .eq("status", "active")
      .or(`type.eq.company,and(type.eq.department, department_ids.cs.{${userId}})`)
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(5),
    supabase
      .from("leave_balances")
      .select("*")
      .eq("user_id", userId)
      .eq("year", new Date().getFullYear()),
  ]);

  const totalHours = (attendance ?? []).reduce((acc, item) => acc + (item.total_hours ?? 0), 0);
  const tasksCompleted = (tasks ?? []).filter((t) => t.status === "Completed").length;
  const pendingTasksCount = (tasks ?? []).filter(
    (t) => t.status === "Pending" || t.status === "In Progress"
  ).length;

  const attendancePercentage =
    attendance && attendance.length > 0
      ? Math.round(
          (attendance.filter((item) => Boolean(item.login_time)).length / attendance.length) * 100
        )
      : 0;

  const productivityScore =
    performance && performance.length > 0
      ? Number(
          (
            performance.reduce((acc, row) => acc + (row.total_score ?? 0), 0) / performance.length
          ).toFixed(2)
        )
      : 0;

  const unreadNotifications = (notifications ?? []).filter((n) => !n.is_read).length;

  const companySettings = await getCompanySettings();

  return {
    attendance: (attendance ?? []) as AttendanceRecord[],
    logs: (logs ?? []) as DailyLog[],
    performance: (performance ?? []) as PerformanceStat[],
    tasks: (tasks ?? []).map((t: Record<string, unknown>) => ({
      ...t,
      category_name: (t.category as Record<string, string> | null)?.name,
      category_color: (t.category as Record<string, string> | null)?.color,
    })) as Task[],
    notifications: (notifications ?? []) as Notification[],
    announcements: (announcements ?? []) as Announcement[],
    leaveBalances: (leaveBalances ?? []) as LeaveBalance[],
    stats: {
      totalHours,
      attendancePercentage,
      tasksCompleted,
      productivityScore,
      pendingTasksCount,
      unreadNotifications,
    },
    hasTodayAttendance: Boolean(todayAttendance),
    hasEndedToday: Boolean(todayAttendance?.logout_time),
    companySettings: companySettings ?? undefined,
  };
}

export async function getEmployeeLeaveData(userId: string): Promise<LeaveRequest[]> {
  const supabase = await createClient();
  const { data: leaves } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (leaves ?? []) as LeaveRequest[];
}

export async function getEmployeeSalaryData(userId: string): Promise<SalaryRecord[]> {
  const supabase = await createClient();
  const { data: salary } = await supabase
    .from("salary_records")
    .select("*")
    .eq("user_id", userId)
    .order("month", { ascending: false });
  return (salary ?? []) as SalaryRecord[];
}

// ─── ADMIN DATA ────────────────────────────────────────────────────────────

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const [
    { count: totalEmployees },
    { count: activeToday },
    { data: attendance },
    { data: topPerformers },
    { data: recentLogs },
    { count: pendingLeaves },
    { count: pendingTasks },
    { count: pendingOvertime },
    { count: pendingRegularizations },
    { data: recentAuditLogs },
    { data: upcomingBirthdays },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "employee")
      .eq("status", "active"),
    supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("date", today),
    supabase
      .from("attendance")
      .select("total_hours,date")
      .order("date", { ascending: false })
      .limit(100),
    supabase
      .from("monthly_summary")
      .select("final_score,tasks_completed,attendance_percentage,users(name,employee_id)")
      .order("final_score", { ascending: false })
      .limit(10),
    supabase
      .from("daily_logs")
      .select("*, users(name,employee_id)")
      .order("date", { ascending: false })
      .limit(8),
    supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending"),
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .in("status", ["Pending", "In Progress"]),
    supabase
      .from("overtime")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending"),
    supabase
      .from("attendance_regularizations")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending"),
    supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("users")
      .select("name,hire_date")
      .eq("role", "employee")
      .eq("status", "active")
      .limit(5),
  ]);

  const totalHours = (attendance ?? []).reduce((acc, item) => acc + (item.total_hours ?? 0), 0);
  const averageProductivity =
    topPerformers && topPerformers.length > 0
      ? Number(
          (
            topPerformers.reduce((acc, row) => acc + (row.final_score ?? 0), 0) /
            topPerformers.length
          ).toFixed(2)
        )
      : 0;

  return {
    totalEmployees: totalEmployees ?? 0,
    activeToday: activeToday ?? 0,
    totalHours,
    averageProductivity,
    topPerformers: (topPerformers ?? []) as unknown as AdminDashboardData["topPerformers"],
    recentLogs: (recentLogs ?? []) as unknown as AdminDashboardData["recentLogs"],
    pendingLeaves: pendingLeaves ?? 0,
    pendingTasks: pendingTasks ?? 0,
    pendingOvertime: pendingOvertime ?? 0,
    pendingRegularizations: pendingRegularizations ?? 0,
    recentAuditLogs: (recentAuditLogs ?? []) as AuditLog[],
    upcomingBirthdays: (upcomingBirthdays ?? []) as Array<{ name: string; hire_date?: string }>,
  };
}

export async function getAdminEmployeeList(): Promise<UserProfile[]> {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("id,employee_id,name,email,role,department,position,phone,status,hire_date,created_at")
    .eq("role", "employee")
    .order("name");
  return (users ?? []) as UserProfile[];
}

export async function getAdminTasksData(): Promise<Task[]> {
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, employee:employee_id(name,employee_id), admin:admin_id(name), category:category_id(name,color)")
    .order("assign_date", { ascending: false })
    .limit(100);

  return (tasks ?? []).map((t: Record<string, unknown>) => ({
    ...t,
    category_name: (t.category as Record<string, string> | null)?.name,
    category_color: (t.category as Record<string, string> | null)?.color,
  })) as Task[];
}

export async function getAdminLeaveRequests(): Promise<LeaveRequest[]> {
  const supabase = await createClient();
  const { data: leaves } = await supabase
    .from("leave_requests")
    .select("*, users(name,employee_id,department)")
    .order("created_at", { ascending: false });
  return (leaves ?? []) as LeaveRequest[];
}

export async function getAdminAttendanceData(date?: string): Promise<AttendanceRecord[]> {
  const supabase = await createClient();
  const targetDate = date ?? format(new Date(), "yyyy-MM-dd");
  const { data: records } = await supabase
    .from("attendance")
    .select("*, users(name,employee_id,department)")
    .eq("date", targetDate)
    .order("login_time", { ascending: false });
  return (records ?? []) as AttendanceRecord[];
}

export async function getEmployeeAttendanceHistory(userId: string, limit = 30): Promise<AttendanceRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit);
  return (data ?? []) as AttendanceRecord[];
}

export async function getEmployeeFullHistory(userId: string): Promise<DailyLog[]> {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  return (logs ?? []) as DailyLog[];
}
