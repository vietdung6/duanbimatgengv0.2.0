"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto px-4"
      >
        {/* Genrang Mascot */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <img
            src="/images/Genrang.png"
            alt="Genrang Mascot"
            className="w-48 h-48 mx-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </motion.div>

        {/* Error Message */}
        <h1 className="font-heading text-6xl sm:text-8xl text-gold mb-6">
          404
        </h1>
        <p className="text-gray-300 text-xl mb-4">
          {t.common.notFoundTitle}
        </p>
        <p className="text-gray-400 mb-8">
          {t.common.notFoundSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link href="/" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold inline-flex items-center justify-center gap-2 w-full sm:w-auto
                       text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              {t.common.goHome}
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto
                     border-2 border-gold/80 text-gold font-semibold
                     px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg
                     bg-black/50 backdrop-blur-sm
                     hover:bg-gold/10 hover:border-gold
                     active:bg-gold/20
                     transition-all duration-300
                     shadow-[0_0_15px_rgba(212,175,55,0.2)]
                     hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
                     text-sm sm:text-base
                     touch-manipulation"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            {t.common.goBack}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

