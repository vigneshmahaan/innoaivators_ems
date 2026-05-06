"use client";

import { motion } from "framer-motion";
import {
  Users, Clock, BarChart3, ClipboardList, 
  TrendingUp, Shield, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import type { AdminDashboardData } from "@/lib/types";

export function AdminDashboardClient({ data }: { data: AdminDashboardData }) {
  const stats = [
    { label: "Total Employees", value: data.totalEmployees, icon: <Users size={18} />, color: "var(--brand)" },
    { label: "Active Today", value: data.activeToday, icon: <Clock size={18} />, color: "var(--success)" },
    { label: "Total Hours", value: data.totalHours.toFixed(1), icon: <TrendingUp size={18} />, color: "var(--info)" },
    { label: "Avg Productivity", value: data.averageProductivity, icon: <BarChart3 size={18} />, color: "var(--warning)" },
  ];

  const pendingStats = [
    { label: "Pending Leaves", value: data.pendingLeaves, href: "/admin/leaves", color: "var(--danger)" },
    { label: "Pending Tasks", value: data.pendingTasks, href: "/admin/tasks", color: "var(--info)" },
    { label: "Pending OT", value: data.pendingOvertime, href: "#", color: "var(--warning)" },
    { label: "Pending Regularizations", value: data.pendingRegularizations, href: "#", color: "var(--text-muted)" },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* All Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main Stats */}
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="card card-stat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ borderLeft: `4px solid ${s.color}` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="flex h-9 w-9 items-center justify-center rounded-xl" 
                style={{ background: `${s.color}15`, color: s.color }}
              >
                {s.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {s.label}
              </span>
            </div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}

        {/* Pending Stats */}
        {pendingStats.map((s, i) => (
          <motion.div
            key={s.label}
            className="card card-stat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            style={{ borderLeft: `4px solid ${s.color}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {s.label}
              </span>
              <span className="text-xl font-black" style={{ color: s.color }}>{s.value}</span>
            </div>
            {s.href !== "#" ? (
              <Link href={s.href} className="text-xs font-bold flex items-center gap-1 text-brand hover:underline">
                View all <ArrowRight size={12} />
              </Link>
            ) : (
              <span className="text-[10px] font-medium text-text-placeholder italic">Coming soon</span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Top Performers */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-success" />
            <h3 className="text-lg font-bold text-text-primary">Top Performers</h3>
          </div>
          {data.topPerformers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
              <BarChart3 size={48} className="mb-4" />
              <p className="text-sm">No performance data yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.topPerformers.map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-bg-elevated/50 hover:bg-bg-elevated transition-colors border border-border-subtle">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black bg-brand/10 text-brand">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-text-primary">
                      {p.users?.name ?? "Unknown"}
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {p.tasks_completed} tasks · {p.attendance_percentage}% attendance
                    </div>
                  </div>
                  <div className="text-sm font-black text-success">
                    {p.final_score.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Logs */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList size={20} className="text-info" />
            <h3 className="text-lg font-bold text-text-primary">Recent Daily Logs</h3>
          </div>
          {data.recentLogs.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
              <ClipboardList size={48} className="mb-4" />
              <p className="text-sm">No logs recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-bg-elevated/50 hover:bg-bg-elevated transition-colors border border-border-subtle">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold bg-brand/10 text-brand">
                    {log.users?.name?.charAt(0) ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-text-primary">
                      {log.task_title}
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {log.users?.name ?? "Unknown"} · {log.hours_spent}h · {format(new Date(log.date), "MMM dd")}
                    </div>
                  </div>
                  <span className={`badge ${log.status === "Completed" ? "badge-success" : "badge-info"} text-[9px]`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Audit Logs */}
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-warning" />
            <h3 className="text-lg font-bold text-text-primary">Recent Audit Logs</h3>
          </div>
          <Link href="/admin/audit-logs" className="text-xs font-bold flex items-center gap-1 text-brand hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {data.recentAuditLogs.length === 0 ? (
          <p className="text-sm text-text-muted py-8 text-center">No audit logs yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-xs text-text-muted">
                      {format(new Date(log.created_at), "MMM dd, HH:mm")}
                    </td>
                    <td className="text-sm font-bold text-text-secondary">{log.user_name || "System"}</td>
                    <td><span className="badge badge-info text-[9px] uppercase">{log.action}</span></td>
                    <td className="text-[11px] text-text-muted">
                      {log.entity_type} {log.entity_id ? `· ${log.entity_id.slice(0, 8)}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
