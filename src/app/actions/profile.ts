"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

export async function updateProfileAction(
  _: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const position = String(formData.get("position") ?? "").trim();

    if (!name) return { error: "Name is required." };

    const { error } = await supabase
      .from("users")
      .update({ name, phone: phone || null, position: position || null })
      .eq("id", user.id);

    if (error) return { error: `Failed to update profile: ${error.message}` };

    revalidatePath("/profile");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update profile." };
  }
}
