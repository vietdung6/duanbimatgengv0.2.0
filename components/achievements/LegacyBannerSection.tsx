"use client";

import { motion } from "framer-motion";
import { eraLogos } from "@/lib/data/eraLogos";
import { translations, Language } from "@/lib/i18n/translations";

interface LegacyBannerProps {
  language: Language;
}

export function LegacyBannerSection({ language }: LegacyBannerProps) {
  const t = translations[language].achievementsPage;

  return (
    <section className="py-10 bg-black border-y border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">

        {/* Legacy Flow */}
        <div className="flex flex-row items-center justify-center gap-2 md:gap-16 overflow-x-auto overflow-y-hidden px-2 no-scrollbar">

          {/* Samsung Era */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="relative w-8 h-8 md:w-12 md:h-12 grayscale group-hover:grayscale-0 transition-all duration-500">
              <motion.img src={eraLogos["Samsung Galaxy"]} alt="Samsung" className="object-contain" />
            </div>
            <div>
              <div className="font-heading text-sm md:text-xl text-blue-500 leading-none mb-0.5 md:mb-1 tracking-wider whitespace-nowrap">SAMSUNG</div>
              <div className="text-[10px] md:text-xs text-gray-500 font-mono hidden md:block">2013 — 2017</div>
            </div>
          </motion.div>

          {/* Connector 1 */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-4 md:w-16 h-[1px] bg-gradient-to-r from-blue-900 to-purple-900 flex-shrink-0"
          />

          {/* KSV Era */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="relative w-8 h-8 md:w-12 md:h-12 grayscale group-hover:grayscale-0 transition-all duration-500">
              <motion.img src="/images/logo_teams/KSV_eSportslogo_square.webp" alt="KSV" className="object-contain" />
            </div>
            <div>
              <div className="font-heading text-sm md:text-xl text-purple-400 leading-none mb-0.5 md:mb-1 tracking-wider flex items-center gap-1 whitespace-nowrap">
                KSV
              </div>
              <div className="text-[10px] text-gray-500 font-mono">Transition</div>
            </div>
          </motion.div>

          {/* Connector 2 */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-4 md:w-16 h-[1px] bg-gradient-to-r from-purple-900 to-gold/50 flex-shrink-0"
          />

          {/* Gen.G Era */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="relative w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <motion.img src={eraLogos["Gen.G"]} alt="Gen.G" className="object-contain" />
            </div>
            <div>
              <div className="font-heading text-base md:text-2xl text-gold leading-none mb-0.5 md:mb-1 tracking-wider">GEN.G</div>
              <div className="text-[10px] text-gold/60 font-mono uppercase tracking-widest hidden md:block">Present</div>
            </div>
          </motion.div>

        </div>

        {/* Explanation Text */}
        {/* Explanation Text Refined */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 max-w-3xl mx-auto relative group"
        >
          <div className="absolute inset-x-10 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          <p className="text-center text-sm md:text-base text-gray-400 font-mono leading-loose px-4 relative bg-black inline-block mx-auto z-10">
            <span className="text-gold text-xl mr-2">❝</span>
            {t.legacy.explanation}
            <span className="text-gold text-xl ml-2">❞</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}

