import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("admin");
  const supabase = await createClient();

  // Fetch pending counts for badge indicators
  const [
    { count: pendingLeaves },
    { count: pendingTasks },
  ] = await Promise.all([
    supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending"),
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .in("status", ["Pending", "In Progress"]),
  ]);

  return (
    <div className="page-wrapper">
      <Sidebar
        user={user}
        pendingLeaves={pendingLeaves ?? 0}
        pendingTasks={pendingTasks ?? 0}
      />
      <main className="main-content">
        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
