"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { createNotification } from "./notification-service";
import { logAuditEvent } from "./audit-service";
import type { Task, TaskComment, TaskTimeLog, TaskCategory } from "@/lib/types";

export async function getTaskCategories(): Promise<TaskCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_categories")
    .select("*")
    .eq("status", "active")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getEmployeeTasks(userId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select(
      "*, admin:admin_id(name), employee:employee_id(name,employee_id), category:category_id(name,color)"
    )
    .eq("employee_id", userId)
    .order("assign_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((t: Record<string, unknown>) => ({
    ...t,
    category_name: (t.category as Record<string, string> | null)?.name,
    category_color: (t.category as Record<string, string> | null)?.color,
  })) as Task[];
}

export async function getAdminTasks(limit = 100): Promise<Task[]> {
  await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select(
      "*, admin:admin_id(name), employee:employee_id(name,employee_id), category:category_id(name,color)"
    )
    .order("assign_date", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map((t: Record<string, unknown>) => ({
    ...t,
    category_name: (t.category as Record<string, string> | null)?.name,
    category_color: (t.category as Record<string, string> | null)?.color,
  })) as Task[];
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const user = await requireAuth();
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select(
      "*, admin:admin_id(name), employee:employee_id(name,employee_id), category:category_id(name,color)"
    )
    .eq("id", taskId);

  if (user.role === "employee") {
    query = query.eq("employee_id", user.id);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    ...data,
    category_name: (data.category as Record<string, string> | null)?.name,
    category_color: (data.category as Record<string, string> | null)?.color,
  } as Task;
}

export async function assignTask(input: {
  employee_id: string;
  title: string;
  description?: string;
  deadline: string;
  priority: string;
  category_id?: string;
  hours_estimated?: number;
}): Promise<Task> {
  const adminUser = await requireRole("admin");
  const supabase = await createClient();

  // Verify employee exists and is active
  const { data: employee, error: empError } = await supabase
    .from("users")
    .select("id, name, status")
    .eq("id", input.employee_id)
    .eq("role", "employee")
    .maybeSingle();

  if (empError || !employee) {
    throw new Error("Employee not found.");
  }
  if (employee.status !== "active") {
    throw new Error("Cannot assign tasks to inactive employees.");
  }

  const deadlineDate = new Date(input.deadline);
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title,
      description: input.description,
      admin_id: adminUser.id,
      employee_id: input.employee_id,
      deadline: deadlineDate.toISOString(),
      status: "Pending",
      priority: input.priority,
      assign_date: new Date().toISOString(),
      category_id: input.category_id || null,
      hours_estimated: input.hours_estimated || 0,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to assign task: " + error.message);

  await createNotification({
    userId: input.employee_id,
    title: "New Task Assigned",
    message: `You have been assigned: "${input.title}". Deadline: ${new Date(input.deadline).toDateString()}`,
    type: "task",
  });

  await logAuditEvent({
    userId: adminUser.id,
    userName: adminUser.name,
    action: "assign",
    entityType: "task",
    entityId: data.id,
    newData: input as Record<string, unknown>,
  });

  return data as Task;
}

export async function updateTask(input: {
  task_id: string;
  title?: string;
  description?: string;
  deadline?: string;
  priority?: string;
  category_id?: string | null;
  hours_estimated?: number;
}): Promise<Task> {
  const adminUser = await requireRole("admin");
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.deadline !== undefined) updateData.deadline = new Date(input.deadline).toISOString();
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.category_id !== undefined) updateData.category_id = input.category_id;
  if (input.hours_estimated !== undefined) updateData.hours_estimated = input.hours_estimated;

  const { data: existing } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", input.task_id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", input.task_id)
    .select()
    .single();

  if (error) throw new Error("Failed to update task: " + error.message);

  await logAuditEvent({
    userId: adminUser.id,
    userName: adminUser.name,
    action: "update",
    entityType: "task",
    entityId: input.task_id,
    oldData: existing as Record<string, unknown>,
    newData: updateData,
  });

  return data as Task;
}

