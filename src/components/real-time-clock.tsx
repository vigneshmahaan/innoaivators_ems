"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export function RealTimeClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Initial time
    setTime(new Date());
    
    // Update every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-5 right-6 z-[60] hidden sm:flex items-center gap-5 px-5 py-2.5 rounded-2xl glass-strong border border-border-strong shadow-2xl"
    >
      {/* Date */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Calendar size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none mb-1">
            {format(time, "EEEE")}
          </span>
          <span className="text-xs font-black text-text-primary leading-none">
            {format(time, "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-[1px] bg-border-default" />

      {/* Time */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <Clock size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none mb-1">
            Current Time
          </span>
          <span className="text-xs font-black text-text-primary leading-none tabular-nums">
            {format(time, "HH:mm:ss")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
