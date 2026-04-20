import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";

export async function getEmployeeDashboardData(userId: string) {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const [
    { data: attendance }, 
    { data: logs }, 
    { data: performance },
    { data: tasks }
  ] = await Promise.all([
      supabase
        .from("attendance")
        .select("date,total_hours,login_time")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(30),
      supabase
        .from("daily_logs")
        .select("date,status,hours_spent")
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
        .select("*, admin:admin_id(name)")
        .eq("employee_id", userId)
        .order("assign_date", { ascending: false })
        .limit(10),
    ]);

  const totalHours = (attendance ?? []).reduce((acc, item) => acc + (item.total_hours ?? 0), 0);
  const tasksCompleted = (logs ?? []).filter((l) => l.status === "Completed").length;
  const pendingTasksCount = (tasks ?? []).filter((t) => t.status === "Pending" || t.status === "In Progress").length;
  
  const attendancePercentage =
    attendance && attendance.length > 0
      ? Math.round((attendance.filter((item) => Boolean(item.login_time)).length / attendance.length) * 100)
      : 0;
  const productivityScore =
    performance && performance.length > 0
      ? Number(
          (
            performance.reduce((acc, row) => acc + (row.total_score ?? 0), 0) / performance.length
          ).toFixed(2),
        )
      : 0;

  const hasTodayAttendance = (attendance ?? []).some((a) => a.date === today);

  return {
    attendance: attendance ?? [],
    logs: logs ?? [],
    performance: performance ?? [],
    tasks: tasks ?? [],
    stats: { totalHours, attendancePercentage, tasksCompleted, productivityScore, pendingTasksCount },
    hasTodayAttendance,
  };
}

export async function getAdminDashboardData() {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const [
    { count: totalEmployees }, 
    { count: activeToday }, 
    { data: attendance }, 
    { data: topPerformers },
    { data: recentLogs }
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "employee"),
    supabase.from("attendance").select("*", { count: "exact", head: true }).eq("date", today),
    supabase.from("attendance").select("total_hours,date").order("date", { ascending: false }).limit(100),
    supabase
      .from("monthly_summary")
      .select("final_score,tasks_completed,attendance_percentage,users(name,employee_id)")
      .order("final_score", { ascending: false })
      .limit(10),
    supabase
      .from("daily_logs")
      .select("*, users(name, employee_id)")
      .order("date", { ascending: false })
      .limit(5)
  ]);

  const totalHours = (attendance ?? []).reduce((acc, item) => acc + (item.total_hours ?? 0), 0);
  const averageProductivity =
    topPerformers && topPerformers.length > 0
      ? Number(
          (
            topPerformers.reduce((acc, row) => acc + (row.final_score ?? 0), 0) / topPerformers.length
          ).toFixed(2),
        )
      : 0;

  return {
    totalEmployees: totalEmployees ?? 0,
    activeToday: activeToday ?? 0,
    totalHours,
    averageProductivity,
    topPerformers: topPerformers ?? [],
    recentLogs: recentLogs ?? []
  };
}
