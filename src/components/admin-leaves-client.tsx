"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import {
  CheckCircle, XCircle, Clock, User, Calendar,
  Building2, Filter
} from "lucide-react";
import { reviewLeaveRequestAction } from "@/app/actions";
import { toast } from "sonner";
import type { LeaveRequest } from "@/lib/types";

type FilterStatus = "All" | "Pending" | "Approved" | "Rejected";

const STATUS_CONFIG = {
  Pending: { class: "badge badge-warning", icon: <Clock size={10} /> },
  Approved: { class: "badge badge-success", icon: <CheckCircle size={10} /> },
  Rejected: { class: "badge badge-danger", icon: <XCircle size={10} /> },
};

const LEAVE_COLORS = {
  Sick: { color: "var(--danger)", dim: "var(--danger-dim)" },
  Casual: { color: "var(--info)", dim: "var(--info-dim)" },
  Earned: { color: "var(--success)", dim: "var(--success-dim)" },
  Unpaid: { color: "var(--text-muted)", dim: "rgba(77,90,120,0.1)" },
};

export function AdminLeavesClient({ leaves }: { leaves: LeaveRequest[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered =
    filter === "All" ? leaves : leaves.filter((l) => l.status === filter);

  const counts = {
    All: leaves.length,
    Pending: leaves.filter((l) => l.status === "Pending").length,
    Approved: leaves.filter((l) => l.status === "Approved").length,
    Rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  async function handleReview(
    leaveId: string,
    employeeId: string,
    action: "Approved" | "Rejected"
  ) {
    setLoadingId(`${leaveId}-${action}`);
    const formData = new FormData();
    formData.set("leave_id", leaveId);
    formData.set("employee_id", employeeId);
    formData.set("status", action);

    startTransition(async () => {
      const result = await reviewLeaveRequestAction(formData);
      if ((result as any)?.error) {
        toast.error((result as any).error);
      } else {
        toast.success(`Leave request ${action.toLowerCase()}`);
        router.refresh();
      }
      setLoadingId(null);
    });
  }

  if (leaves.length === 0) {
    return (
      <div className="card empty-state">
        <Calendar size={40} className="empty-state-icon" />
        <p className="empty-state-title">No leave requests found</p>
        <p className="empty-state-description">
          Employee leave requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["All", "Pending", "Approved", "Rejected"] as FilterStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-secondary"}`}
          >
            {s}
            <span
              className="ml-1 rounded-full px-1.5 text-[10px] font-bold"
              style={{
                background:
                  filter === s ? "rgba(255,255,255,0.2)" : "var(--bg-elevated)",
              }}
            >
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Leave Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((leave, idx) => {
            const emp = leave.users as any;
            const days =
              differenceInDays(new Date(leave.to_date), new Date(leave.from_date)) + 1;
            const cfg =
              LEAVE_COLORS[leave.leave_type as keyof typeof LEAVE_COLORS];
            const statusCfg = STATUS_CONFIG[leave.status] ?? STATUS_CONFIG.Pending;
            const isApproving = loadingId === `${leave.id}-Approved`;
            const isRejecting = loadingId === `${leave.id}-Rejected`;

            return (
              <motion.div
                key={leave.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: idx * 0.04 }}
                className="card"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  {/* Left */}
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black"
                      style={{ background: cfg?.dim, color: cfg?.color }}
                    >
                      {leave.leave_type.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                          {leave.leave_type} Leave
                        </span>
                        <span className={statusCfg.class}>
                          {statusCfg.icon}
                          {leave.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          {emp?.name ?? "Unknown"} ({emp?.employee_id ?? "—"})
                        </span>
                        {emp?.department && (
                          <span className="flex items-center gap-1">
                            <Building2 size={11} />
                            {emp.department}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {format(new Date(leave.from_date), "MMM dd")} –{" "}
                          {format(new Date(leave.to_date), "MMM dd, yyyy")} ({days}d)
                        </span>
                      </div>
                      {leave.reason && (
                        <p
                          className="text-xs mt-1.5 line-clamp-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Reason: {leave.reason}
                        </p>
                      )}
                      <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                        Applied {format(new Date(leave.created_at), "MMM dd, yyyy · h:mm a")}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {leave.status === "Pending" && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() =>
                          handleReview(leave.id, leave.user_id, "Approved")
                        }
                        disabled={!!(loadingId)}
                        className="btn btn-sm"
                        style={{
                          background: "var(--success-dim)",
                          color: "var(--success)",
                          borderColor: "rgba(34,197,94,0.2)",
                        }}
                      >
                        {isApproving ? (
                          <span className="spinner" style={{ width: 13, height: 13 }} />
                        ) : (
                          <CheckCircle size={13} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleReview(leave.id, leave.user_id, "Rejected")
                        }
                        disabled={!!(loadingId)}
                        className="btn btn-sm"
                        style={{
                          background: "var(--danger-dim)",
                          color: "var(--danger)",
                          borderColor: "rgba(239,68,68,0.2)",
                        }}
                      >
                        {isRejecting ? (
                          <span className="spinner" style={{ width: 13, height: 13 }} />
                        ) : (
                          <XCircle size={13} />
                        )}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="card empty-state py-10">
            <Filter size={28} className="empty-state-icon" />
            <p className="empty-state-title">No {filter} requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
