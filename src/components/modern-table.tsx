"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModernTableProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernTableRowProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  index?: number;
}

interface ModernTableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}

export function ModernTable({
  children,
  className,
}: ModernTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-slate-700 shadow-lg", className)}>
      <table className="w-full table-auto text-sm">
        {children}
      </table>
    </div>
  );
}

export function ModernTableHeader({
  children,
  className,
}: ModernTableHeaderProps) {
  return (
    <thead className={cn(
      "bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-slate-600",
      className
    )}>
      {children}
    </thead>
  );
}

export function ModernTableBody({
  children,
  className,
}: ModernTableBodyProps) {
  return (
    <tbody className={cn("divide-y divide-slate-700", className)}>
      {children}
    </tbody>
  );
}

export function ModernTableRow({
  children,
  className,
  hover = true,
  index = 0,
}: ModernTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "bg-slate-900/50 transition-all duration-200",
        hover && "hover:bg-slate-800/50",
        className
      )}
    >
      {children}
    </motion.tr>
  );
}

export function ModernTableCell({
  children,
  className,
  header = false,
}: ModernTableCellProps) {
  if (header) {
    return (
      <th
        className={cn(
          "px-6 py-4 text-left font-semibold text-slate-100 whitespace-nowrap",
          className
        )}
      >
        {children}
      </th>
    );
  }

  return (
    <td
      className={cn(
        "px-6 py-4 text-slate-300 whitespace-nowrap",
        className
      )}
    >
      {children}
    </td>
  );
}
