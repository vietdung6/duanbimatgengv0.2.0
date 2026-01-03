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
    <section className="py-4 sm:py-6 md:py-8 bg-gradient-to-r from-blue-900/20 via-gold/10 to-blue-900/20 border-y border-gold/20 relative overflow-hidden">
      {/* Animated background shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src={eraLogos["Samsung Galaxy"]}
              alt="Samsung Galaxy"
              className="w-6 h-6 sm:w-8 sm:h-10 object-contain"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            />
            <div className="text-left">
              <div className="text-blue-400 font-bold text-xs sm:text-sm">
                SAMSUNG
              </div>
              <div className="text-gray-400 text-[10px] sm:text-xs">
                2012 - 2017
              </div>
            </div>
          </motion.div>
          <motion.div
            className="text-base sm:text-lg md:text-xl text-gold"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            →
          </motion.div>
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src="/images/logo_teams/KSV_eSportslogo_square.webp"
              alt="KSV eSports"
              className="w-6 h-6 sm:w-8 sm:h-10 object-contain"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            />
            <div className="text-left">
              <div className="text-purple-400 font-bold text-xs sm:text-sm">
                KSV<span className="text-gold">*</span>
              </div>
              <div className="text-gray-400 text-[10px] sm:text-xs">2018</div>
            </div>
          </motion.div>
          <motion.div
            className="text-base sm:text-lg md:text-xl text-gold"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            →
          </motion.div>
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src={eraLogos["Gen.G"]}
              alt="Gen.G"
              className="w-6 h-6 sm:w-8 sm:h-10 object-contain"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            />
            <div className="text-left">
              <div className="text-gold font-bold text-xs sm:text-sm">
                GEN.G
              </div>
              <div className="text-gray-400 text-[10px] sm:text-xs">
                2018 - {t.legacy.genGYearsSuffix}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Legacy Explanation */}
        <motion.div
          className="text-center text-gray-500 text-[10px] sm:text-xs mt-3 sm:mt-4 max-w-2xl mx-auto px-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-1">
            <span>KSV eSports mua lại toàn bộ đội hình LMHT của Samsung Galaxy (tuyển thủ, ban huấn luyện,kế thừa di sản, và ĐƯỢC RIOT CÔNG NHẬN). KSV sau đó đổi tên thành Gen.G vào năm 2018, tên gọi như hiện tại.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

