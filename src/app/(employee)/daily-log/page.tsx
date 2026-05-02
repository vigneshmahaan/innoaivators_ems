import { DailyLogForm } from "@/components/daily-log-form";

export default function DailyLogPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Daily Work Log</h1>
      <DailyLogForm />
    </div>
  );
}
