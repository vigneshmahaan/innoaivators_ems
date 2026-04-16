import { Card, Badge } from "@/components/ui";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminReportsPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data: leaderboard } = await supabase
    .from("monthly_summary")
    .select("id,month,final_score,total_hours,tasks_completed,attendance_percentage,users(name,employee_id)")
    .order("final_score", { ascending: false })
    .limit(20);

  const winner = leaderboard?.[0];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics & Performance Reports</h1>
      <Card className="border-yellow-600/50 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 text-slate-100">
        <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">🏆</span> Star of the Month
        </h2>
        <p className="text-lg font-bold text-yellow-300">
          {winner ? `${(winner.users as { name?: string })?.name ?? "Top performer"} (Score: ${winner.final_score})` : "No monthly data yet."}
        </p>
      </Card>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Leaderboard</h2>
        <ModernTable>
          <ModernTableHeader>
            <tr>
              <ModernTableCell header>Employee</ModernTableCell>
              <ModernTableCell header>Month</ModernTableCell>
              <ModernTableCell header>Hours</ModernTableCell>
              <ModernTableCell header>Tasks</ModernTableCell>
              <ModernTableCell header>Attendance %</ModernTableCell>
              <ModernTableCell header>Score</ModernTableCell>
            </tr>
          </ModernTableHeader>
          <ModernTableBody>
            {(leaderboard ?? []).map((item, idx) => (
              <ModernTableRow key={item.id} index={idx}>
                <ModernTableCell className="font-semibold">{(item.users as { name?: string })?.name ?? "-"}</ModernTableCell>
                <ModernTableCell>{item.month}</ModernTableCell>
                <ModernTableCell>{item.total_hours}</ModernTableCell>
                <ModernTableCell>
                  <Badge variant="info">{item.tasks_completed}</Badge>
                </ModernTableCell>
                <ModernTableCell>
                  <Badge variant={Number(item.attendance_percentage) >= 80 ? "success" : "warning"}>
                    {item.attendance_percentage}%
                  </Badge>
                </ModernTableCell>
                <ModernTableCell className="font-bold text-blue-400">{item.final_score}</ModernTableCell>
              </ModernTableRow>
            ))}
          </ModernTableBody>
        </ModernTable>
      </div>
    </div>
  );
}
