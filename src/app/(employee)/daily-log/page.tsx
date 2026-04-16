import { submitDailyLogAction } from "@/app/actions";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";

export default function DailyLogPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Daily Work Log</h1>
      <Card>
        <form action={submitDailyLogAction} className="space-y-4">
          <div><label className="mb-1 block text-sm">Task title</label><Input name="task_title" required /></div>
          <div><label className="mb-1 block text-sm">Description</label><Textarea name="description" required /></div>
          <div><label className="mb-1 block text-sm">Status</label><Select name="status"><option>Completed</option><option>In Progress</option></Select></div>
          <div><label className="mb-1 block text-sm">Hours spent</label><Input name="hours_spent" type="number" min="0" step="0.5" required /></div>
          <Button type="submit">Submit Log</Button>
        </form>
      </Card>
    </div>
  );
}
