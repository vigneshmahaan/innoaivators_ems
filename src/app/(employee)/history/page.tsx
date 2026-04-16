import { Card } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const user = await requireRole("employee");
  const supabase = await createClient();
  const [{ data: attendance }, { data: logs }, { data: monthly }] = await Promise.all([
    supabase.from("attendance").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(30),
    supabase.from("daily_logs").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(30),
    supabase.from("monthly_summary").select("*").eq("user_id", user.id).order("month", { ascending: false }).limit(12),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">History & Performance</h1>
      <Card>
        <h2 className="mb-2 font-semibold">Attendance History</h2>
        <div className="text-sm text-slate-600">Entries: {(attendance ?? []).length}</div>
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Work Log History</h2>
        <div className="text-sm text-slate-600">Entries: {(logs ?? []).length}</div>
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Performance Trends</h2>
        <div className="text-sm text-slate-600">Monthly snapshots: {(monthly ?? []).length}</div>
      </Card>
    </div>
  );
}
