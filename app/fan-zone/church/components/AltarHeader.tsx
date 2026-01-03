"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";
import Image from "next/image";

const choviImage = "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212535327_chovu.png";

// Custom Shrine/Temple Icon SVG
function ShrineIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" fill="none">
      {/* Torii gate structure */}
      <motion.path
        d="M8 20h48M12 20v30M52 20v30M6 18h52M10 14h44"
        stroke="url(#shrineGold)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      {/* Top curved beam */}
      <motion.path
        d="M4 12 Q32 4 60 12"
        stroke="url(#shrineGold)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      {/* Decorative elements */}
      <motion.circle cx="32" cy="8" r="3" fill="#D4AF37"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <defs>
        <linearGradient id="shrineGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AltarHeader() {
  return (
    <>
      {/* Shrine Icon with glow */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          filter: [
            "drop-shadow(0 0 15px rgba(212,175,55,0.4))",
            "drop-shadow(0 0 35px rgba(212,175,55,0.7))",
            "drop-shadow(0 0 15px rgba(212,175,55,0.4))"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-4 inline-block"
      >
        <ShrineIcon />
      </motion.div>

      {/* Title Section with cathedral typography */}
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          {/* Decorative cross above title */}
          <motion.div
            className="text-gold text-2xl mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✟
          </motion.div>

          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 tracking-[0.15em]
                         text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-gold to-amber-600
                         drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            CHURCH OF CHOVY
          </h1>

          {/* Subtitle with decorative lines */}
          <div className="flex items-center justify-center gap-4">
            <motion.div
              className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
              animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <p className="text-amber-200/70 font-medium uppercase tracking-[0.3em] text-xs md:text-sm flex items-center gap-2">
              <Sparkles size={14} className="text-gold" />
              Daily Worship & Blessings
              <Sparkles size={14} className="text-gold" />
            </p>
            <motion.div
              className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
              animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Chovy Avatar Section with Aureole */}
      <div className="relative mb-4 group flex justify-center">
        {/* Outer aureole glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-gold/30 via-gold/10 to-transparent blur-2xl" />
        </motion.div>

        <div className="relative flex flex-col items-center gap-4">
          {/* Multiple rotating aureole rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 sm:-inset-5 rounded-full border border-gold/20 opacity-60"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-7 sm:-inset-8 rounded-full border border-dashed border-gold/15 opacity-40"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 sm:-inset-12 rounded-full opacity-30"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.3), transparent, rgba(212,175,55,0.3), transparent)"
            }}
          />

          {/* Main avatar container */}
          <motion.div
            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-0.5 sm:p-1"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #D4AF37 25%, #B8860B 50%, #D4AF37 75%, #FFD700 100%)",
              boxShadow: "0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.3), inset 0 0 20px rgba(255,255,255,0.1)"
            }}
            animate={{
              boxShadow: [
                "0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.3)",
                "0 0 60px rgba(212,175,55,0.7), 0 0 120px rgba(212,175,55,0.4)",
                "0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.3)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 sm:border-4 border-black/80 bg-gradient-to-b from-gray-900 to-black">
              <img
                src={choviImage}
                alt="Chovy - High Priest"
                className="object-cover hover:scale-110 transition-transform duration-700 w-full h-full"
              />

              {/* Divine light overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gold/0 to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          {/* Rank Badge - Below avatar */}
          <motion.div
            className="bg-gradient-to-r from-black via-gray-900 to-black 
                       border border-gold/50 px-3 sm:px-4 py-1 rounded-full shadow-xl flex items-center justify-center gap-1.5 whitespace-nowrap"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Crown size={12} className="text-gold fill-gold sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-yellow-200 via-gold to-yellow-200 
                           bg-clip-text text-transparent uppercase tracking-widest">
              High Priest
            </span>
            <Crown size={12} className="text-gold fill-gold sm:w-4 sm:h-4" />
          </motion.div>
        </div>
      </div>
    </>
  );
}
