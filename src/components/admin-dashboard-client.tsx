"use client";

import { motion } from "framer-motion";
import {
  Users, Clock, BarChart3, Calendar,
  ClipboardList, TrendingUp, AlertTriangle, Shield,
  DollarSign, FileSpreadsheet
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
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${s.color}20`, color: s.color }}>
                {s.icon}
              </div>
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Pending Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {pendingStats.map((s, i) => (
          <motion.div
            key={s.label}
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</span>
              <span className="text-lg font-black" style={{ color: s.color }}>{s.value}</span>
            </div>
            {s.href !== "#" && (
              <Link href={s.href} className="text-xs" style={{ color: "var(--brand)" }}>
                View all →
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} style={{ color: "var(--success)" }} />
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Top Performers</h3>
          </div>
          {data.topPerformers.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No performance data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topPerformers.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {p.users?.name ?? "Unknown"}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {p.tasks_completed} tasks · {p.attendance_percentage}% attendance
                    </div>
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--success)" }}>
                    {p.final_score.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Logs */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList size={18} style={{ color: "var(--info)" }} />
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Recent Daily Logs</h3>
          </div>
          {data.recentLogs.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No logs yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
                    {log.users?.name?.charAt(0) ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {log.task_title}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {log.users?.name ?? "Unknown"} · {log.hours_spent}h · {format(new Date(log.date), "MMM dd")}
                    </div>
                  </div>
                  <span className={`badge ${log.status === "Completed" ? "badge-success" : "badge-info"} text-[10px]`}>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} style={{ color: "var(--warning)" }} />
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Recent Audit Logs</h3>
          </div>
          <Link href="/admin/audit-logs" className="text-xs" style={{ color: "var(--brand)" }}>View all →</Link>
        </div>
        {data.recentAuditLogs.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No audit logs yet.</p>
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
                    <td className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {format(new Date(log.created_at), "MMM dd, HH:mm")}
                    </td>
                    <td className="text-sm">{log.user_name || "System"}</td>
                    <td><span className="badge badge-info text-[10px]">{log.action}</span></td>
                    <td className="text-xs" style={{ color: "var(--text-muted)" }}>
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
