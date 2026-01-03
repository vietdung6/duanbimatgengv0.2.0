"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LogIn, User, Download, ChevronDown, LayoutDashboard, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import UserAvatar from "@/components/shared/UserAvatar";
import { useProgress } from "@bprogress/next";

interface UserMenuProps {
  mobile?: boolean;
  onClose?: () => void;
  onInstallPWA?: () => void;
}

export default function UserMenu({ mobile = false, onClose, onInstallPWA }: UserMenuProps) {
  const { user, logout, loading } = useAuth();
  const { start } = useProgress();
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    start(); // Show progress bar on logout
    logout();
    if (onClose) onClose();
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
    setIsOpen(false);
  };

  const handleInstallClick = () => {
    if (onInstallPWA) onInstallPWA();
    if (onClose) onClose();
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "vi" : "en");
    if (onClose) onClose();
  };

  if (loading) {
    if (mobile) {
      return (
        <div className="flex items-center gap-3 py-2 border-b border-black-charcoal w-full animate-pulse">
          <div className="w-5 h-5 bg-white/10 rounded-full" />
          <div className="h-5 w-24 bg-white/10 rounded" />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg border border-transparent animate-pulse">
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/5" />
        <div className="hidden sm:flex flex-col gap-1">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-2 w-12 bg-white/10 rounded" />
        </div>
        <div className="w-3.5 h-3.5 bg-white/10 rounded" />
      </div>
    );
  }

  if (mobile) {
    if (user) {
      return (
        <div className="flex flex-col w-full bg-black-charcoal/30 rounded-lg p-3">
          {/* Profile Header - Click to toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                src={user.avatarUrl}
                alt="Avatar"
                size={36}
                className="rounded-full border border-gold/30"
              />
              <div className="flex flex-col items-start">
                <span className="font-heading text-base text-white">{user.displayName || user.username}</span>
                <span className="text-[10px] text-gold uppercase tracking-wider">{user.role || 'Member'}</span>
              </div>
            </div>
            <ChevronDown
              size={16}
              className={`text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Collapsible Menu Items */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-1 pt-3 mt-3 border-t border-white/10">
                  <Link
                    href="/me"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 text-white/70 hover:text-gold 
                              transition-colors py-2 px-1 text-sm"
                  >
                    <User size={16} className="text-gold" />
                    <span>{t.nav?.profile || "Profile"}</span>
                  </Link>

                  {(user.role === 'admin' || user.role === 'staff') && (
                    <Link
                      href="/staff"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 text-white/70 hover:text-gold 
                                transition-colors py-2 px-1 text-sm"
                    >
                      <LayoutDashboard size={16} className="text-gold" />
                      <span>Staff Dashboard</span>
                    </Link>
                  )}

                  {/* Language Switcher */}
                  <div className="flex items-center gap-3 py-2 px-1 w-full text-sm">
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-gold" />
                      <span className="text-white/70">{t.common.language}</span>
                    </div>
                    <div className="flex items-center bg-black-charcoal/50 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={(e) => { e.stopPropagation(); setLanguage('vi'); }}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${language === 'vi'
                            ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                            : 'text-gray-400 hover:text-white'
                          }`}
                      >
                        VN
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${language === 'en'
                            ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                            : 'text-gray-400 hover:text-white'
                          }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  {/* Install PWA */}
                  {onInstallPWA && (
                    <button
                      onClick={handleInstallClick}
                      className="flex items-center gap-3 text-white/70 hover:text-gold 
                               transition-colors py-2 px-1 w-full text-sm"
                    >
                      <Download size={16} className="text-gold" />
                      <span>{t.pwa?.installButton || "Install App"}</span>
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-400 hover:text-red-300 
                             transition-colors py-2 px-1 w-full text-sm"
                  >
                    <LogOut size={16} />
                    <span>{t.auth?.logout || "Logout"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }
    return (
      <Link
        href={`/login?from=${encodeURIComponent(pathname)}`}
        onClick={handleLinkClick}
        className="flex items-center gap-3 text-white/80 hover:text-gold 
                 transition-colors py-2 border-b border-black-charcoal w-full"
      >
        <LogIn size={20} className="text-gold" />
        <span className="font-heading text-lg">
          {t.auth?.login || "Login"}
        </span>
      </Link>
    );
  }

  // Desktop
  if (user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-300 border
            ${isOpen ? 'bg-white/10 border-gold/50' : 'hover:bg-white/5 border-transparent'}`}
        >
          <UserAvatar
            src={user.avatarUrl}
            alt="Avatar"
            fallback={(user.displayName || user.username)?.charAt(0).toUpperCase() || "?"}
            size={32}
            className="rounded-full border border-gold/30"
          />
          <div className="flex flex-col items-start hidden sm:flex">
            <span className="text-sm font-bold text-gray-200 max-w-[120px] truncate leading-none">
              {user.displayName || user.username}
            </span>
            <span className="text-[10px] text-gold uppercase tracking-wider leading-none mt-1">
              {user.role || 'Member'}
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-56 bg-black-light border border-gold/20 
                       rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 backdrop-blur-xl"
            >
              <div className="p-2 space-y-1">
                <Link
                  href="/me"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 
                           hover:bg-white/10 hover:text-white transition-colors group"
                >
                  <User size={16} className="text-gold group-hover:scale-110 transition-transform" />
                  {t.nav?.profile || "Profile"}
                </Link>

                {user.role === 'admin' || user.role === 'staff' ? (
                  <Link
                    href="/staff"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 
                            hover:bg-white/10 hover:text-white transition-colors group"
                  >
                    <LayoutDashboard size={16} className="text-gold group-hover:scale-110 transition-transform" />
                    Staff Dashboard
                  </Link>
                ) : null}

                {/* Language Switcher */}
                <div className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors group cursor-default">
                  <Globe size={16} className="text-gold group-hover:scale-110 transition-transform" />
                  <div className="flex items-center gap-3">
                    <span>{t.common.language}</span>
                    <div className="flex items-center bg-black-charcoal/50 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={(e) => { e.stopPropagation(); setLanguage('vi'); }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all min-w-[28px] ${language === 'vi'
                            ? 'bg-gold text-black shadow-gold-glow'
                            : 'text-gray-500 hover:text-gray-300'
                          }`}
                      >
                        VN
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all min-w-[28px] ${language === 'en'
                            ? 'bg-gold text-black shadow-gold-glow'
                            : 'text-gray-500 hover:text-gray-300'
                          }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>

                {onInstallPWA && (
                  <button
                    onClick={handleInstallClick}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 
                             hover:bg-white/10 hover:text-white transition-colors group"
                  >
                    <Download size={16} className="text-gold group-hover:scale-110 transition-transform" />
                    {t.pwa?.installButton || "Install App"}
                  </button>
                )}

                <div className="h-px bg-white/10 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 
                           hover:bg-red-500/10 hover:text-red-300 transition-colors group"
                >
                  <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                  {t.auth?.logout || "Logout"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {onInstallPWA && (
        <button
          onClick={onInstallPWA}
          className="p-2 rounded-lg text-gray-400 hover:text-gold hover:bg-white/5 transition-colors"
          title={t.pwa?.installButton || "Install App"}
        >
          <Download size={20} />
        </button>
      )}
      <Link
        href={`/login?from=${encodeURIComponent(pathname)}`}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 
                 hover:bg-gold/20 hover:border-gold/50 transition-all duration-300 group"
      >
        <LogIn size={16} className="text-gold group-hover:translate-x-0.5 transition-transform" />
        <span className="text-sm font-bold text-gold">{t.auth?.login || "Login"}</span>
      </Link>
    </div>
  );
}
