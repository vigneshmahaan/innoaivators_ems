"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
}

export function Logo({ size = "md", showText = true, href = "/" }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-lg" },
    md: { icon: 28, text: "text-2xl" },
    lg: { icon: 36, text: "text-4xl" },
  };

  const content = (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="rounded-xl bg-blue-600 p-2 shadow-lg shadow-blue-500/20"
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Briefcase size={sizes[size].icon} className="text-white" />
      </motion.div>
      {showText && (
        <div className="flex flex-col">
          <motion.h1
            className={`${sizes[size].text} font-bold text-white tracking-tight`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            INNOAIVATORS
          </motion.h1>
          <motion.p
            className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] -mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            TECHNOLOGIES
          </motion.p>
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

export function LogoMini() {
  return (
    <motion.div
      className="rounded-lg bg-blue-600 p-2 shadow-lg shadow-blue-500/20"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Briefcase size={20} className="text-white" />
    </motion.div>
  );
}

