"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isPast } from "date-fns";
import {
  ClipboardList, User, Calendar, Building2,
  AlertTriangle, CheckCircle, Play, Clock, XCircle, Search,
  Pencil, Trash2, X
} from "lucide-react";
import { updateTaskAction, deleteTaskAction } from "@/app/actions/tasks";
import { toast } from "sonner";
import type { Task, TaskCategory } from "@/lib/types";

const STATUS_CONFIG = {
  Pending: { class: "badge badge-neutral", icon: <Clock size={10} /> },
  "In Progress": { class: "badge badge-info", icon: <Play size={10} /> },
  Completed: { class: "badge badge-success", icon: <CheckCircle size={10} /> },
  Cancelled: { class: "badge badge-danger", icon: <XCircle size={10} /> },
};

const PRIORITY_CONFIG = {
  Low: "badge badge-neutral",
  Medium: "badge badge-info",
  High: "badge badge-warning",
  Urgent: "badge badge-danger",
};

type FilterStatus = "All" | "Pending" | "In Progress" | "Completed" | "Cancelled";

export function AdminTasksClient({ tasks, categories }: { tasks: Task[]; categories: TaskCategory[] }) {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const counts: Record<FilterStatus, number> = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
    Cancelled: tasks.filter((t) => t.status === "Cancelled").length,
  };

  const filtered = tasks.filter((t) => {
    const matchFilter = filter === "All" || t.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(q) ||
      t.employee?.name?.toLowerCase().includes(q) ||
      t.employee?.employee_id?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  async function handleDelete(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const formData = new FormData();
    formData.set("task_id", taskId);
    const result = await deleteTaskAction(undefined, formData);
    if (result?.error) toast.error(result.error);
    else toast.success("Task deleted");
  }

  async function handleUpdate(formData: FormData) {
    const result = await updateTaskAction(undefined, formData);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Task updated");
      setEditingTask(null);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
        {[
          { label: "Total Tasks", value: counts.All, color: "var(--brand)" },
          { label: "Pending", value: counts.Pending, color: "var(--text-muted)" },
          { label: "In Progress", value: counts["In Progress"], color: "var(--info)" },
          { label: "Completed", value: counts.Completed, color: "var(--success)" },
          { label: "Cancelled", value: counts.Cancelled, color: "var(--danger)" },
        ].map((s) => (
          <div key={s.label} className="card text-center py-4">
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div 
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="input-icon-wrapper flex-1">
          <Search size={16} className="input-icon-left" />
          <input type="text" placeholder="Search by task title or employee..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-with-icon" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(counts) as FilterStatus[]).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-secondary"}`} style={{ minWidth: "90px" }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <ClipboardList size={40} className="empty-state-icon" />
          <p className="empty-state-title">No tasks found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Employee</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((task, idx) => {
                  const emp = task.employee;
                  const isOverdue = isPast(new Date(task.deadline)) && task.status !== "Completed";
                  const statusCfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.Pending;
                  const priorityCls = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.Medium;

                  return (
                    <motion.tr key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: idx * 0.03 }}>
                      <td>
                        <div className="max-w-[260px]">
                          <div className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{task.title}</div>
                          {task.description && <div className="text-xs truncate mt-1.5" style={{ color: "var(--text-muted)" }}>{task.description}</div>}
                          {task.category_name && <span className="badge text-[10px] mt-1" style={{ background: `${task.category_color}20`, color: task.category_color }}>{task.category_name}</span>}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0" style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
                            {emp?.name?.charAt(0) ?? "?"}
                          </div>
                          <div>
                            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{emp?.name ?? "Unknown"}</div>
                            <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{emp?.employee_id ?? "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={priorityCls}>{task.priority}</span></td>
                      <td>
                        <div className="flex items-center gap-1 text-xs" style={{ color: isOverdue ? "var(--danger)" : "var(--text-secondary)" }}>
                          {isOverdue && <AlertTriangle size={11} />}
                          <Calendar size={11} />
                          {format(new Date(task.deadline), "MMM dd, yyyy")}
                        </div>
                      </td>
                      <td><span className={statusCfg.class}>{statusCfg.icon} {task.status}</span></td>
                      <td>
                        <div className="w-full max-w-[80px]">
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                            <div className="h-full rounded-full" style={{ background: "var(--brand)", width: `${task.progress}%` }} />
                          </div>
                          <div className="text-[10px] text-center mt-0.5" style={{ color: "var(--text-muted)" }}>{task.progress}%</div>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => setEditingTask(task)} className="btn btn-sm btn-ghost" style={{ color: "var(--info)" }}><Pencil size={13} /></button>
                          <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }}><Trash2 size={13} /></button>
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTask && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditingTask(null)} />
            <motion.div className="relative z-10 w-full max-w-lg rounded-2xl card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Edit Task</h3>
                <button onClick={() => setEditingTask(null)} className="btn btn-icon btn-ghost"><X size={16} /></button>
              </div>
              <form action={handleUpdate} className="p-5 space-y-4">
                <input type="hidden" name="task_id" value={editingTask.id} />
                <div className="form-group">
                  <label className="label">Title</label>
                  <input name="title" defaultValue={editingTask.title} required className="input" />
                </div>
                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea name="description" defaultValue={editingTask.description || ""} rows={3} className="input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Deadline</label>
                    <input type="date" name="deadline" defaultValue={editingTask.deadline?.slice(0, 10)} required className="input" />
                  </div>
                  <div className="form-group">
                    <label className="label">Priority</label>
                    <select name="priority" defaultValue={editingTask.priority} className="input">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Category</label>
                  <select name="category_id" defaultValue={editingTask.category_id || ""} className="input">
                    <option value="">None</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Estimated Hours</label>
                  <input type="number" name="hours_estimated" defaultValue={editingTask.hours_estimated || 0} className="input" />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setEditingTask(null)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
