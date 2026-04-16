"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationProps {
  links: NavLink[];
  showLogout?: boolean;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export function Navigation({
  links,
  showLogout = false,
  onLogout,
  children,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.2,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-700">
      <div className="container-app">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Logo size="md" href="/" />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-slate-300 transition-colors duration-200 hover:text-blue-400"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </motion.div>
            ))}

            {children}

            {showLogout && onLogout && (
              <motion.button
                onClick={onLogout}
                className="rounded-lg border-2 border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-red-500 hover:text-red-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-300 md:hidden hover:bg-slate-700/50"
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 top-16 z-40 w-full bg-slate-900/95 backdrop-blur md:hidden"
            >
              <div className="container-app space-y-4 py-6">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg border border-slate-700 px-4 py-3 text-slate-200 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/10"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {children && (
                  <motion.div
                    custom={links.length}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {children}
                  </motion.div>
                )}

                {showLogout && onLogout && (
                  <motion.button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    custom={links.length + 1}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full rounded-lg border-2 border-red-600/50 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:border-red-500 hover:bg-red-500/10"
                  >
                    Logout
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
