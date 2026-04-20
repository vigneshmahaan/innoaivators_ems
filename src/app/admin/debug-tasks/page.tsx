import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export default async function DebugTasksPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data: tasks, error } = await supabase.from("tasks").select("*, users!employee_id(name)");
  
  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Debug Tasks</h1>
      {error && <pre className="text-red-500">{JSON.stringify(error, null, 2)}</pre>}
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </div>
  );
}
