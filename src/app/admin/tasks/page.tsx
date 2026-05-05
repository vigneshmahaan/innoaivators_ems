import { requireRole } from "@/lib/auth";
import { getAdminTasksData } from "@/lib/data";
import { getTaskCategories } from "@/services/task-service";
import { AdminTasksClient } from "@/components/admin-tasks-client";

export default async function AdminTasksPage() {
  await requireRole("admin");
  const [tasks, categories] = await Promise.all([
    getAdminTasksData(),
    getTaskCategories(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Tasks
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Manage all tasks across employees
          </p>
        </div>
      </div>
      <AdminTasksClient tasks={tasks} categories={categories} />
    </div>
  );
}
