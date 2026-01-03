"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Clock } from "lucide-react";

interface PrayInterfaceProps {
  hasPrayedToday: boolean;
  candlesLit: number;
  loading: boolean;
  timeUntilReset: string;
  message: string | null;
  onPray: () => void;
  onReset: () => void;
  streak: number;
}

// Realistic SVG Candle Component
function Candle({ lit, index }: { lit: boolean; index: number }) {
  return (
    <motion.div
      className="relative"
      initial={false}
      animate={lit ? { scale: [1, 1.1, 1], y: [0, -3, 0] } : { scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <svg viewBox="0 0 40 80" className="w-5 h-10 sm:w-6 sm:h-12 md:w-8 md:h-16">
        {/* Candle body */}
        <defs>
          <linearGradient id={`candleBody${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5E6D3" />
            <stop offset="30%" stopColor="#FFF8F0" />
            <stop offset="70%" stopColor="#FFF8F0" />
            <stop offset="100%" stopColor="#E8D5C4" />
          </linearGradient>
          <linearGradient id={`wax${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF8F0" />
            <stop offset="100%" stopColor="#E8D5C4" />
          </linearGradient>
        </defs>

        {/* Candle holder */}
        <rect x="8" y="65" width="24" height="12" rx="2" fill="#8B7355" />
        <rect x="10" y="62" width="20" height="6" rx="1" fill="#A08060" />

        {/* Candle body */}
        <rect x="12" y="25" width="16" height="40" rx="2" fill={`url(#candleBody${index})`} />

        {/* Wax drips */}
        {lit && (
          <>
            <ellipse cx="14" cy="35" rx="3" ry="5" fill={`url(#wax${index})`} opacity="0.8" />
            <ellipse cx="26" cy="40" rx="2" ry="4" fill={`url(#wax${index})`} opacity="0.7" />
          </>
        )}

        {/* Wick */}
        <rect x="18" y="18" width="4" height="10" rx="1" fill={lit ? "#2a2a2a" : "#444"} />

        {/* Flame */}
        {lit && (
          <motion.g
            animate={{ y: [0, -2, 0, -1, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            {/* Outer flame glow */}
            <motion.ellipse
              cx="20" cy="10" rx="8" ry="14"
              fill="url(#flameGlow)"
              opacity="0.4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            {/* Outer flame */}
            <ellipse cx="20" cy="12" rx="5" ry="10" fill="#FF6B00" />
            {/* Middle flame */}
            <ellipse cx="20" cy="13" rx="4" ry="8" fill="#FF9500" />
            {/* Inner flame */}
            <ellipse cx="20" cy="14" rx="2.5" ry="6" fill="#FFCC00" />
            {/* Core */}
            <ellipse cx="20" cy="15" rx="1.5" ry="4" fill="#FFFACD" />
          </motion.g>
        )}

        <defs>
          <radialGradient id="flameGlow">
            <stop offset="0%" stopColor="#FF9500" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>

      {/* Glow effect below lit candle */}
      {lit && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-orange-500/40 blur-md rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// Flame icon for button
function FlameIcon({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      <path
        d="M12 2C12 2 7 8 7 13C7 16.866 9.134 19 12 19C14.866 19 17 16.866 17 13C17 8 12 2 12 2Z"
        fill="#FF9500"
        stroke="#FF6B00"
        strokeWidth="1"
      />
      <path
        d="M12 8C12 8 10 11 10 13.5C10 15.157 10.843 16 12 16C13.157 16 14 15.157 14 13.5C14 11 12 8 12 8Z"
        fill="#FFCC00"
      />
      <ellipse cx="12" cy="13" rx="1.5" ry="2" fill="#FFFACD" />
    </motion.svg>
  );
}

export default function PrayInterface({
  hasPrayedToday,
  candlesLit,
  loading,
  timeUntilReset,
  message,
  onPray,
  onReset,
  streak
}: PrayInterfaceProps) {
  return (
    <div className="max-w-xl mx-auto bg-gradient-to-b from-black/60 via-black/40 to-black/60 
                    rounded-2xl p-5 md:p-6 border border-gold/20 backdrop-blur-md
                    shadow-[0_0_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="flex flex-col items-center">

        {/* Streak Badge */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg"
          >🔥</motion.span>
          <span className="text-orange-200 text-sm font-medium tracking-wide">
            Daily Streak: <span className="text-orange-400 font-bold ml-1">{streak}</span>
          </span>
        </motion.div>

        {/* Status Message */}
        <motion.p
          className="text-amber-100/80 mb-4 text-sm md:text-base leading-relaxed text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {!hasPrayedToday
            ? "🕯️ Thắp nến điểm danh hàng ngày để nhận được sự ban phước và +100 Gen.G Point!"
            : "✨ Bạn đã hoàn thành nghi thức hôm nay. Hãy quay lại vào ngày mai!"}
        </motion.p>

        {/* Candles Container - Altar Style */}
        <div className="relative mb-4">
          {/* Altar base */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-4 
                          bg-gradient-to-b from-amber-900/50 to-transparent rounded-full blur-sm" />

          {/* Candles row */}
          <div className="flex justify-center items-end gap-0.5 sm:gap-1 md:gap-1.5 min-h-[60px] sm:min-h-[80px] px-2">
            {[...Array(10)].map((_, i) => (
              <Candle key={i} lit={i < candlesLit} index={i} />
            ))}
          </div>
        </div>

        {/* Candle count indicator */}
        <div className="text-gold/60 text-xs mb-6 font-mono">
          {candlesLit} / 10 nến đã thắp
        </div>

        {/* Action Button */}
        {!hasPrayedToday ? (
          <motion.button
            onClick={onPray}
            disabled={loading}
            className="group relative px-8 py-3 rounded-xl overflow-hidden
                       disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-gold to-amber-600" />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* Button glow */}
            <div className="absolute inset-0 shadow-[0_0_30px_rgba(212,175,55,0.5)] group-hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] transition-shadow" />

            <span className="relative flex items-center gap-2 text-black font-bold uppercase tracking-widest text-sm">
              {loading ? (
                <>
                  <RotateCcw className="animate-spin" size={18} />
                  Đang Khấn...
                </>
              ) : (
                <>
                  <FlameIcon className="w-5 h-5" />
                  Thắp Nến (+100 PTS)
                </>
              )}
            </span>
          </motion.button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3">
              {candlesLit < 10 ? (
                <motion.button
                  onClick={onPray}
                  className="btn-outline-gold px-4 py-2 text-xs flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FlameIcon className="w-4 h-4" />
                  Thắp thêm nến
                </motion.button>
              ) : (
                <motion.button
                  onClick={onReset}
                  className="btn-outline-gold px-4 py-2 text-xs flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={14} />
                  Cầu may lại
                </motion.button>
              )}
            </div>

            {/* Timer */}
            <motion.div
              className="flex items-center gap-2 text-xs font-mono text-amber-200/60 
                         bg-black/60 px-4 py-2 rounded-full border border-gold/20"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock size={12} />
              <span>Reset sau: <span className="text-gold">{timeUntilReset}</span></span>
            </motion.div>
          </div>
        )}

        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`mt-6 px-5 py-3 rounded-xl text-sm font-medium backdrop-blur-sm ${message.includes("thành công") || message.includes("+100")
                ? "bg-green-500/15 text-green-300 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                : "bg-red-500/15 text-red-300 border border-red-500/30"
                }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
