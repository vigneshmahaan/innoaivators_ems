"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  CalendarPlus, Trash2, X, Calendar, Repeat, Search,
} from "lucide-react";
import { createHolidayAction, deleteHolidayAction } from "@/app/actions/settings";
import { toast } from "sonner";
import type { Holiday } from "@/lib/types";

function AddHolidayModal({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createHolidayAction({}, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Holiday created successfully");
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
            >
              <CalendarPlus size={18} />
            </div>
            <div>
              <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>
                Add Holiday
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Create a new holiday entry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon btn-ghost"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group sm:col-span-2">
              <label className="label">Name *</label>
              <input
                name="name"
                placeholder="e.g. Diwali"
                required
                className="input"
                disabled={isPending}
              />
            </div>
            <div className="form-group">
              <label className="label">Date *</label>
              <input
                type="date"
                name="date"
                required
                className="input"
                disabled={isPending}
              />
            </div>
            <div className="form-group">
              <label className="label">Type *</label>
              <select name="type" required className="input" disabled={isPending}>
                <option value="public">Public</option>
                <option value="optional">Optional</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
            <div className="form-group sm:col-span-2">
              <label className="label">Description</label>
              <textarea
                name="description"
                placeholder="Optional description..."
                className="input"
                disabled={isPending}
              />
            </div>
            <div className="form-group sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="recurring"
                  value="true"
                  className="h-4 w-4 rounded border-gray-600"
                  disabled={isPending}
                />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Recurring holiday (repeats every year)
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? <><span className="spinner" /> Creating...</> : <><CalendarPlus size={15} /> Create Holiday</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function HolidaysClient({ holidays }: { holidays: Holiday[] }) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = holidays.filter((h) => {
    const q = search.toLowerCase();
    return (
      !search ||
      h.name.toLowerCase().includes(q) ||
      h.type.toLowerCase().includes(q)
    );
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this holiday?")) return;
    const formData = new FormData();
    formData.set("id", id);
    startTransition(async () => {
      const result = await deleteHolidayAction(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Holiday deleted");
      }
    });
  }

  const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
    public: { bg: "var(--success-dim)", color: "var(--success)" },
    optional: { bg: "var(--info-dim)", color: "var(--info)" },
    restricted: { bg: "var(--warning-dim)", color: "var(--warning)" },
  };

  return (
    <div className="space-y-10">
      {/* Toolbar */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="input-icon-wrapper flex-1 min-w-[200px]">
          <Search size={16} className="input-icon-left" />
          <input
            type="text"
            placeholder="Search holidays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-with-icon"
          />
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary shrink-0">
          <CalendarPlus size={16} />
          Add Holiday
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <Calendar size={40} className="empty-state-icon" />
          <p className="empty-state-title">No holidays found</p>
          <p className="empty-state-description">
            {search ? "Try adjusting your search." : "Add holidays to manage your organization calendar."}
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Recurring</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((h, idx) => {
                  const typeCfg = TYPE_COLORS[h.type] ?? TYPE_COLORS.public;
                  return (
                    <motion.tr
                      key={h.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td>
                        <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          {h.name}
                        </div>
                        {h.description && (
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {h.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <Calendar size={13} style={{ color: "var(--text-muted)" }} />
                          {format(parseISO(h.date), "MMM dd, yyyy")}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: typeCfg.bg,
                            color: typeCfg.color,
                            borderColor: `${typeCfg.color}33`,
                          }}
                        >
                          {h.type}
                        </span>
                      </td>
                      <td>
                        {h.recurring ? (
                          <span className="flex items-center gap-1 text-xs badge badge-success">
                            <Repeat size={10} />
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDelete(h.id)}
                            disabled={isPending}
                            className="btn btn-sm btn-danger"
                            title="Delete holiday"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showAddModal && <AddHolidayModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
