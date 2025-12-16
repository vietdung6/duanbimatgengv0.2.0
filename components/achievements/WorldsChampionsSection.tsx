"use client";

import { motion } from "framer-motion";
import { WorldsLogo } from "@/components/shared/Logos";
import { translations, Language } from "@/lib/i18n/translations";

interface WorldsChampionsProps {
  language: Language;
}

export function WorldsChampionsSection({ language }: WorldsChampionsProps) {
  const t = translations[language].achievementsPage.worldsChampions;

  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-yellow-900/30 via-black-light to-yellow-900/30 
                      border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden group"
        >
          {/* Animated background effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial-gold opacity-10"
            animate={{
              opacity: [0.1, 0.15, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* TODO: random particles here still use Math.random; consider making deterministic later */}

          <div className="relative z-10 text-center">
            {/* Worlds Logo */}
            <motion.div
              className="flex justify-center mb-3 sm:mb-4"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <WorldsLogo className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              </motion.div>
            </motion.div>
            <motion.h2
              className="font-heading text-xl sm:text-2xl md:text-3xl text-yellow-400 mb-4 sm:mb-6 md:mb-8 px-2"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t.title}
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* 2014 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-yellow-500/20 relative overflow-hidden group/item"
              >
                <div className="relative z-10">
                  <motion.div
                    className="flex justify-center mb-2 sm:mb-3 md:mb-4"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <WorldsLogo className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-400 opacity-80" />
                  </motion.div>
                  <motion.div
                    className="font-heading text-2xl sm:text-3xl md:text-4xl text-yellow-400 mb-1 sm:mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    2014
                  </motion.div>
                  <div className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">
                    Samsung White
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    {t.samsungWhiteDescription}
                  </div>
                </div>
              </motion.div>

              {/* 2017 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-yellow-500/20 relative overflow-hidden group/item"
              >
                <div className="relative z-10">
                  <motion.div
                    className="flex justify-center mb-2 sm:mb-3 md:mb-4"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <WorldsLogo className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-400 opacity-80" />
                  </motion.div>
                  <motion.div
                    className="font-heading text-2xl sm:text-3xl md:text-4xl text-yellow-400 mb-1 sm:mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    2017
                  </motion.div>
                  <div className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">
                    Samsung Galaxy
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    {t.samsungGalaxyDescription}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

