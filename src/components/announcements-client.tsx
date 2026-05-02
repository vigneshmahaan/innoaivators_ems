"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Megaphone,
  Trash2,
  X,
  Search,
  Pin,
  CheckCircle,
  XCircle,
  Plus,
  AlertTriangle,
  Globe,
  Building2,
  Info,
} from "lucide-react";
import { createAnnouncementAction, deleteAnnouncementAction } from "@/app/actions/settings";
import { toast } from "sonner";
import type { Announcement, Department } from "@/lib/types";

const PRIORITY_META: Record<
  string,
  { label: string; class: string; dot: string }
> = {
  low: {
    label: "Low",
    class:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-700 uppercase tracking-wide bg-slate-800 text-slate-400 border border-slate-700",
    dot: "bg-slate-400",
  },
  normal: {
    label: "Normal",
    class:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-700 uppercase tracking-wide bg-cyan-950/60 text-cyan-400 border border-cyan-800/50",
    dot: "bg-cyan-400",
  },
  high: {
    label: "High",
    class:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-700 uppercase tracking-wide bg-amber-950/60 text-amber-400 border border-amber-700/50",
    dot: "bg-amber-400",
  },
  urgent: {
    label: "Urgent",
    class:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-700 uppercase tracking-wide bg-red-950/60 text-red-400 border border-red-800/50",
    dot: "bg-red-400",
  },
};

const TYPE_META: Record<string, { icon: React.ReactNode; label: string }> = {
  company: { icon: <Building2 size={12} />, label: "Company" },
  department: { icon: <Globe size={12} />, label: "Department" },
  general: { icon: <Info size={12} />, label: "General" },
};

