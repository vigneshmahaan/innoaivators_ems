"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isPast } from "date-fns";
import {
  ListTodo, Calendar, User, AlertTriangle,
  CheckCircle, Play, Clock, XCircle, Filter,
  MessageSquare, BarChart3, ChevronDown
} from "lucide-react";
import { updateTaskStatusAction, addTaskCommentAction } from "@/app/actions/tasks";
import { getTaskComments, addTaskTimeLog } from "@/services/task-service";
import { toast } from "sonner";
import type { Task, TaskStatus, TaskCategory, TaskComment } from "@/lib/types";

const PRIORITY_CONFIG = {
  Low: { class: "badge badge-neutral", dot: "var(--text-muted)" },
  Medium: { class: "badge badge-info", dot: "var(--info)" },
  High: { class: "badge badge-warning", dot: "var(--warning)" },
  Urgent: { class: "badge badge-danger", dot: "var(--danger)" },
};

const STATUS_CONFIG = {
  Pending: { class: "badge badge-neutral", icon: <Clock size={10} /> },
  "In Progress": { class: "badge badge-info", icon: <Play size={10} /> },
  Completed: { class: "badge badge-success", icon: <CheckCircle size={10} /> },
  Cancelled: { class: "badge badge-danger", icon: <XCircle size={10} /> },
};

const STATUS_FILTERS: Array<TaskStatus | "All"> = ["All", "Pending", "In Progress", "Completed", "Cancelled"];

export function TasksClient({ tasks, categories }: { tasks: Task[]; categories: TaskCategory[] }) {
  const [filter, setFilter] = useState<TaskStatus | "All">("All");
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, TaskComment[]>>({});
  const [newComment, setNewComment] = useState("");

  const filtered = filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  async function handleUpdateStatus(taskId: string, newStatus: TaskStatus, taskTitle: string, progress?: number) {
    setLoadingId(taskId);
    const formData = new FormData();
    formData.set("task_id", taskId);
    formData.set("status", newStatus);
    if (progress !== undefined) formData.set("progress", String(progress));

    startTransition(async () => {
      const result = await updateTaskStatusAction(undefined, formData);
      if (result?.error) toast.error(result.error);
      else toast.success(`"${taskTitle}" marked as ${newStatus}`);
      setLoadingId(null);
    });
  }

  async function loadComments(taskId: string) {
    const data = await getTaskComments(taskId);
    setComments((prev) => ({ ...prev, [taskId]: data }));
  }

  async function handleAddComment(taskId: string) {
    if (!newComment.trim()) return;
    const formData = new FormData();
    formData.set("task_id", taskId);
    formData.set("comment", newComment);
    const result = await addTaskCommentAction(undefined, formData);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Comment added");
      setNewComment("");
      loadComments(taskId);
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="card empty-state">
        <ListTodo size={48} className="empty-state-icon" />
        <p className="empty-state-title">No tasks assigned yet</p>
        <p className="empty-state-description">When an admin assigns you work, it will appear here.</p>
      </div>
    );
  }

  const counts = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
    Cancelled: tasks.filter((t) => t.status === "Cancelled").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm transition-all ${filter === s ? "btn-primary" : "btn-secondary"}`}>
            {s}
            <span className="ml-1 rounded-full px-1.5 text-[10px] font-bold" style={{ background: filter === s ? "rgba(255,255,255,0.2)" : "var(--bg-elevated)" }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((task, idx) => {
            const isOverdue = isPast(new Date(task.deadline)) && task.status !== "Completed";
            const isLoading = loadingId === task.id;
            const adminName = task.admin?.name ?? "Admin";
            const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.Medium;
            const statusCfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.Pending;
            const isExpanded = expandedTask === task.id;
            const taskComments = comments[task.id] ?? [];

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                className="card group"
                style={{ borderColor: isOverdue ? "rgba(239,68,68,0.2)" : undefined }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {task.category_name && (
                        <span className="badge" style={{ background: `${task.category_color}20`, color: task.category_color, borderColor: `${task.category_color}40` }}>
                          {task.category_name}
                        </span>
                      )}
                      <span className={priority.class}>{task.priority}</span>
                      <span className={statusCfg.class}>{statusCfg.icon} {task.status}</span>
                      {isOverdue && (
                        <span className="badge badge-danger"><AlertTriangle size={10} /> Overdue</span>
                      )}
                    </div>
                    <h3 className="font-bold text-base leading-tight mb-1" style={{ color: "var(--text-primary)" }}>{task.title}</h3>
                    {task.description && (
                      <p className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>{task.description}</p>
                    )}

                    {/* Progress bar */}
                    {task.status !== "Completed" && task.status !== "Cancelled" && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "var(--brand)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-2 flex flex-wrap gap-4">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        <User size={12} /> Assigned by {adminName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: isOverdue ? "var(--danger)" : "var(--text-muted)" }}>
                        <Calendar size={12} /> {format(new Date(task.deadline), "MMM dd, yyyy")}
                      </div>
                      {task.hours_estimated ? (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Clock size={12} /> Est: {task.hours_estimated}h
                          {task.hours_spent ? ` / Spent: ${task.hours_spent}h` : ""}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => { setExpandedTask(isExpanded ? null : task.id); if (!isExpanded) loadComments(task.id); }}
                      className="btn btn-sm btn-ghost"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <MessageSquare size={13} />
                    </button>
                    {task.status === "Pending" && (
                      <button onClick={() => handleUpdateStatus(task.id, "In Progress", task.title)} disabled={isLoading} className="btn btn-sm" style={{ background: "var(--info-dim)", color: "var(--info)", borderColor: "rgba(6,182,212,0.2)" }}>
                        {isLoading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Play size={13} />}
                        Start
                      </button>
                    )}
                    {task.status === "In Progress" && (
                      <>
                        <button onClick={() => handleUpdateStatus(task.id, "Completed", task.title, 100)} disabled={isLoading} className="btn btn-sm" style={{ background: "var(--success-dim)", color: "var(--success)", borderColor: "rgba(34,197,94,0.2)" }}>
                          {isLoading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <CheckCircle size={13} />}
                          Done
                        </button>
                      </>
                    )}
                    {task.status === "Completed" && (
                      <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--success)" }}>
                        <CheckCircle size={16} /> Done
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                        {/* Comments */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Comments</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {taskComments.length === 0 && (
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No comments yet.</p>
                            )}
                            {taskComments.map((c) => (
                              <div key={c.id} className="rounded-lg p-2 text-sm" style={{ background: "var(--bg-elevated)" }}>
                                <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>{c.user_name || "User"}</span>
                                  <span>{format(new Date(c.created_at), "MMM dd, HH:mm")}</span>
                                </div>
                                <p style={{ color: "var(--text-secondary)" }}>{c.comment}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="input text-sm flex-1"
                              onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(task.id); }}
                            />
                            <button onClick={() => handleAddComment(task.id)} className="btn btn-sm btn-primary">
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="card empty-state py-12">
            <Filter size={32} className="empty-state-icon" />
            <p className="empty-state-title">No {filter} tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
