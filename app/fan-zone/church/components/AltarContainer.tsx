"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AltarContainerProps {
  children: ReactNode;
}

export default function AltarContainer({ children }: AltarContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="relative rounded-3xl border border-gold/30 bg-gray-900/40 backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(170,128,24,0.15)]"
    >
      {/* Decorative Corner Borders */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/50 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold/50 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold/50 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/50 rounded-br-3xl" />

      <div className="p-4 md:p-6 text-center">
        {children}
      </div>
    </motion.div>
  );
}
