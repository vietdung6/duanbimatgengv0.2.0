"use client";

import { motion } from "framer-motion";
import { translations, Language } from "@/lib/i18n/translations";

interface CEOQuoteProps {
  language: Language;
}

export function CEOQuoteSection({ language }: CEOQuoteProps) {
  const t = translations[language].achievementsPage.ceoQuote;

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-black-light border-t border-black-charcoal">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-black/50 border border-gold/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
            <div className="text-gold text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t.label}
            </div>
            <blockquote className="text-gray-300 italic mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
              {t.quote}
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                A
              </div>
              <div>
                <div className="text-white font-semibold">Arnold Hur</div>
                <div className="text-gray-500 text-sm">CEO, Gen.G Esports</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

