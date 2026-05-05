"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { DollarSign, Settings, Calculator, FileSpreadsheet, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { createSalaryComponent, processPayroll, calculatePayroll } from "@/services/payroll-service";
import { salaryComponentSchema, processPayrollSchema } from "@/lib/schemas";
import type { UserProfile, SalaryComponent } from "@/lib/types";

export function PayrollClient({
  employees,
  components,
}: {
  employees: UserProfile[];
  components: SalaryComponent[];
}) {
  const [activeTab, setActiveTab] = useState<"components" | "process">("components");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [calculation, setCalculation] = useState<{
    base_salary: number;
    gross_salary: number;
    total_deductions: number;
    net_salary: number;
    tax_amount: number;
    pf_amount: number;
    esi_amount: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleCalculate() {
    if (!selectedEmployee || !selectedMonth) {
      toast.error("Please select an employee and month.");
      return;
    }
    startTransition(async () => {
      try {
        const result = await calculatePayroll(selectedEmployee, `${selectedMonth}-01`);
        setCalculation(result);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Calculation failed");
      }
    });
  }

  async function handleProcessPayroll(formData: FormData) {
    startTransition(async () => {
      try {
        const input = {
          user_id: String(formData.get("user_id")),
          month: `${String(formData.get("month"))}-01`,
          base_salary: Number(formData.get("base_salary")),
          bonus: Number(formData.get("bonus") || 0),
          deductions: Number(formData.get("deductions") || 0),
          notes: String(formData.get("notes") || ""),
        };
        const parse = processPayrollSchema.safeParse(input);
        if (!parse.success) {
          toast.error(parse.error.issues[0].message);
          return;
        }
        await processPayroll(parse.data);
        toast.success("Payroll processed successfully!");
        setCalculation(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to process payroll");
      }
    });
  }

  async function handleCreateComponent(formData: FormData) {
    startTransition(async () => {
      try {
        const input = {
          name: String(formData.get("name")),
          type: String(formData.get("type")) as "earning" | "deduction",
          is_fixed: formData.get("is_fixed") === "true",
          percentage_of_basic: Number(formData.get("percentage_of_basic") || 0) || undefined,
          fixed_amount: Number(formData.get("fixed_amount") || 0) || undefined,
          is_taxable: formData.get("is_taxable") === "true",
          is_pf_applicable: formData.get("is_pf_applicable") === "true",
          is_esi_applicable: formData.get("is_esi_applicable") === "true",
          display_order: Number(formData.get("display_order") || 0),
        };
        const parse = salaryComponentSchema.safeParse(input);
        if (!parse.success) {
          toast.error(parse.error.issues[0].message);
          return;
        }
        await createSalaryComponent(parse.data);
        toast.success("Salary component created!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create component");
      }
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("components")}
          className={`btn btn-sm ${activeTab === "components" ? "btn-primary" : "btn-secondary"}`}
        >
          <Settings size={14} />
          Salary Components
        </button>
        <button
          onClick={() => setActiveTab("process")}
          className={`btn btn-sm ${activeTab === "process" ? "btn-primary" : "btn-secondary"}`}
        >
          <Calculator size={14} />
          Process Payroll
        </button>
      </div>

      {activeTab === "components" && (
        <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="card">
            <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Add Salary Component
            </h3>
            <form
              action={handleCreateComponent}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="form-group">
                <label className="label">Name</label>
                <input name="name" required className="input" placeholder="e.g. Basic Salary" />
              </div>
              <div className="form-group">
                <label className="label">Type</label>
                <select name="type" required className="input">
                  <option value="earning">Earning</option>
                  <option value="deduction">Deduction</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Fixed Amount</label>
                <input name="fixed_amount" type="number" className="input" placeholder="0" />
              </div>
              <div className="form-group">
                <label className="label">% of Basic</label>
                <input name="percentage_of_basic" type="number" className="input" placeholder="0" />
              </div>
              <div className="form-group">
                <label className="label">Display Order</label>
                <input name="display_order" type="number" className="input" defaultValue={0} />
              </div>
              <div className="form-group flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <input name="is_taxable" type="checkbox" value="true" />
                  Taxable
                </label>
                <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <input name="is_pf_applicable" type="checkbox" value="true" />
                  PF
                </label>
                <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <input name="is_esi_applicable" type="checkbox" value="true" />
                  ESI
                </label>
              </div>
              <div className="sm:col-span-2 pt-2">
                <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isPending}>
                  {isPending ? <span className="spinner" /> : <DollarSign size={14} />}
                  Add Component
                </button>
              </div>
            </form>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Fixed</th>
                  <th>% of Basic</th>
                  <th>Taxable</th>
                  <th>PF</th>
                  <th>ESI</th>
                </tr>
              </thead>
              <tbody>
                {components.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium">{c.name}</td>
                    <td>
                      <span className={`badge ${c.type === "earning" ? "badge-success" : "badge-danger"}`}>
                        {c.type}
                      </span>
                    </td>
                    <td>{c.is_fixed ? "Yes" : "No"}</td>
                    <td>{c.percentage_of_basic || "—"}</td>
                    <td>{c.is_taxable ? "Yes" : "No"}</td>
                    <td>{c.is_pf_applicable ? "Yes" : "No"}</td>
                    <td>{c.is_esi_applicable ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "process" && (
        <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="card">
            <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Process Payroll
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="form-group">
                <label className="label">Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="input"
                >
                  <option value="">Select employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.employee_id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="input"
                />
              </div>
              <div className="flex items-end">
                <button onClick={handleCalculate} className="btn btn-secondary" disabled={isPending}>
                  <Calculator size={14} />
                  Calculate
                </button>
              </div>
            </div>

            {calculation && (
              <form action={handleProcessPayroll} className="space-y-4">
                <input type="hidden" name="user_id" value={selectedEmployee} />
                <input type="hidden" name="month" value={selectedMonth} />
                <input type="hidden" name="base_salary" value={calculation.base_salary} />
                <input type="hidden" name="deductions" value={calculation.total_deductions} />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="card text-center py-4">
                    <div className="text-xl font-black" style={{ color: "var(--brand)" }}>
                      {calculation.gross_salary.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Gross Salary</div>
                  </div>
                  <div className="card text-center py-4">
                    <div className="text-xl font-black" style={{ color: "var(--danger)" }}>
                      {calculation.tax_amount.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Tax</div>
                  </div>
                  <div className="card text-center py-4">
                    <div className="text-xl font-black" style={{ color: "var(--warning)" }}>
                      {calculation.pf_amount.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>PF</div>
                  </div>
                  <div className="card text-center py-4">
                    <div className="text-xl font-black" style={{ color: "var(--success)" }}>
                      {calculation.net_salary.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Net Salary</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <div>Base Salary: {calculation.base_salary.toLocaleString()}</div>
                  <div>Total Deductions: {calculation.total_deductions.toLocaleString()}</div>
                  <div>ESI: {calculation.esi_amount.toLocaleString()}</div>
                </div>

                <div className="form-group">
                  <label className="label">Bonus</label>
                  <input name="bonus" type="number" defaultValue={0} className="input" />
                </div>
                <div className="form-group">
                  <label className="label">Notes</label>
                  <textarea name="notes" className="input" rows={2} />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary" disabled={isPending}>
                    {isPending ? <span className="spinner" /> : <CheckCircle size={14} />}
                    Process Payroll
                  </button>
                  <a
                    href={`/api/export?type=payroll&month=${selectedMonth}`}
                    className="btn btn-secondary"
                  >
                    <FileSpreadsheet size={14} />
                    Export
                  </a>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
