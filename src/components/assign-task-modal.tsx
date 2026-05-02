"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ClipboardList, AlignLeft, Calendar, AlertTriangle, ChevronDown, Clock, Tag
} from "lucide-react";
import { assignTaskAction } from "@/app/actions/tasks";
import { toast } from "sonner";
import type { TaskCategory } from "@/lib/types";

interface AssignTaskModalProps {
  employeeId: string;
  employeeName: string;
  isOpen: boolean;
  onClose: () => void;
  categories?: TaskCategory[];
}

const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export function AssignTaskModal({
  employeeId,
  employeeName,
  isOpen,
  onClose,
  categories = [],
}: AssignTaskModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState<string>("Medium");
  const [categoryId, setCategoryId] = useState<string>("");

  const minDate = new Date().toISOString().split("T")[0];

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("priority", priority);
    if (categoryId) formData.set("category_id", categoryId);
    try {
      const result = await assignTaskAction(undefined, formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(`Task assigned to ${employeeName} successfully!`);
        onClose();
      }
    } catch {
      const msg = "An unexpected error occurred.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: "var(--brand-dim)",
                    color: "var(--brand)",
                    border: "1px solid rgba(79,142,247,0.15)",
                  }}
                >
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Assign Task
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    To:{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "var(--brand)" }}
                    >
                      {employeeName}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="btn btn-icon btn-ghost"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <form action={handleSubmit} className="p-6 space-y-5">
              <input type="hidden" name="employee_id" value={employeeId} />

              {/* Task Title */}
              <div className="form-group">
                <label className="label flex items-center gap-2">
                  <ClipboardList size={14} style={{ color: "var(--text-muted)" }} />
                  Task Title <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  name="title"
                  placeholder="e.g., Design System Update"
                  required
                  disabled={loading}
                  className="input"
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="label flex items-center gap-2">
                  <AlignLeft size={14} style={{ color: "var(--text-muted)" }} />
                  Description
                  <span className="ml-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    (Optional)
                  </span>
                </label>
                <textarea
                  name="description"
                  placeholder="What needs to be done? Add any specific instructions..."
                  rows={3}
                  disabled={loading}
                  className="input"
                />
              </div>

              {/* Priority + Deadline row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div className="form-group">
                  <label className="label flex items-center gap-2">
                    <AlertTriangle size={14} style={{ color: "var(--text-muted)" }} />
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      disabled={loading}
                      className="input"
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div className="form-group">
                  <label className="label flex items-center gap-2">
                    <Calendar size={14} style={{ color: "var(--text-muted)" }} />
                    Deadline <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    required
                    disabled={loading}
                    min={minDate}
                    className="input"
                  />
                </div>
              </div>

              {/* Category */}
              {categories.length > 0 && (
                <div className="form-group">
                  <label className="label flex items-center gap-2">
                    <Tag size={14} style={{ color: "var(--text-muted)" }} />
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      disabled={loading}
                      className="input"
                    >
                      <option value="">None</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </div>
              )}

              {/* Hours Estimated */}
              <div className="form-group">
                <label className="label flex items-center gap-2">
                  <Clock size={14} style={{ color: "var(--text-muted)" }} />
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="hours_estimated"
                  placeholder="0"
                  min={0}
                  step="0.5"
                  disabled={loading}
                  className="input"
                />
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="alert alert-error text-sm"
                >
                  <AlertTriangle size={15} className="shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex min-w-[120px] items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <ClipboardList size={15} />
                      Assign Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
