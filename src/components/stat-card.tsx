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
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/50 text-purple-400",
    green: "from-green-500/20 to-green-600/20 border-green-500/50 text-green-400",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/50 text-orange-400",
    red: "from-red-500/20 to-red-600/20 border-red-500/50 text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`border bg-gradient-to-br ${colorVariants[color]} overflow-hidden relative`}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
        </div>
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-400">{title}</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">{value}</p>
              {description && (
                <p className="mt-1 text-xs text-slate-500">{description}</p>
              )}
              {trend && (
                <div
                  className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                    trend.isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <span>{trend.isPositive ? "↑" : "↓"}</span>
                  <span>{trend.value}% {trend.label}</span>
                </div>
              )}
            </div>
            <motion.div
              className="rounded-lg bg-slate-800/50 p-3"
              whileHover={{ scale: 1.1 }}
            >
              {icon}
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
