"use server";

import { createClient } from "@/lib/supabase/server";
import type { CompanySettings } from "@/lib/types";

export async function getCompanySettings(): Promise<CompanySettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as CompanySettings | null;
}

export async function updateCompanySettings(
  settings: Partial<CompanySettings>
): Promise<CompanySettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_settings")
    .update(settings)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CompanySettings;
}
