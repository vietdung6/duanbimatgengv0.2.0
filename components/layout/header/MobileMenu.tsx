"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import { useAuth } from "@/lib/auth/AuthContext";
import { NavItem } from "./DesktopNav";
import InstallPWAButton from "./InstallPWAButton";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  onInstallPWA: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  navItems, 
  onInstallPWA 
}: MobileMenuProps) {
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-black-light border-t border-black-charcoal overflow-hidden"
        >
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            
            {/* User Profile Section (Logged In or Loading) */}
            {(user || loading) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <UserMenu mobile onClose={onClose} onInstallPWA={onInstallPWA} />
              </motion.div>
            )}

            {/* Nav Items */}
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 text-white/80 hover:text-gold 
                             transition-colors py-2 border-b border-black-charcoal"
                  >
                    <Icon size={18} className="text-gold" />
                    <span className="font-heading text-lg">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
            
            {/* Guest Only Items */}
            {!loading && !user && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <LanguageSwitcher mobile />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <UserMenu mobile onClose={onClose} />
                </motion.div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/fan-zone/church"
                onClick={onClose}
                className="btn-gold text-center mt-4 block !py-2 text-sm shadow-none"
              >
                ⛩️ {t.nav.enterShrine}
              </Link>
            </motion.div>

            {/* Install App Button */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <button
                  onClick={() => {
                    onInstallPWA();
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 w-full mt-3 py-2 text-sm rounded-lg font-semibold border border-gold/70 bg-black/40 text-white hover:bg-gold/10 transition-all duration-300"
                >
                  <Download size={16} />
                  {t.pwa?.installButton || "Install App"}
                </button>
              </motion.div>
            )}

          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
