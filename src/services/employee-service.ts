"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth";
import { logAuditEvent } from "./audit-service";
import type { UserProfile, Department, Designation, Document, EmploymentHistory, OnboardingItem } from "@/lib/types";

export async function getDepartments(): Promise<Department[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*, head:head_id(name)")
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []).map((d: Record<string, unknown>) => ({
    ...d,
    head_name: (d.head as Record<string, string> | null)?.name,
  })) as Department[];
}

export async function getDesignations(departmentId?: string): Promise<Designation[]> {
  const supabase = await createClient();
  let query = supabase
    .from("designations")
    .select("*, department:department_id(name)")
    .eq("status", "active")
    .order("level");

  if (departmentId) {
    query = query.eq("department_id", departmentId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((d: Record<string, unknown>) => ({
    ...d,
    department_name: (d.department as Record<string, string> | null)?.name,
  })) as Designation[];
}

export async function createDepartment(input: {
  name: string;
  code?: string;
  description?: string;
  head_id?: string | null;
}): Promise<Department> {
  const admin = await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error("Failed to create department: " + error.message);

  await logAuditEvent({
    userId: admin.id,
    userName: admin.name,
    action: "create",
    entityType: "department",
    entityId: data.id,
    newData: input as Record<string, unknown>,
  });

  return data as Department;
}

export async function updateDepartment(
  id: string,
  input: Partial<Department>
): Promise<Department> {
  const admin = await requireRole("admin");
  const supabase = await createClient();

  const { data: existing } = await supabase.from("departments").select("*").eq("id", id).maybeSingle();

  const { data, error } = await supabase.from("departments").update(input).eq("id", id).select().single();
  if (error) throw new Error("Failed to update department: " + error.message);

  await logAuditEvent({
    userId: admin.id,
    userName: admin.name,
    action: "update",
    entityType: "department",
    entityId: id,
    oldData: existing as Record<string, unknown>,
    newData: input as Record<string, unknown>,
  });

  return data as Department;
}

export async function createDesignation(input: {
  title: string;
  department_id?: string | null;
  description?: string;
  level?: number;
}): Promise<Designation> {
  const admin = await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("designations")
    .insert({ ...input, level: input.level ?? 1 })
    .select()
    .single();

  if (error) throw new Error("Failed to create designation: " + error.message);

  await logAuditEvent({
    userId: admin.id,
    userName: admin.name,
    action: "create",
    entityType: "designation",
    entityId: data.id,
    newData: input as Record<string, unknown>,
  });

  return data as Designation;
}

export async function getEmployeeDocuments(userId: string): Promise<Document[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*, uploaded_by_user:uploaded_by(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((d: Record<string, unknown>) => ({
    ...d,
    uploaded_by_name: (d.uploaded_by_user as Record<string, string> | null)?.name,
  })) as Document[];
}

export async function addDocument(input: {
  user_id: string;
  name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  category: string;
  description?: string;
}): Promise<Document> {
  const user = await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .insert({
      ...input,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to add document: " + error.message);
  return data as Document;
}

export async function deleteDocument(docId: string) {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase.from("documents").delete().eq("id", docId);
  if (error) throw new Error("Failed to delete document: " + error.message);
}

export async function getEmploymentHistory(userId: string): Promise<EmploymentHistory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employment_history")
    .select("*")
    .eq("user_id", userId)
    .order("effective_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addEmploymentHistory(input: {
  user_id: string;
  event_type: string;
  old_value?: string;
  new_value?: string;
  effective_date: string;
  notes?: string;
}): Promise<EmploymentHistory> {
  const user = await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employment_history")
    .insert({
      ...input,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to add history: " + error.message);
  return data as EmploymentHistory;
}

export async function getOnboardingItems(userId: string): Promise<OnboardingItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("onboarding_items")
    .select("*, assigned_to_user:assigned_to(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((i: Record<string, unknown>) => ({
    ...i,
    assigned_to_name: (i.assigned_to_user as Record<string, string> | null)?.name,
  })) as OnboardingItem[];
}

export async function createOnboardingItem(input: {
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  assigned_to?: string;
  due_date?: string;
}): Promise<OnboardingItem> {
  const user = await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("onboarding_items")
    .insert({
      ...input,
      category: input.category || "general",
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create onboarding item: " + error.message);
  return data as OnboardingItem;
}

export async function completeOnboardingItem(itemId: string) {
  const user = await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("onboarding_items")
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
      completed_by: user.id,
    })
    .eq("id", itemId);

  if (error) throw new Error("Failed to complete item: " + error.message);
}
