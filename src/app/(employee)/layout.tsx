import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/navigation";
import { RealTimeClock } from "@/components/real-time-clock";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("employee");
  const supabase = await createClient();

  // Fetch unread notifications count
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="page-wrapper">
      <Sidebar user={user} notifications={notifications ?? []} />
      <RealTimeClock />
      <main className="main-content">
        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
