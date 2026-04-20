import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth";
import { Card, Badge, Button } from "@/components/ui";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { format } from "date-fns";
import { ListTodo, Calendar, User, Clock } from "lucide-react";
import { toast } from "sonner";

async function updateTaskStatus(taskId: string, status: string, title?: string) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId);
  if (error) {
    toast.error(`Failed to update task: ${error.message}`);
    return;
  }
  toast.success(`Task "${title || 'Task'}" moved to ${status}`);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export default async function TasksPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const supabase = await createClient();
  console.log(`[TASKS_PAGE] Fetching tasks for user ${user.id} (${user.email})`);
  const { data: tasks, error: fetchError } = await supabase
    .from("tasks")
    .select("*, admin:admin_id(name)")
    .eq("employee_id", user.id)
    .order("assign_date", { ascending: false });

  if (fetchError) {
    console.error("[TASKS_PAGE] Fetch error:", fetchError);
  } else {
    console.log(`[TASKS_PAGE] Found ${tasks?.length || 0} tasks`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ListTodo size={32} className="text-blue-500" />
          My Assigned Tasks
        </h1>
      </div>

      <div className="grid gap-6">
        {(tasks ?? []).length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <ListTodo size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No tasks assigned yet.</p>
            <p className="text-sm">When an admin assigns you work, it will appear here.</p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 shadow-xl">
            <ModernTable>
              <ModernTableHeader>
                <tr>
                  <ModernTableCell header>Task Details</ModernTableCell>
                  <ModernTableCell header>Assigned By</ModernTableCell>
                  <ModernTableCell header>Deadline</ModernTableCell>
                  <ModernTableCell header>Status</ModernTableCell>
                  <ModernTableCell header>Action</ModernTableCell>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {(tasks ?? []).map((task, idx) => (
                  <ModernTableRow key={task.id} index={idx}>
                    <ModernTableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-100">{task.title}</span>
                        <span className="text-xs text-slate-400 line-clamp-2 max-w-md">
                          {task.description || "No description provided."}
                        </span>
                      </div>
                    </ModernTableCell>
                    <ModernTableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <User size={14} className="text-blue-400" />
                        {(task.admin as any)?.name || "Admin"}
                      </div>
                    </ModernTableCell>
                    <ModernTableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar size={14} className="text-purple-400" />
                        {format(new Date(task.deadline), "MMM dd, yyyy")}
                      </div>
                    </ModernTableCell>
                    <ModernTableCell>
                      <Badge 
                        variant={
                          task.status === "Completed" ? "success" : 
                          task.status === "In Progress" ? "info" : 
                          task.status === "Cancelled" ? "error" : "warning"
                        }
                      >
                        {task.status}
                      </Badge>
                    </ModernTableCell>
                    <ModernTableCell>
                      <div className="flex gap-2">
                        {task.status === "Pending" && (
                          <form action={async () => { "use server"; await updateTaskStatus(task.id, "In Progress", task.title); }}>
                            <Button size="sm" variant="outline" className="h-8 border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                              Start
                            </Button>
                          </form>
                        )}
                        {task.status === "In Progress" && (
                          <form action={async () => { "use server"; await updateTaskStatus(task.id, "Completed", task.title); }}>
                            <Button size="sm" variant="outline" className="h-8 border-green-500/50 text-green-400 hover:bg-green-500/10">
                              Finish
                            </Button>
                          </form>
                        )}
                        {task.status === "Completed" && (
                          <span className="text-xs text-green-500 flex items-center gap-1 font-medium">
                            Done
                          </span>
                        )}
                      </div>
                    </ModernTableCell>
                  </ModernTableRow>
                ))}
              </ModernTableBody>
            </ModernTable>
          </div>
        )}
      </div>
    </div>
  );
}
