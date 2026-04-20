"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    label: string;
    value: number;
    isPositive?: boolean;
  };
  description?: string;
  color?: "blue" | "purple" | "green" | "orange" | "red";
  index?: number;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  description,
  color = "blue",
  index = 0,
}: StatCardProps) {
  const colorVariants = {
    blue: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    purple: "border-purple-500/30 bg-purple-500/5 text-purple-400",
    green: "border-green-500/30 bg-green-500/5 text-green-400",
    orange: "border-orange-500/30 bg-orange-500/5 text-orange-400",
    red: "border-red-500/30 bg-red-500/5 text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Card className={`border ${colorVariants[color]} backdrop-blur-sm overflow-hidden relative shadow-lg shadow-black/20`}>
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
              <p className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</p>
              {description && (
                <p className="mt-1 text-xs text-slate-500 font-medium">{description}</p>
              )}
              {trend && (
                <div
                  className={`mt-3 flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full w-fit ${
                    trend.isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  }`}
                >
                  <span>{trend.isPositive ? "↑" : "↓"}</span>
                  <span>{trend.value}% {trend.label}</span>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 shadow-inner">
              {icon}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
