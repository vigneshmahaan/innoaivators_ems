"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, ClipboardList, Calendar,
  FileText, Bell, LogOut, Menu, X, ChevronRight,
  UserCircle, Clock, BarChart3, DollarSign, Building2,
  Settings, Key, Megaphone, Shield, Flag, Award, FileUp
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import type { UserProfile, Notification } from "@/lib/types";

interface SidebarProps {
  user: UserProfile;
  notifications?: Notification[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

function getEmployeeNav(unread: number): NavSection[] {
  return [
    {
      label: "Workspace",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { label: "Attendance", href: "/attendance", icon: <Clock size={18} /> },
        { label: "Daily Log", href: "/daily-log", icon: <FileText size={18} /> },
        {
          label: "My Tasks",
          href: "/tasks",
          icon: <ClipboardList size={18} />,
        },
        { label: "Leave Requests", href: "/leave", icon: <Calendar size={18} /> },
      ],
    },
    {
      label: "History",
      items: [
        { label: "Work History", href: "/history", icon: <BarChart3 size={18} /> },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "My Profile", href: "/profile", icon: <UserCircle size={18} /> },
        { label: "Change Password", href: "/change-password", icon: <Key size={18} /> },
      ],
    },
  ];
}

function getAdminNav(pending: { leaves: number; tasks: number }): NavSection[] {
  return [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Employees", href: "/admin/employees", icon: <Users size={18} /> },
        {
          label: "Tasks",
          href: "/admin/tasks",
          icon: <ClipboardList size={18} />,
          badge: pending.tasks > 0 ? pending.tasks : undefined,
        },
        {
          label: "Leave Requests",
          href: "/admin/leaves",
          icon: <Calendar size={18} />,
          badge: pending.leaves > 0 ? pending.leaves : undefined,
        },
        { label: "Attendance", href: "/admin/attendance", icon: <Clock size={18} /> },
        { label: "Documents", href: "/admin/documents", icon: <FileUp size={18} /> },
        { label: "Payroll", href: "/admin/payroll", icon: <DollarSign size={18} /> },
      ],
    },
    {
      label: "Organization",
      items: [
        { label: "Departments", href: "/admin/departments", icon: <Building2 size={18} /> },
        { label: "Designations", href: "/admin/designations", icon: <Award size={18} /> },
        { label: "Holidays", href: "/admin/holidays", icon: <Flag size={18} /> },
        { label: "Announcements", href: "/admin/announcements", icon: <Megaphone size={18} /> },
      ],
    },
    {
      label: "Analytics",
      items: [
        { label: "Reports", href: "/admin/reports", icon: <BarChart3 size={18} /> },
        { label: "Audit Logs", href: "/admin/audit-logs", icon: <Shield size={18} /> },
      ],
    },
    {
      label: "Configuration",
      items: [
        { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
      ],
    },
  ];
}

export function Sidebar({
  user,
  notifications = [],
  pendingLeaves = 0,
  pendingTasks = 0,
}: SidebarProps & { pendingLeaves?: number; pendingTasks?: number }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.is_read).length;

  const isAdmin = user.role === "admin";
  const sections = isAdmin
    ? getAdminNav({ leaves: pendingLeaves, tasks: pendingTasks })
    : getEmployeeNav(unread);

  // Close on route change (mobile)
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo / Branding */}
      <div className="sidebar-header">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-black text-sm"
            style={{ background: "var(--brand)", boxShadow: "0 4px 12px var(--brand-glow)" }}
          >
            EMS
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">INNOAIVATORS</div>
            <div
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {isAdmin ? "Admin Portal" : "Employee Portal"}
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map((section, si) => (
          <div key={si} className="mb-2">
            {section.label && (
              <p className="nav-label">{section.label}</p>
            )}
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="nav-badge">{item.badge}</span>
                  ) : null}
                  {isActive && !item.badge && (
                    <ChevronRight size={14} style={{ color: "var(--brand)", opacity: 0.6 }} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: User Info + Logout */}
      <div className="sidebar-footer">
        <div
          className="mb-3 flex items-center gap-3 rounded-xl p-2.5"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "var(--brand)" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {user.name}
            </div>
            <div className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
              {user.employee_id} · {user.role}
            </div>
          </div>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="nav-item w-full text-left" style={{ color: "var(--danger)" }}>
            <LogOut size={17} className="nav-icon" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden md:flex">{sidebarContent}</aside>

      {/* Mobile Toggle Button */}
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="sidebar-overlay visible"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              className="sidebar open"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
