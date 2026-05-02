"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logAuditEvent } from "./audit-service";
import type { SalaryComponent, EmployeeSalaryStructure, SalaryRecord } from "@/lib/types";

export async function getSalaryComponents(): Promise<SalaryComponent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("salary_components")
    .select("*")
    .eq("status", "active")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createSalaryComponent(input: {
  name: string;
  type: "earning" | "deduction";
  is_fixed: boolean;
  percentage_of_basic?: number;
  fixed_amount?: number;
  is_taxable: boolean;
  is_pf_applicable: boolean;
  is_esi_applicable: boolean;
  display_order: number;
}): Promise<SalaryComponent> {
  const admin = await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("salary_components")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error("Failed to create component: " + error.message);

  await logAuditEvent({
    userId: admin.id,
    userName: admin.name,
    action: "create",
    entityType: "salary_component",
    entityId: data.id,
    newData: input as Record<string, unknown>,
  });

  return data as SalaryComponent;
}

export async function getEmployeeSalaryStructure(userId: string): Promise<EmployeeSalaryStructure[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employee_salary_structures")
    .select("*, component:component_id(name, type)")
    .eq("user_id", userId)
    .is("effective_to", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((s: Record<string, unknown>) => ({
    ...s,
    component_name: (s.component as Record<string, string> | null)?.name,
    component_type: (s.component as Record<string, string> | null)?.type,
  })) as EmployeeSalaryStructure[];
}

export async function setEmployeeSalaryStructure(
  userId: string,
  structures: { component_id: string; amount: number }[]
) {
  const admin = await requireRole("admin");
  const supabase = await createClient();

  // Close existing structures
  await supabase
    .from("employee_salary_structures")
    .update({ effective_to: new Date().toISOString() })
    .eq("user_id", userId)
    .is("effective_to", null);

  // Insert new structures
  const { error } = await supabase.from("employee_salary_structures").insert(
    structures.map((s) => ({
      user_id: userId,
      component_id: s.component_id,
      amount: s.amount,
      effective_from: new Date().toISOString(),
    }))
  );

  if (error) throw new Error("Failed to set salary structure: " + error.message);

  await logAuditEvent({
    userId: admin.id,
    userName: admin.name,
    action: "update",
    entityType: "employee_salary_structure",
    entityId: userId,
    newData: { structures },
  });
}

export async function calculatePayroll(userId: string, month: string): Promise<{
  base_salary: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  tax_amount: number;
  pf_amount: number;
  esi_amount: number;
}> {
  const supabase = await createClient();

  const { data: structures } = await supabase
    .from("employee_salary_structures")
    .select("*, component:component_id(*)")
    .eq("user_id", userId)
    .is("effective_to", null);

  if (!structures || structures.length === 0) {
    throw new Error("No salary structure found for employee.");
  }

  let baseSalary = 0;
  let grossSalary = 0;
  let totalDeductions = 0;
  let taxAmount = 0;
  let pfAmount = 0;
  let esiAmount = 0;

  for (const s of structures) {
    const comp = (s.component as SalaryComponent) || {};
    const amount = Number(s.amount) || 0;

    if (comp.type === "earning") {
      grossSalary += amount;
      if (comp.name.toLowerCase().includes("basic")) {
        baseSalary = amount;
      }
    } else if (comp.type === "deduction") {
      totalDeductions += amount;
    }
  }

  // Calculate PF (12% of basic)
  pfAmount = Math.round(baseSalary * 0.12 * 100) / 100;

  // Calculate ESI (0.75% of gross if gross <= 21000)
  if (grossSalary <= 21000) {
    esiAmount = Math.round(grossSalary * 0.0075 * 100) / 100;
  }

  // Simple tax calculation (simplified Indian tax slab for demo)
  const annualGross = grossSalary * 12;
  if (annualGross <= 300000) {
    taxAmount = 0;
  } else if (annualGross <= 600000) {
    taxAmount = ((annualGross - 300000) * 0.05) / 12;
  } else if (annualGross <= 900000) {
    taxAmount = (300000 * 0.05 + (annualGross - 600000) * 0.1) / 12;
  } else if (annualGross <= 1200000) {
    taxAmount = (300000 * 0.05 + 300000 * 0.1 + (annualGross - 900000) * 0.15) / 12;
  } else {
    taxAmount = (300000 * 0.05 + 300000 * 0.1 + 300000 * 0.15 + (annualGross - 1200000) * 0.2) / 12;
  }

  taxAmount = Math.round(taxAmount * 100) / 100;
  totalDeductions += pfAmount + esiAmount + taxAmount;
  const netSalary = Math.max(0, Math.round((grossSalary - totalDeductions) * 100) / 100);

  return {
    base_salary: baseSalary,
    gross_salary: grossSalary,
    total_deductions: totalDeductions,
    net_salary: netSalary,
    tax_amount: taxAmount,
    pf_amount: pfAmount,
    esi_amount: esiAmount,
  };
}

export async function processPayroll(input: {
  user_id: string;
  month: string;
  base_salary: number;
  bonus?: number;
  deductions?: number;
  notes?: string;
}): Promise<SalaryRecord> {
  const admin = await requireRole("admin");
  const supabase = await createClient();

  const calc = await calculatePayroll(input.user_id, input.month);

  const { data, error } = await supabase
    .from("salary_records")
    .insert({
      user_id: input.user_id,
      month: input.month,
      base_salary: input.base_salary,
      bonus: input.bonus || 0,
      deductions: input.deductions || 0,
      gross_salary: calc.gross_salary,
      tax_amount: calc.tax_amount,
      pf_amount: calc.pf_amount,
      esi_amount: calc.esi_amount,
      other_deductions: input.deductions || 0,
      net_salary: calc.net_salary,
      status: "Pending",
      notes: input.notes,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to process payroll: " + error.message);

  await logAuditEvent({
    userId: admin.id,
    userName: admin.name,
    action: "create",
    entityType: "salary_record",
    entityId: data.id,
    newData: input as Record<string, unknown>,
  });

  return data as SalaryRecord;
}

export async function updatePayrollStatus(
  recordId: string,
  status: "Pending" | "Paid"
): Promise<SalaryRecord> {
  const admin = await requireRole("admin");
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { status };
  if (status === "Paid") {
    updateData.paid_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("salary_records")
    .update(updateData)
    .eq("id", recordId)
    .select()
    .single();

  if (error) throw new Error("Failed to update payroll: " + error.message);

  await logAuditEvent({
    userId: admin.id,
    userName: admin.name,
    action: status === "Paid" ? "approve" : "update",
    entityType: "salary_record",
    entityId: recordId,
    newData: { status },
  });

  return data as SalaryRecord;
}
