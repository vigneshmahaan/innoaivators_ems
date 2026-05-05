import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { HolidaysClient } from "@/components/holidays-client";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";
import type { Holiday } from "@/lib/types";

export const metadata: Metadata = { title: "Holidays — Admin" };

export default async function AdminHolidaysPage() {
  await requireRole("admin");
  const supabase = await createClient();

  const { data: holidays } = await supabase
    .from("holidays")
    .select("*")
    .order("date", { ascending: true });

  return (
    <div className="flex flex-col gap-10 animate-fade-up">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <h1 className="page-title">Holidays</h1>
            <p className="page-subtitle">
              {(holidays?.length ?? 0)} holiday{(holidays?.length ?? 0) !== 1 ? "s" : ""} configured
            </p>
          </div>
        </div>
      </div>

      <HolidaysClient holidays={(holidays ?? []) as Holiday[]} />
    </div>
  );
}
