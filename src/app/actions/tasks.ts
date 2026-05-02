"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  assignTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskCommentSchema,
} from "@/lib/schemas";
import {
  assignTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addTaskComment,
  addTaskTimeLog,
} from "@/services/task-service";

export async function assignTaskAction(_: { error?: string } | undefined, formData: FormData) {
  try {
    const input = {
      employee_id: String(formData.get("employee_id") ?? ""),
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || undefined,
      deadline: String(formData.get("deadline") ?? ""),
      priority: String(formData.get("priority") ?? "Medium"),
      category_id: String(formData.get("category_id") ?? "") || undefined,
      hours_estimated: Number(formData.get("hours_estimated") ?? 0) || undefined,
    };

    const parse = assignTaskSchema.safeParse(input);
    if (!parse.success) return { error: parse.error.issues[0].message };

    await assignTask(parse.data);

    revalidatePath("/admin/employees");
    revalidatePath("/admin/tasks");
    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to assign task." };
  }
}

export async function updateTaskAction(_: { error?: string } | undefined, formData: FormData) {
  try {
    const input = {
      task_id: String(formData.get("task_id") ?? ""),
      title: String(formData.get("title") ?? "").trim() || undefined,
      description: String(formData.get("description") ?? "").trim() || undefined,
      deadline: String(formData.get("deadline") ?? "") || undefined,
      priority: String(formData.get("priority") ?? "") || undefined,
      category_id: String(formData.get("category_id") ?? "") || undefined,
      hours_estimated: Number(formData.get("hours_estimated") ?? 0) || undefined,
    };

    const parse = updateTaskSchema.safeParse(input);
    if (!parse.success) return { error: parse.error.issues[0].message };

    await updateTask(parse.data);

    revalidatePath("/admin/tasks");
    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update task." };
  }
}

export async function deleteTaskAction(_: { error?: string } | undefined, formData: FormData) {
  try {
    const taskId = String(formData.get("task_id") ?? "");
    if (!taskId) return { error: "Task ID is required." };

    await deleteTask(taskId);

    revalidatePath("/admin/tasks");
    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete task." };
  }
}

export async function updateTaskStatusAction(
  _: { error?: string } | undefined,
  formData: FormData
) {
  try {
    const input = {
      task_id: String(formData.get("task_id") ?? ""),
      status: String(formData.get("status") ?? ""),
      progress: Number(formData.get("progress") ?? 0) || undefined,
    };

    const parse = updateTaskStatusSchema.safeParse(input);
    if (!parse.success) return { error: parse.error.issues[0].message };

    await updateTaskStatus(parse.data);

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    revalidatePath("/admin/tasks");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update task status." };
  }
}

export async function addTaskCommentAction(_: { error?: string } | undefined, formData: FormData) {
  try {
    const input = {
      task_id: String(formData.get("task_id") ?? ""),
      comment: String(formData.get("comment") ?? "").trim(),
    };

    const parse = taskCommentSchema.safeParse(input);
    if (!parse.success) return { error: parse.error.issues[0].message };

    await addTaskComment(parse.data);
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to add comment." };
  }
}

export async function addTaskTimeLogAction(
  _: { error?: string } | undefined,
  formData: FormData
) {
  try {
    const taskId = String(formData.get("task_id") ?? "");
    const startTime = String(formData.get("start_time") ?? "");
    const endTime = String(formData.get("end_time") ?? "") || undefined;
    const description = String(formData.get("description") ?? "").trim() || undefined;

    if (!taskId || !startTime) return { error: "Task and start time are required." };

    await addTaskTimeLog({ task_id: taskId, start_time: startTime, end_time: endTime, description });

    revalidatePath("/tasks");
    return { error: undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to log time." };
  }
}
