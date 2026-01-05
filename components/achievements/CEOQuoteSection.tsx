"use client";

import { motion } from "framer-motion";
import { translations, Language } from "@/lib/i18n/translations";

interface CEOQuoteProps {
  language: Language;
}

export function CEOQuoteSection({ language }: CEOQuoteProps) {
  const t = translations[language].achievementsPage.ceoQuote;

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gold/30 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(234,179,8,0.1)] overflow-hidden group">

            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/5 blur-[100px] rounded-full group-hover:bg-gold/10 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-900/10 blur-[80px] rounded-full" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">

              {/* Quote Icon */}
              <div className="text-6xl text-gold/40 font-heading leading-none -mt-4">“</div>

              <div className="flex-1">
                <div className="inline-block px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-bold tracking-widest uppercase mb-6">
                  {t.label}
                </div>

                <blockquote className="text-xl md:text-2xl text-white font-sans leading-relaxed italic mb-8">
                  {t.quote}
                </blockquote>

                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full border border-gold/50 p-0.5">
                    <img src="https://pbs.twimg.com/profile_images/1945733463660732416/fgFk5OCb_400x400.jpg" alt="Arnold Hur" className="w-full h-full rounded-full object-cover" />
                    {/* Placeholder image from Twitter or similar */}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-lg font-heading tracking-wide">ARNOLD HUR</div>
                    <div className="text-gold/80 text-xs uppercase tracking-widest">CEO, Gen.G Esports</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

