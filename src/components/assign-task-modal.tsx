import { toast } from "sonner";

export function AssignTaskModal({ employeeId, employeeName, isOpen, onClose }: AssignTaskModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await assignTaskAction(undefined, formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(`Task assigned for ${employeeName}`);
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md relative border-blue-500/30 bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ClipboardList className="text-blue-500" />
            Assign Task
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Assigning work to <span className="font-semibold text-blue-400">{employeeName}</span>
          </p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <input type="hidden" name="employee_id" value={employeeId} />
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ClipboardList size={14} className="text-slate-400" />
              Task Title
            </Label>
            <Input 
              name="title" 
              placeholder="e.g., Design System Update" 
              required 
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <AlignLeft size={14} className="text-slate-400" />
              Description (Optional)
            </Label>
            <Textarea 
              name="description" 
              placeholder="What needs to be done?" 
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              Deadline
            </Label>
            <Input 
              type="date" 
              name="deadline" 
              required 
              disabled={loading}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-lg animate-shake">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? "Assigning..." : "Assign Task"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
