"use client";

import { motion } from "framer-motion";
import { EWCLogo, MSILogo, tournamentLogos } from "@/components/shared/Logos";
import { translations, Language } from "@/lib/i18n/translations";

interface TripleCrownProps {
  language: Language;
}

export function TripleCrown2025Section({ language }: TripleCrownProps) {
  const t = translations[language].achievementsPage.tripleCrown2025;

  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gold/20 via-black-light to-gold/20 
                      border border-gold/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center relative overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Fire emoji animation */}
          <motion.h2
            className="font-heading text-xl sm:text-2xl md:text-3xl text-gold mb-3 sm:mb-4 relative z-10 px-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              🔥
            </motion.span>
            {" "}
            {t.title}
            {" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className="inline-block"
            >
              🔥
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-gray-400 mb-6 sm:mb-8 relative z-10 text-sm sm:text-base px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t.description}
          </motion.p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto mb-6 sm:mb-8 relative z-10 px-2">
            {/* MSI */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.8, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.15, y: -10, rotateY: 5 }}
              className="bg-black/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 relative overflow-hidden group/item border border-blue-500/20"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover/item:from-blue-500/20 group-hover/item:to-transparent rounded-lg sm:rounded-xl"
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10">
                <motion.div
                  className="flex justify-center mb-2 sm:mb-3"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MSILogo className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </motion.div>
                <div className="text-gold font-heading text-sm sm:text-base md:text-lg">
                  MSI
                </div>
                <div className="text-gold font-heading text-xs sm:text-sm">
                  2025
                </div>
              </div>
            </motion.div>

            {/* EWC */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.15, y: -10, rotateY: 5 }}
              className="bg-black/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 relative overflow-hidden group/item border border-white/20"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/item:from-white/20 group-hover/item:to-transparent rounded-lg sm:rounded-xl"
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10">
                <motion.div
                  className="flex justify-center mb-2 sm:mb-3"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <EWCLogo className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                </motion.div>
                <div className="text-gold font-heading text-sm sm:text-base md:text-lg">
                  EWC
                </div>
                <div className="text-gold font-heading text-xs sm:text-sm">
                  2025
                </div>
              </div>
            </motion.div>

            {/* LCK */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.15, y: -10, rotateY: 5 }}
              className="bg-black/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 relative overflow-hidden group/item border border-gold/20"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover/item:from-gold/20 group-hover/item:to-transparent rounded-lg sm:rounded-xl"
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10">
                <motion.div
                  className="flex justify-center mb-2 sm:mb-3"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <img
                    src={tournamentLogos.lck}
                    alt="LCK"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  />
                </motion.div>
                <div className="text-gold font-heading text-sm sm:text-base md:text-lg">
                  LCK Regular
                </div>
                <div className="text-gold font-heading text-xs sm:text-sm">
                  2025
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="text-gray-400 text-xs sm:text-sm relative z-10 px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {t.summary}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

