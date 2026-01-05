"use client";

import { motion } from "framer-motion";
import { HistoryTour } from "@/components/achievements/HistoryTour";
import { translations, Language } from "@/lib/i18n/translations";

interface AchievementsHeroProps {
  language: Language;
  setExpandedYear: (year: number | null) => void;
  isTourMode: boolean;
  setIsTourMode: (value: boolean) => void;
  currentTourYear: number | null;
  setCurrentTourYear: (year: number | null) => void;
}

export function AchievementsHero({
  language,
  setExpandedYear,
  isTourMode,
  setIsTourMode,
  currentTourYear,
  setCurrentTourYear,
}: AchievementsHeroProps) {
  const heroText = translations[language].achievementsPage.hero;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Cinematic Background with Parallax Scale */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="relative w-full h-full"
        >
          <motion.img
            src="https://admin.esports.gg/wp-content/uploads/2025/07/GENG-won-MSI-2025.jpg"
            alt="Gen.G Champions"
            className="w-full h-full object-cover opacity-60"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </motion.div>
      </div>

      {/* Grain Texture (Noise) */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] animate-noise pointer-events-none"
        style={{ backgroundImage: 'url("/assets/noise.png")' }} />

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-6 flex justify-center items-center gap-4"
          >
            <div className="h-[1px] w-12 bg-gold/50" />
            <span className="text-gold tracking-[0.3em] text-sm md:text-base font-bold uppercase">
              Est. 2013 — Present
            </span>
            <div className="h-[1px] w-12 bg-gold/50" />
          </motion.div>

          {/* Massive Typography */}
          <motion.h1
            className="font-heading text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-none relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 block pb-2">
              Golden
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-gold via-yellow-500 to-yellow-900 block relative bottom-2 sm:bottom-4 drop-shadow-[0_0_35px_rgba(234,179,8,0.4)]">
              Dominance
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {heroText.description}
          </motion.p>

          <HistoryTour
            setExpandedYear={setExpandedYear}
            isTourMode={isTourMode}
            setIsTourMode={setIsTourMode}
            currentTourYear={currentTourYear}
            setCurrentTourYear={setCurrentTourYear}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}

