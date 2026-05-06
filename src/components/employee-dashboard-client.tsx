"use client";

import { motion } from "framer-motion";
import { format, isPast } from "date-fns";
import {
  Clock, CheckCircle, AlertTriangle, 
  Calendar, TrendingUp, Megaphone, Briefcase
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
    <div className="flex flex-col gap-10">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="card card-stat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ borderLeft: `4px solid ${s.color}` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{s.label}</span>
            </div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <motion.div 
          className="card lg:col-span-2" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Briefcase size={20} className="text-brand" />
              <h3 className="text-lg font-bold text-text-primary">Recent Tasks</h3>
            </div>
            <Link href="/tasks" className="text-xs font-bold text-brand hover:underline">View all →</Link>
          </div>
          
          {data.tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase size={32} className="text-text-muted opacity-20 mb-3" />
              <p className="text-sm text-text-muted">No tasks assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.tasks.slice(0, 5).map((task) => {
                const isOverdue = isPast(new Date(task.deadline)) && task.status !== "Completed";
                return (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl bg-bg-elevated/50 hover:bg-bg-elevated transition-colors border border-border-subtle">
                    <div className={`w-1.5 h-10 rounded-full ${
                      task.status === "Completed" ? "bg-success" : 
                      task.status === "In Progress" ? "bg-info" : 
                      isOverdue ? "bg-danger" : "bg-text-placeholder"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-text-primary">{task.title}</div>
                      <div className="text-[11px] text-text-muted flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{task.priority}</span>
                        <span>•</span>
                        <span>Due {format(new Date(task.deadline), "MMM dd")}</span>
                      </div>
                    </div>
                    <span className={`badge text-[10px] ${
                      task.status === "Completed" ? "badge-success" : 
                      task.status === "In Progress" ? "badge-info" : 
                      isOverdue ? "badge-danger" : "badge-neutral"
                    }`}>
                      {task.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Side Panel */}
        <div className="flex flex-col gap-8">
          {/* Announcements */}
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone size={18} className="text-warning" />
              <h3 className="font-bold text-base text-text-primary">Announcements</h3>
            </div>
            {data.announcements.length === 0 ? (
              <p className="text-xs text-text-muted py-4">No recent announcements.</p>
            ) : (
              <div className="space-y-3">
                {data.announcements.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-bg-elevated/50 border border-border-subtle">
                    <div className="flex items-center gap-2">
                      {a.pinned && <span className="text-[9px] px-1.5 py-0.5 font-bold rounded bg-warning/10 text-warning">PINNED</span>}
                      <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded ${
                        a.priority === "urgent" ? "bg-danger/10 text-danger" : 
                        a.priority === "high" ? "bg-warning/10 text-warning" : 
                        "bg-text-placeholder/10 text-text-secondary"
                      }`}>
                        {a.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-bold mt-2 text-text-primary">{a.title}</div>
                    <div className="text-xs line-clamp-2 mt-1 text-text-secondary">{a.content}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Leave Balances */}
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-info" />
              <h3 className="font-bold text-base text-text-primary">Leave Balance</h3>
            </div>
            {data.leaveBalances.length === 0 ? (
              <p className="text-xs text-text-muted py-4">No leave balance data.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {data.leaveBalances.map((lb) => (
                  <div key={lb.id} className="flex flex-col p-3 rounded-xl bg-bg-elevated/50 border border-border-subtle">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{lb.leave_type}</span>
                    <span className="text-lg font-black mt-1 text-brand">{lb.closing_balance}d</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
