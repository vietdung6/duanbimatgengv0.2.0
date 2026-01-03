"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Crown, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useMemo } from "react";

interface BlessingModalProps {
  show: boolean;
  onClose: () => void;
  justClaimed: boolean;
}

// Golden confetti particle
function Confetti({ index }: { index: number }) {
  const style = useMemo(() => ({
    left: `${(index * 7) % 100}%`,
    animationDelay: `${(index * 0.1) % 2}s`,
    animationDuration: `${2 + (index % 3)}s`,
  }), [index]);

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        ...style,
        background: index % 3 === 0 ? "#FFD700" : index % 3 === 1 ? "#FFC000" : "#FFE55C",
        top: "-10px",
      }}
      animate={{
        y: [0, 400],
        x: [0, (index % 2 === 0 ? 30 : -30)],
        rotate: [0, 360],
        opacity: [1, 0],
      }}
      transition={{
        duration: 2 + (index % 2),
        delay: index * 0.05,
        ease: "easeOut",
      }}
    />
  );
}

export default function BlessingModal({ show, onClose, justClaimed }: BlessingModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with divine rays */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-lg">
            {/* Central glow burst */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="w-full h-full rounded-full bg-gradient-radial from-gold/40 via-gold/10 to-transparent blur-3xl" />
            </motion.div>

            {/* Light rays */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 h-[150vh] w-8 origin-center"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.15), transparent)",
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.5, scaleY: 1 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
              />
            ))}
          </div>

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <Confetti key={i} index={i} />
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full rounded-3xl p-8 md:p-12 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(30,25,15,0.95) 0%, rgba(20,15,10,0.98) 100%)",
              border: "1px solid rgba(212,175,55,0.3)",
              boxShadow: "0 0 100px rgba(212,175,55,0.3), 0 0 200px rgba(212,175,55,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 
                         border border-white/10 transition-colors group z-50"
            >
              <X size={18} className="text-gray-400 group-hover:text-white" />
            </button>

            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-gold/30 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-gold/30 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-gold/30 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-gold/30 rounded-br-3xl" />

            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                className="relative inline-block"
              >
                <motion.div
                  className="text-7xl md:text-8xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    filter: ["drop-shadow(0 0 20px rgba(212,175,55,0.5))", "drop-shadow(0 0 40px rgba(212,175,55,0.8))", "drop-shadow(0 0 20px rgba(212,175,55,0.5))"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                {/* Sparkle effects around icon */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                >
                  <Sparkles size={20} className="text-gold" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                >
                  <Sparkles size={16} className="text-amber-400" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-heading text-3xl md:text-4xl mb-2
                               bg-gradient-to-b from-yellow-200 via-gold to-amber-500 bg-clip-text text-transparent
                               drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                  DIVINE BLESSING
                </h2>
                <div className="flex items-center justify-center gap-2 text-amber-200/60">
                  <Crown size={14} />
                  <p className="text-xs uppercase tracking-[0.3em]">Received from the High Priest</p>
                  <Crown size={14} />
                </div>
              </motion.div>

              {/* Blessing message */}
              <motion.div
                className="py-6 border-y border-gold/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xl md:text-2xl text-amber-50 font-medium italic leading-relaxed">
                  &quot;{t.shrine.blessingMessage}&quot;
                </p>
              </motion.div>

              {/* Points reward */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-gold font-bold text-lg">
                  {t.shrine.blessingWish}
                </p>

                {justClaimed ? (
                  <motion.div
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full
                               bg-gradient-to-r from-gold/20 via-amber-500/20 to-gold/20
                               border border-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles size={18} className="text-gold" />
                    <span className="text-gold font-bold tracking-wide">+100 GEN.G POINTS</span>
                    <Sparkles size={18} className="text-gold" />
                  </motion.div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-full border border-white/10">
                    <span className="text-gray-300 font-medium text-sm">Hôm nay bạn đã điểm danh rồi</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
