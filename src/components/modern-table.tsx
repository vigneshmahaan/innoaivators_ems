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

interface ModernTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  header?: boolean;
}

export function ModernTable({
  children,
  className,
}: ModernTableProps) {
  return (
    <div className={cn("table-wrapper", className)}>
      <table className="table">
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
      "border-b border-[var(--border-subtle)]",
      className
    )} style={{ background: "var(--bg-elevated)" }}>
      {children}
    </thead>
  );
}

export function ModernTableBody({
  children,
  className,
}: ModernTableBodyProps) {
  return (
    <tbody className={cn("divide-y divide-[var(--border-subtle)]", className)}>
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
        "bg-[var(--bg-card)] transition-all duration-200",
        hover && "hover:bg-[var(--bg-card-hover)]",
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
  ...props
}: ModernTableCellProps) {
  if (header) {
    return (
      <th
        className={cn(
          "px-6 py-5 text-left font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px]",
          className
        )}
        {...(props as React.ThHTMLAttributes<HTMLTableCellElement>)}
      >
        {children}
      </th>
    );
  }

  return (
    <td
      className={cn(
        "px-6 py-4 text-[var(--text-secondary)] text-sm",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
