"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import SearchModal from "./SearchModal";

export default function FloatingSearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Hide floating button in Viewing Party Room (immersive mode)
  const isViewingPartyRoom = pathname?.startsWith('/fan-zone/viewing-party/') && pathname !== '/fan-zone/viewing-party';
  // Also hide on Secret Pages
  const isSecretPage = pathname?.startsWith('/portal-login') || pathname?.startsWith('/faker-secret-fanpage') || pathname?.startsWith('/chovy-cs-hack');

  if (isViewingPartyRoom || isSecretPage) return null;

  return (
    <>
      {/* Floating Search Button - Only visible on mobile */}
      <AnimatePresence>
        {!isSearchOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSearchOpen(true)}
            className="fixed bottom-6 right-6 z-40 lg:hidden
                     w-14 h-14 rounded-full bg-gold text-black
                     shadow-gold-glow-lg flex items-center justify-center
                     hover:bg-gold/90 transition-colors
                     active:scale-95"
            aria-label="Search"
          >
            <Search size={24} className="text-black" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
