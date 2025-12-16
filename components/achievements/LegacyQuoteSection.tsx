"use client";

import { motion } from "framer-motion";
import { translations, Language } from "@/lib/i18n/translations";

interface LegacyQuoteProps {
  language: Language;
}

export function LegacyQuoteSection({ language }: LegacyQuoteProps) {
  const t = translations[language].achievementsPage.legacyQuote;

  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-lg sm:text-xl md:text-2xl text-gray-400 italic max-w-3xl mx-auto px-2"
        >
          {t.quote}
        </motion.blockquote>
        <div className="mt-4 text-gold font-heading">— Gen.G Esports</div>
      </div>
    </section>
  );
}

