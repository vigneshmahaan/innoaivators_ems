import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementsClient } from "@/components/announcements-client";
import { Megaphone } from "lucide-react";
import type { Metadata } from "next";
import type { Announcement, Department } from "@/lib/types";

export const metadata: Metadata = { title: "Announcements — Admin" };

export default async function AdminAnnouncementsPage() {
  await requireRole("admin");
  const supabase = await createClient();

  const [{ data: announcements }, { data: departments }] = await Promise.all([
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("departments")
      .select("id, name")
      .eq("status", "active")
      .order("name"),
  ]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
          >
            <Megaphone size={22} />
          </div>
          <div>
            <h1 className="page-title">Announcements</h1>
            <p className="page-subtitle">
              {(announcements?.length ?? 0)} announcement{(announcements?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <AnnouncementsClient
        announcements={(announcements ?? []) as Announcement[]}
        departments={(departments ?? []) as Department[]}
      />
    </div>
  );
}
