"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions";
import { Navigation } from "@/components/navigation";
import {
  LayoutDashboard,
  Clock,
  FileText,
  History,
  KeyRound,
  User,
} from "lucide-react";

const navigationLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/profile", label: "Profile", icon: <User size={18} /> },
  { href: "/attendance", label: "Attendance", icon: <Clock size={18} /> },
  { href: "/daily-log", label: "Daily Log", icon: <FileText size={18} /> },
  { href: "/history", label: "History", icon: <History size={18} /> },
  { href: "/change-password", label: "Security", icon: <KeyRound size={18} /> },
];

export function EmployeeLayoutClient({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation
        links={navigationLinks}
        showLogout={true}
        onLogout={handleLogout}
      >
        <div className="flex items-center gap-3 rounded-lg border border-slate-600 bg-slate-700/30 px-4 py-2 text-sm text-slate-200">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="font-medium">{user.name}</span>
        </div>
      </Navigation>

      <main className="flex-1">
        <div className="container-app py-8 animate-fade-in">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} INNOAIVATORS TECHNOLOGIES. All rights reserved.
      </footer>
    </div>
  );
}
