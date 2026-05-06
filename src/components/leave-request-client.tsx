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
    class: "badge badge-warning",
    icon: <Clock size={11} />,
  },
  Approved: {
    class: "badge badge-success",
    icon: <CheckCircle size={11} />,
  },
  Rejected: {
    class: "badge badge-danger",
    icon: <XCircle size={11} />,
  },
};

const LEAVE_TYPE_CFG = {
  Sick: { bg: "rgba(239,68,68,0.1)", color: "var(--danger)", abbr: "SI" },
  Casual: { bg: "rgba(6,182,212,0.1)", color: "var(--info)", abbr: "CA" },
  Earned: { bg: "rgba(34,197,94,0.1)", color: "var(--success)", abbr: "EA" },
  Unpaid: { bg: "rgba(139,156,196,0.08)", color: "var(--text-muted)", abbr: "UN" },
};

interface LeaveRequestClientProps {
  leaves: LeaveRequest[];
}

function LeaveForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(submitLeaveRequestAction, {});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (state.success) {
      toast.success("Leave request submitted successfully!");
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Type */}
        <div className="form-group">
          <label className="label">Leave Type *</label>
          <select
            name="leave_type"
            className="input"
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

        <div className="hidden md:block" />

        <div className="form-group">
          <label className="label">From Date *</label>
          <input
            type="date"
            name="from_date"
            className="input"
            min={today}
            required
            disabled={isPending}
          />
        </div>

        <div className="form-group">
          <label className="label">To Date *</label>
          <input
            type="date"
            name="to_date"
            className="input"
            min={today}
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="label">Reason (optional)</label>
        <textarea
          name="reason"
          placeholder="Briefly describe the reason for your leave..."
          rows={3}
          className="input h-auto py-3"
          disabled={isPending}
        />
      </div>

      {state.error && (
        <motion.div
          className="alert alert-error"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={14} />
          {state.error}
        </motion.div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn btn-primary" disabled={isPending}>
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
    <div className="space-y-10">
      {/* Stats Row */}
      <div className="stats-grid">
        {[
          { label: "Total Requests", value: stats.total, color: "var(--brand)", bg: "var(--brand-dim)" },
          { label: "Pending", value: stats.pending, color: "var(--warning)", bg: "var(--warning-dim)" },
          { label: "Approved", value: stats.approved, color: "var(--success)", bg: "var(--success-dim)" },
          { label: "Rejected", value: stats.rejected, color: "var(--danger)", bg: "var(--danger-dim)" },
        ].map((s) => (
          <motion.div
            key={s.label}
            className="card py-6 flex items-center gap-5"
            style={{ borderLeft: `4px solid ${s.color}` }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black"
              style={{ color: s.color, background: s.bg }}
            >
              {s.value}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{s.label}</div>
              <div className="text-sm font-bold text-text-primary mt-0.5">Application Count</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Leave History</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
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
            className="overflow-hidden"
          >
            <div className="card border-brand/20 shadow-lg shadow-brand/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-primary">New Leave Application</h3>
                  <p className="text-xs text-text-muted">Fill in the details for your time off</p>
                </div>
              </div>
              <LeaveForm onSuccess={handleSuccess} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {leaves.length === 0 ? (
        <motion.div
          className="card py-16 flex flex-col items-center justify-center text-center gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Calendar size={48} className="text-text-muted opacity-20" />
          <div>
            <p className="text-lg font-bold text-text-secondary">No leave requests yet</p>
            <p className="text-sm text-text-muted max-w-xs mx-auto">
              Click &ldquo;Apply for Leave&rdquo; to submit your first request.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
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
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.04 }}
                  className="card p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                >
                  {/* Avatar pill */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xs font-black"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.abbr}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-primary">
                        {leave.leave_type} Leave
                      </span>
                      <span className={statusCfg.class}>
                        {statusCfg.icon}
                        {leave.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {format(new Date(leave.from_date), "MMM dd")} –{" "}
                        {format(new Date(leave.to_date), "MMM dd, yyyy")}
                      </div>
                      <span className="h-1 w-1 rounded-full bg-text-placeholder" />
                      <div>
                        <strong className="text-text-secondary">{days}</strong> day{days !== 1 ? "s" : ""}
                      </div>
                    </div>
                    {leave.reason && (
                      <p className="text-xs text-text-secondary mt-2 line-clamp-1 italic">&quot;{leave.reason}&quot;</p>
                    )}
                  </div>

                  <div className="text-[11px] font-medium text-text-muted text-right md:border-l md:border-border-subtle md:pl-6">
                    Applied on<br/>
                    <span className="text-text-secondary">{format(new Date(leave.created_at), "MMM dd, yyyy")}</span>
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
