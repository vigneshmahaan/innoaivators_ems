import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ChevronDown, User, History, KeyRound, LogOut } from "lucide-react";
import { Logo } from "./logo";

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationProps {
  links: NavLink[];
  dropdownLinks?: NavLink[];
  userName?: string;
  userEmail?: string;
  userRole?: string;
  showLogout?: boolean;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export function Navigation({
  links,
  dropdownLinks = [],
  userName,
  userEmail,
  userRole,
  showLogout = false,
  onLogout,
  children,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: "-100%", transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-700/50">
      <div className="container-app">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Logo size="md" href="/" />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  {link.icon && <span className="opacity-70">{link.icon}</span>}
                  <span>{link.label}</span>
                </Link>
              </motion.div>
            ))}

            {children}

            {/* Profile Dropdown */}
            {(userName || dropdownLinks.length > 0) && (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800/40 pl-3 pr-2 py-1.5 transition-all hover:bg-slate-800/80 hover:border-slate-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-200 leading-tight">{userName || "User"}</span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{userRole || "Member"}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
                    {(userName || "U").charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl ring-1 ring-black ring-opacity-5"
                    >
                      <div className="p-2 space-y-1">
                        {dropdownLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                          >
                            <span className="opacity-70">{link.icon}</span>
                            {link.label}
                          </Link>
                        ))}
                        
                        {showLogout && onLogout && (
                          <>
                            <div className="my-1 border-t border-slate-700/50" />
                            <button
                              onClick={() => {
                                onLogout();
                                setIsDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
                            >
                              <LogOut size={16} className="opacity-70" />
                              Logout
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 top-[60px] z-40 w-full bg-slate-950/98 backdrop-blur-xl md:hidden"
            >
              <div className="container-app h-full flex flex-col py-6 overflow-y-auto">
                {/* User Info Mobile */}
                {userName && (
                  <div className="mb-8 flex items-center gap-4 px-4 py-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-white">{userName}</span>
                      <span className="text-sm text-slate-500">{userEmail}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Main Menu</p>
                  {links.map((link, i) => (
                    <motion.div key={link.href} custom={i} variants={linkVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-300 transition-all active:bg-slate-900 hover:bg-slate-900"
                      >
                        <span className="p-2 rounded-lg bg-slate-900 text-blue-400">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 space-y-2">
                  <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Account</p>
                  {dropdownLinks.map((link, i) => (
                    <motion.div key={link.href} custom={links.length + i} variants={linkVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-slate-900"
                      >
                        <span className="p-2 rounded-lg bg-slate-900">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {showLogout && onLogout && (
                  <motion.div 
                    custom={links.length + dropdownLinks.length} 
                    variants={linkVariants}
                    className="mt-auto pt-8 pb-12"
                  >
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500/10 py-4 font-bold text-red-500 transition-all active:scale-95"
                    >
                      <LogOut size={20} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

