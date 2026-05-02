"use client";

import { motion } from "framer-motion";
import { format, isPast } from "date-fns";
import {
  Clock, CheckCircle, AlertTriangle, BarChart3,
  Calendar, TrendingUp, Bell, Megaphone, Briefcase,
  FileText
} from "lucide-react";
import Link from "next/link";
import type { EmployeeDashboardData } from "@/lib/types";

export function EmployeeDashboardClient({ data }: { data: EmployeeDashboardData }) {
  const stats = [
    { label: "Total Hours", value: data.stats.totalHours.toFixed(1), icon: <Clock size={16} />, color: "var(--brand)" },
    { label: "Attendance", value: `${data.stats.attendancePercentage}%`, icon: <TrendingUp size={16} />, color: "var(--success)" },
    { label: "Tasks Done", value: data.stats.tasksCompleted, icon: <CheckCircle size={16} />, color: "var(--info)" },
    { label: "Pending Tasks", value: data.stats.pendingTasksCount, icon: <AlertTriangle size={16} />, color: "var(--warning)" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <motion.div className="lg:col-span-2 card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase size={18} style={{ color: "var(--brand)" }} />
              <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Recent Tasks</h3>
            </div>
            <Link href="/tasks" className="text-xs" style={{ color: "var(--brand)" }}>View all →</Link>
          </div>
          {data.tasks.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No tasks assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {data.tasks.slice(0, 5).map((task) => {
                const isOverdue = isPast(new Date(task.deadline)) && task.status !== "Completed";
                return (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                    <div className={`w-1 h-8 rounded-full ${task.status === "Completed" ? "bg-green-500" : task.status === "In Progress" ? "bg-blue-500" : isOverdue ? "bg-red-500" : "bg-slate-500"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{task.title}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {task.priority} · {format(new Date(task.deadline), "MMM dd")}
                      </div>
                    </div>
                    <span className={`badge text-[10px] ${task.status === "Completed" ? "badge-success" : task.status === "In Progress" ? "badge-info" : isOverdue ? "badge-danger" : "badge-neutral"}`}>
                      {task.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Announcements */}
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center gap-2 mb-3">
              <Megaphone size={16} style={{ color: "var(--warning)" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Announcements</h3>
            </div>
            {data.announcements.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No announcements.</p>
            ) : (
              <div className="space-y-2">
                {data.announcements.map((a) => (
                  <div key={a.id} className="p-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                    <div className="flex items-center gap-2">
                      {a.pinned && <span className="text-[10px] px-1 rounded" style={{ background: "var(--warning-dim)", color: "var(--warning)" }}>Pinned</span>}
                      <span className={`text-[10px] px-1 rounded ${a.priority === "urgent" ? "bg-red-500/20 text-red-400" : a.priority === "high" ? "bg-orange-500/20 text-orange-400" : "bg-slate-500/20 text-slate-400"}`}>
                        {a.priority}
                      </span>
                    </div>
                    <div className="text-sm font-medium mt-1" style={{ color: "var(--text-primary)" }}>{a.title}</div>
                    <div className="text-xs line-clamp-2" style={{ color: "var(--text-secondary)" }}>{a.content}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Leave Balances */}
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} style={{ color: "var(--info)" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Leave Balance</h3>
            </div>
            {data.leaveBalances.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No leave balance data.</p>
            ) : (
              <div className="space-y-2">
                {data.leaveBalances.map((lb) => (
                  <div key={lb.id} className="flex justify-between items-center p-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{lb.leave_type}</span>
                    <span className="text-sm font-bold" style={{ color: "var(--brand)" }}>{lb.closing_balance} days</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Attendance Quick Action */}
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} style={{ color: "var(--success)" }} />
              <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Today's Attendance</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${data.hasTodayAttendance ? (data.hasEndedToday ? "bg-green-500" : "bg-blue-500") : "bg-slate-500"}`} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {data.hasTodayAttendance
                  ? data.hasEndedToday
                    ? "Work completed for today"
                    : "Work in progress"
                  : "Not started yet"}
              </span>
            </div>
            <Link href="/attendance" className="btn btn-sm btn-primary mt-3 w-full">
              {data.hasTodayAttendance ? (data.hasEndedToday ? "View Details" : "End Work") : "Start Work"}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