function AddAnnouncementModal({
  departments,
  onClose,
}: {
  departments: Department[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const rawData = new FormData(form);

    // Build clean FormData with selected departments
    const formData = new FormData();
    for (const [key, value] of rawData.entries()) {
      if (key !== "department_ids") formData.append(key, value);
    }
    selectedDepts.forEach((id) => formData.append("department_ids", id));

    startTransition(async () => {
      const result = await createAnnouncementAction({}, formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Announcement published successfully!");
        router.refresh();
        onClose();
      }
    });
  }

  const typeOptions = ["company", "department", "general"] as const;
  const priorityOptions = ["low", "normal", "high", "urgent"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Panel */}
      <motion.div
        className="ann-modal relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
      >
        {/* Header */}
        <div className="ann-modal-header">
          <div className="flex items-center gap-3">
            <div className="ann-icon-wrap">
              <Megaphone size={18} />
            </div>
            <div>
              <h2 className="ann-modal-title">New Announcement</h2>
              <p className="ann-modal-sub">Broadcast a message to your organization</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ann-close-btn"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ann-modal-body">
          <div className="ann-field-group">
            <label className="ann-label">Title *</label>
            <input
              name="title"
              placeholder="e.g. Office closure on 15th May"
              required
              className="ann-input"
              disabled={isPending}
            />
          </div>

          <div className="ann-field-group">
            <label className="ann-label">Content *</label>
            <textarea
              name="content"
              placeholder="Write your announcement message here..."
              required
              className="ann-input ann-textarea"
              rows={4}
              disabled={isPending}
            />
          </div>

          <div className="ann-grid-2">
            <div className="ann-field-group">
              <label className="ann-label">Type *</label>
              <select name="type" required className="ann-input ann-select" disabled={isPending}>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="ann-field-group">
              <label className="ann-label">Priority *</label>
              <select name="priority" required className="ann-input ann-select" disabled={isPending}>
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {departments.length > 0 && (
            <div className="ann-field-group">
              <label className="ann-label">Target Departments</label>
              <div className="ann-dept-chips">
                {departments.map((d) => {
                  const selected = selectedDepts.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        setSelectedDepts((prev) =>
                          selected ? prev.filter((x) => x !== d.id) : [...prev, d.id]
                        )
                      }
                      className={`ann-dept-chip ${selected ? "selected" : ""}`}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
              {selectedDepts.length === 0 && (
                <p className="ann-hint">No filter = visible to everyone</p>
              )}
            </div>
          )}

          <div className="ann-grid-2">
            <div className="ann-field-group">
              <label className="ann-label">Expires At</label>
              <input
                type="date"
                name="expires_at"
                className="ann-input"
                disabled={isPending}
              />
            </div>
            <div className="ann-field-group" style={{ justifyContent: "flex-end" }}>
              <label className="ann-checkbox-label">
                <input
                  type="checkbox"
                  name="pinned"
                  value="true"
                  className="ann-checkbox"
                  disabled={isPending}
                />
                <div>
                  <span className="ann-checkbox-text">Pin announcement</span>
                  <span className="ann-hint">Shows at top of list</span>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <motion.div
              className="ann-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle size={14} />
              {error}
            </motion.div>
          )}

          <div className="ann-modal-footer">
            <button type="button" onClick={onClose} className="ann-btn-cancel" disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className="ann-btn-publish" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="spinner" />
                  Publishing...
                </>
              ) : (
                <>
                  <Megaphone size={15} />
                  Publish
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function AnnouncementsClient({
  announcements,
  departments,
}: {
  announcements: Announcement[];
  departments: Department[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = announcements.filter((a) => {
    const q = search.toLowerCase();
    return (
      !search ||
      a.title.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.priority.toLowerCase().includes(q)
    );
  });

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm("Delete this announcement? This cannot be undone.")) return;
      setDeletingId(id);
      const formData = new FormData();
      formData.set("id", id);
      startTransition(async () => {
        const result = await deleteAnnouncementAction(formData);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Announcement deleted");
          router.refresh();
        }
        setDeletingId(null);
      });
    },
    [router]
  );

  const handleClose = useCallback(() => setShowAddModal(false), []);

  return (
    <div className="ann-page">
      {/* ── Toolbar ── */}
      <div className="ann-toolbar">
        <div className="ann-search-wrap">
          <Search size={14} className="ann-search-icon" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ann-search-input"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="ann-btn-add"
        >
          <Plus size={16} />
          Add Announcement
        </button>
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <motion.div
          className="ann-empty"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="ann-empty-icon">
            <Megaphone size={36} />
          </div>
          <p className="ann-empty-title">No announcements found</p>
          <p className="ann-empty-desc">
            {search ? (
              "Try adjusting your search query."
            ) : (
              <>
                Click <span className="font-medium">"Add Announcement"</span> to
                publish your first one.
              </>
            )}
          </p>
        </motion.div>
      ) : (
        <div className="ann-table-wrap">
          <table className="ann-table">
            <thead>
              <tr>
                <th>Announcement</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Published</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((a, idx) => {
                  const pMeta = PRIORITY_META[a.priority] ?? PRIORITY_META.normal;
                  const tMeta = TYPE_META[a.type] ?? TYPE_META.general;
                  const isDeleting = deletingId === a.id;

                  return (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.03 }}
                      className={isDeleting ? "ann-row-deleting" : ""}
                    >
                      <td className="ann-td-title">
                        <div className="ann-title-row">
                          {a.pinned && (
                            <Pin size={12} className="ann-pin-icon" />
                          )}
                          <span className="ann-title-text">{a.title}</span>
                        </div>
                        <p className="ann-content-preview">{a.content}</p>
                      </td>

                      <td>
                        <span className="ann-type-badge">
                          {tMeta.icon}
                          {tMeta.label}
                        </span>
                      </td>

                      <td>
                        <span className={pMeta.class}>
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${pMeta.dot}`}
                          />
                          {pMeta.label}
                        </span>
                      </td>

                      <td>
                        {a.status === "active" ? (
                          <span className="ann-status-active">
                            <CheckCircle size={11} />
                            Active
                          </span>
                        ) : (
                          <span className="ann-status-inactive">
                            <XCircle size={11} />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="ann-td-date">
                        <span>
                          {format(
                            parseISO(a.published_at ?? a.created_at),
                            "MMM dd, yyyy"
                          )}
                        </span>
                        {a.published_by_name && (
                          <span className="ann-by">by {a.published_by_name}</span>
                        )}
                      </td>

                      <td className="ann-td-actions">
                        <button
                          onClick={() => handleDelete(a.id)}
                          disabled={isPending}
                          className="ann-delete-btn"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <AddAnnouncementModal departments={departments} onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