export async function deleteTask(taskId: string) {
  const adminUser = await requireRole("admin");
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .maybeSingle();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw new Error("Failed to delete task: " + error.message);

  await logAuditEvent({
    userId: adminUser.id,
    userName: adminUser.name,
    action: "delete",
    entityType: "task",
    entityId: taskId,
    oldData: existing as Record<string, unknown>,
  });
}

export async function updateTaskStatus(input: {
  task_id: string;
  status: string;
  progress?: number;
}): Promise<Task> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("tasks")
    .select("*, employee:employee_id(id, name)")
    .eq("id", input.task_id)
    .maybeSingle();

  if (!task) throw new Error("Task not found.");

  if (user.role === "employee" && task.employee_id !== user.id) {
    throw new Error("You can only update your own tasks.");
  }

  // Status transition validation
  const validTransitions: Record<string, string[]> = {
    Pending: ["In Progress", "Cancelled"],
    "In Progress": ["Completed", "Cancelled"],
    Completed: [],
    Cancelled: ["Pending"],
  };

  const currentStatus = task.status as string;
  const newStatus = input.status;

  if (user.role === "employee" && !validTransitions[currentStatus]?.includes(newStatus)) {
    throw new Error(`Cannot transition from ${currentStatus} to ${newStatus}.`);
  }

  const updateData: Record<string, unknown> = { status: newStatus };
  if (input.progress !== undefined) updateData.progress = input.progress;
  if (newStatus === "Completed") updateData.progress = 100;

  const { data, error } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", input.task_id)
    .select()
    .single();

  if (error) throw new Error("Failed to update task status: " + error.message);

  // Notify admin on completion
  if (newStatus === "Completed") {
    await createNotification({
      userId: task.admin_id,
      title: "Task Completed",
      message: `"${task.title}" has been completed by ${(task.employee as Record<string, string>)?.name || "employee"}.`,
      type: "success",
    });
  }

  await logAuditEvent({
    userId: user.id,
    userName: user.name,
    action: "update",
    entityType: "task_status",
    entityId: input.task_id,
    newData: { status: newStatus, progress: updateData.progress },
  });

  return data as Task;
}

export async function addTaskComment(input: {
  task_id: string;
  comment: string;
}): Promise<TaskComment> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("task_comments")
    .insert({
      task_id: input.task_id,
      user_id: user.id,
      comment: input.comment,
    })
    .select("*, user:user_id(name)")
    .single();

  if (error) throw new Error("Failed to add comment: " + error.message);

  return {
    ...data,
    user_name: (data.user as Record<string, string> | null)?.name,
  } as TaskComment;
}

export async function getTaskComments(taskId: string): Promise<TaskComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_comments")
    .select("*, user:user_id(name)")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((c: Record<string, unknown>) => ({
    ...c,
    user_name: (c.user as Record<string, string> | null)?.name,
  })) as TaskComment[];
}

export async function addTaskTimeLog(input: {
  task_id: string;
  start_time: string;
  end_time?: string;
  description?: string;
}): Promise<TaskTimeLog> {
  const user = await requireAuth();
  const supabase = await createClient();

  const start = new Date(input.start_time);
  const end = input.end_time ? new Date(input.end_time) : null;
  const hours = end ? Number(((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2)) : 0;

  const { data, error } = await supabase
    .from("task_time_logs")
    .insert({
      task_id: input.task_id,
      user_id: user.id,
      start_time: input.start_time,
      end_time: input.end_time || null,
      hours,
      description: input.description,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to log time: " + error.message);

  // Update total hours spent on task
  const { data: logs } = await supabase
    .from("task_time_logs")
    .select("hours")
    .eq("task_id", input.task_id);

  const totalHours = (logs ?? []).reduce((sum, l) => sum + (l.hours ?? 0), 0);
  await supabase.from("tasks").update({ hours_spent: totalHours }).eq("id", input.task_id);

  return data as TaskTimeLog;
}

export async function getTaskTimeLogs(taskId: string): Promise<TaskTimeLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_time_logs")
    .select("*")
    .eq("task_id", taskId)
    .order("start_time", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createTaskCategory(input: {
  name: string;
  color?: string;
  description?: string;
}): Promise<TaskCategory> {
  await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_categories")
    .insert({
      name: input.name,
      color: input.color || "#3b82f6",
      description: input.description,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create category: " + error.message);
  return data as TaskCategory;
}
