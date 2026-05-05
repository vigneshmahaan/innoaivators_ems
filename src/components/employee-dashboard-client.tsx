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
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Stats Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "1.5rem" 
        }}
      >
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
              <span className="text-xs font-bold" style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
            </div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
          gap: "2rem" 
        }}
      >
        {/* Recent Tasks */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Briefcase size={20} style={{ color: "var(--brand)" }} />
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Recent Tasks</h3>
            </div>
            <Link href="/tasks" className="text-xs font-bold" style={{ color: "var(--brand)" }}>View all →</Link>
          </div>
          {data.tasks.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No tasks assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {data.tasks.slice(0, 5).map((task) => {
                const isOverdue = isPast(new Date(task.deadline)) && task.status !== "Completed";
                return (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                    <div className={`w-1.5 h-10 rounded-full ${task.status === "Completed" ? "bg-green-500" : task.status === "In Progress" ? "bg-blue-500" : isOverdue ? "bg-red-500" : "bg-slate-500"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{task.title}</div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Announcements */}
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone size={18} style={{ color: "var(--warning)" }} />
              <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Announcements</h3>
            </div>
            {data.announcements.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No announcements.</p>
            ) : (
              <div className="space-y-3">
                {data.announcements.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                    <div className="flex items-center gap-2">
                      {a.pinned && <span className="text-[10px] px-1.5 font-bold rounded" style={{ background: "var(--warning-dim)", color: "var(--warning)" }}>PINNED</span>}
                      <span className={`text-[10px] px-1.5 font-bold rounded ${a.priority === "urgent" ? "bg-red-500/20 text-red-400" : a.priority === "high" ? "bg-orange-500/20 text-orange-400" : "bg-slate-500/20 text-slate-400"}`}>
                        {a.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-bold mt-2" style={{ color: "var(--text-primary)" }}>{a.title}</div>
                    <div className="text-xs line-clamp-2 mt-1" style={{ color: "var(--text-secondary)" }}>{a.content}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Leave Balances */}
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} style={{ color: "var(--info)" }} />
              <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Leave Balance</h3>
            </div>
            {data.leaveBalances.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No leave balance data.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {data.leaveBalances.map((lb) => (
                  <div key={lb.id} className="flex flex-col p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{lb.leave_type}</span>
                    <span className="text-lg font-black mt-1" style={{ color: "var(--brand)" }}>{lb.closing_balance}d</span>
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
