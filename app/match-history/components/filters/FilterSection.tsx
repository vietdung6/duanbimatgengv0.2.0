"use client";

import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface FilterSectionProps {
  label: string;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  badgeCount?: number;
  children: ReactNode;
  showBorder?: boolean;
}

export function FilterSection({
  label,
  icon,
  isOpen,
  onToggle,
  badgeCount,
  children,
  showBorder = true
}: FilterSectionProps) {
  return (
    <div className={`space-y-2 ${showBorder ? 'border-b border-white/5 pb-4' : ''}`}>
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full text-gold/80 hover:text-gold transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <label className="text-[9px] font-heading uppercase tracking-widest cursor-pointer">{label}</label>
          {badgeCount !== undefined && badgeCount > 0 && (
            <span className="bg-gold/10 text-gold text-[8px] px-1.5 py-0.5 rounded-full border border-gold/20">
              {badgeCount}
            </span>
          )}
        </div>
        <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
