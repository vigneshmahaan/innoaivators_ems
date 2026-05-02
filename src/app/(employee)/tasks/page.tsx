import { requireAuth } from "@/lib/auth";
import { getEmployeeTasks, getTaskCategories } from "@/services/task-service";
import { TasksClient } from "@/components/tasks-client";

export default async function EmployeeTasksPage() {
  const user = await requireAuth();
  const [tasks, categories] = await Promise.all([
    getEmployeeTasks(user.id),
    getTaskCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          My Tasks
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          View and manage your assigned tasks
        </p>
      </div>
      <TasksClient tasks={tasks} categories={categories} />
    </div>
  );
}
