"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Search, ChevronDown, ChevronUp, User, Clock } from "lucide-react";
import type { AuditLog } from "@/lib/types";

export function AuditLogsClient({ logs }: { logs: AuditLog[] }) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      !search ||
      (log.user_name ?? "").toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entity_type.toLowerCase().includes(q) ||
      (log.entity_id ?? "").toLowerCase().includes(q)
    );
  });

  const ACTION_COLORS: Record<string, string> = {
    create: "var(--success)",
    update: "var(--info)",
    delete: "var(--danger)",
    login: "var(--brand)",
    logout: "var(--text-muted)",
    reset_password: "var(--warning)",
    approve: "var(--success)",
    reject: "var(--danger)",
    assign: "var(--accent)",
    complete: "var(--success)",
  };

  return (
    <div className="space-y-10">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--info-dim)", color: "var(--info)" }}
          >
            <Clock size={22} />
          </div>
          <div>
            <h1 className="page-title">Audit Logs</h1>
            <p className="page-subtitle">
              {logs.length} activity log{logs.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
        </div>

        <div className="input-icon-wrapper w-full sm:max-w-xs">
          <Search size={16} className="input-icon-left" />
          <input
            type="text"
            placeholder="Search activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-with-icon"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <Clock size={40} className="empty-state-icon" />
          <p className="empty-state-title">No audit logs found</p>
          <p className="empty-state-description">
            {search ? "Try adjusting your search." : "System activity will be recorded here."}
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Entity ID</th>
                <th className="text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, idx) => {
                const isExpanded = expandedId === log.id;
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <td>
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {format(parseISO(log.created_at), "MMM dd, yyyy")}
                      </span>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {format(parseISO(log.created_at), "HH:mm:ss")}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shrink-0"
                          style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
                        >
                          <User size={10} />
                        </div>
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                          {log.user_name ?? "System"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${ACTION_COLORS[log.action] ?? "var(--text-muted)"}1A`,
                          color: ACTION_COLORS[log.action] ?? "var(--text-muted)",
                          borderColor: `${ACTION_COLORS[log.action] ?? "var(--text-muted)"}33`,
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm capitalize" style={{ color: "var(--text-secondary)" }}>
                        {log.entity_type}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        {log.entity_id ?? "—"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : log.id)}
                          className="btn btn-sm btn-ghost"
                          style={{ color: "var(--text-muted)" }}
                          title={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {/* Expandable detail panels rendered outside table for layout flexibility */}
          <AnimatePresence>
            {filtered.map((log) => {
              const isExpanded = expandedId === log.id;
              if (!isExpanded) return null;
              return (
                <motion.div
                  key={`detail-${log.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2" style={{ background: "var(--bg-elevated)" }}>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--danger)" }}>
                        Old Data
                      </div>
                      <pre
                        className="rounded-lg p-3 text-xs overflow-auto"
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-default)",
                          color: "var(--text-secondary)",
                          maxHeight: 200,
                        }}
                      >
                        {log.old_data ? JSON.stringify(log.old_data, null, 2) : "—"}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--success)" }}>
                        New Data
                      </div>
                      <pre
                        className="rounded-lg p-3 text-xs overflow-auto"
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-default)",
                          color: "var(--text-secondary)",
                          maxHeight: 200,
                        }}
                      >
                        {log.new_data ? JSON.stringify(log.new_data, null, 2) : "—"}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
