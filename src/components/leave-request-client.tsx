"use client";

import { useState, useActionState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import {
  Calendar,
  Plus,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { submitLeaveRequestAction } from "@/app/actions";
import { toast } from "sonner";
import type { LeaveRequest } from "@/lib/types";

const LEAVE_TYPES = ["Sick", "Casual", "Earned", "Unpaid"] as const;

const STATUS_CONFIG = {
  Pending: {
    class: "lv-badge lv-badge-pending",
    icon: <Clock size={11} />,
  },
  Approved: {
    class: "lv-badge lv-badge-approved",
    icon: <CheckCircle size={11} />,
  },
  Rejected: {
    class: "lv-badge lv-badge-rejected",
    icon: <XCircle size={11} />,
  },
};

const LEAVE_TYPE_CFG = {
  Sick: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", abbr: "SI" },
  Casual: { bg: "rgba(6,182,212,0.1)", color: "#06b6d4", abbr: "CA" },
  Earned: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", abbr: "EA" },
  Unpaid: { bg: "rgba(139,156,196,0.08)", color: "#8b9cc4", abbr: "UN" },
};

interface LeaveRequestClientProps {
  leaves: LeaveRequest[];
}

function LeaveForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(submitLeaveRequestAction, {});
  const today = new Date().toISOString().split("T")[0];

  // Track state.success in a ref to avoid stale closure issues
  useEffect(() => {
    if (state.success) {
      toast.success("Leave request submitted successfully!");
      onSuccess();
    }
    // Only re-run when state changes - onSuccess is stable via useCallback in parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="lv-form-grid">
        {/* Leave Type */}
        <div className="lv-field">
          <label className="lv-label">Leave Type *</label>
          <select
            name="leave_type"
            className="lv-select"
            required
            disabled={isPending}
            defaultValue="Casual"
          >
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t} Leave
              </option>
            ))}
          </select>
        </div>

        <div />

        <div className="lv-field">
          <label className="lv-label">From Date *</label>
          <input
            type="date"
            name="from_date"
            className="lv-input"
            min={today}
            required
            disabled={isPending}
          />
        </div>

        <div className="lv-field">
          <label className="lv-label">To Date *</label>
          <input
            type="date"
            name="to_date"
            className="lv-input"
            min={today}
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="lv-field">
        <label className="lv-label">Reason (optional)</label>
        <textarea
          name="reason"
          placeholder="Briefly describe the reason for your leave..."
          rows={3}
          className="lv-textarea"
          disabled={isPending}
        />
      </div>

      {state.error && (
        <motion.div
          className="lv-error"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={14} />
          {state.error}
        </motion.div>
      )}

      <div className="flex justify-end gap-3">
        <button type="submit" className="lv-submit-btn" disabled={isPending}>
          {isPending ? (
            <>
              <span className="spinner" />
              Submitting...
            </>
          ) : (
            <>
              <Calendar size={15} />
              Submit Request
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function LeaveRequestClient({ leaves }: LeaveRequestClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  const handleSuccess = useCallback(() => {
    setShowForm(false);
    router.refresh();
  }, [router]);

  return (
    <div className="lv-page">
      {/* Stats Row */}
      <div className="lv-stats-grid">
        {[
          { label: "Total Requests", value: stats.total, color: "#4f8ef7", bg: "rgba(79,142,247,0.08)" },
          { label: "Pending", value: stats.pending, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
          { label: "Approved", value: stats.approved, color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
          { label: "Rejected", value: stats.rejected, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
        ].map((s) => (
          <motion.div
            key={s.label}
            className="lv-stat-card"
            style={{ borderColor: `${s.color}25` }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="lv-stat-value"
              style={{ color: s.color, background: s.bg }}
            >
              {s.value}
            </div>
            <div className="lv-stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Header + Toggle */}
      <div className="lv-section-header">
        <h2 className="lv-section-title">Leave History</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`lv-toggle-btn ${showForm ? "active" : ""}`}
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "Apply for Leave"}
        </button>
      </div>

      {/* Collapsible Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="leave-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="lv-form-card">
              <div className="lv-form-card-header">
                <Calendar size={18} />
                <h3>New Leave Application</h3>
              </div>
              <LeaveForm onSuccess={handleSuccess} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {leaves.length === 0 ? (
        <motion.div
          className="lv-empty"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Calendar size={40} className="lv-empty-icon" />
          <p className="lv-empty-title">No leave requests yet</p>
          <p className="lv-empty-desc">
            Click &ldquo;Apply for Leave&rdquo; to submit your first request.
          </p>
        </motion.div>
      ) : (
        <div className="lv-list">
          <AnimatePresence initial={false}>
            {leaves.map((leave, idx) => {
              const days =
                differenceInDays(new Date(leave.to_date), new Date(leave.from_date)) + 1;
              const cfg =
                LEAVE_TYPE_CFG[leave.leave_type as keyof typeof LEAVE_TYPE_CFG] ??
                LEAVE_TYPE_CFG.Unpaid;
              const statusCfg = STATUS_CONFIG[leave.status] ?? STATUS_CONFIG.Pending;

              return (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.04 }}
                  className="lv-card"
                >
                  {/* Avatar pill */}
                  <div
                    className="lv-avatar"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.abbr}
                  </div>

                  <div className="lv-card-body">
                    <div className="lv-card-top">
                      <span className="lv-type-text">
                        {leave.leave_type} Leave
                      </span>
                      <span className={statusCfg.class}>
                        {statusCfg.icon}
                        {leave.status}
                      </span>
                    </div>
                    <div className="lv-card-dates">
                      <Calendar size={11} />
                      {format(new Date(leave.from_date), "MMM dd")} –{" "}
                      {format(new Date(leave.to_date), "MMM dd, yyyy")} ·{" "}
                      <strong>{days}</strong> day{days !== 1 ? "s" : ""}
                    </div>
                    {leave.reason && (
                      <p className="lv-card-reason">{leave.reason}</p>
                    )}
                  </div>

                  <div className="lv-card-meta">
                    {format(new Date(leave.created_at), "MMM dd, yyyy")}
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
