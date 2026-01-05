"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { EWCLogo, MSILogo, tournamentLogos } from "@/components/shared/Logos";
import { translations, Language } from "@/lib/i18n/translations";

interface TripleCrownProps {
  language: Language;
}

export function TripleCrown2025Section({ language }: TripleCrownProps) {
  const t = translations[language].achievementsPage.tripleCrown2025;

  return (
    <section className="py-20 relative bg-black/80">
      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          {/* Background Text Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full select-none pointer-events-none opacity-[0.03]">
            <span className="font-heading text-[60px] md:text-[200px] text-gold tracking-widest whitespace-nowrap">TRIPLE CROWN</span>
          </div>

          <h2 className="font-heading text-5xl md:text-7xl text-uppercase text-white tracking-widest leading-none relative z-10">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">2025</span>
            <span className="block text-gold text-2xl md:text-4xl mt-2 tracking-[0.5em] font-light">TRIPLE CROWN</span>
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto font-mono text-sm md:text-base px-4">{t.description}</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          {/* Left: The Team / Trophy Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group "
          >
            <div className="absolute inset-0 bg-gold/20 blur-[100px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-500 shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/GenG_Cup2025.webp"
                  alt="Gen.G Triple Crown 2025"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 backdrop-blur-md border border-gold/40 rounded-full text-gold text-xs font-bold tracking-widest uppercase mb-2">
                    🔥 Best Year In History
                  </div>
                  <h3 className="text-3xl font-heading text-white leading-none">THE GOLDEN ERA</h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: The Trophies List */}
          <div className="space-y-6">
            {[
              { label: "MSI CHAMPIONS", sub: "International", icon: MSILogo, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5" },
              { label: "EWC CHAMPIONS", sub: "Esport World Cup", icon: EWCLogo, color: "text-white", border: "border-white/30", bg: "bg-white/5" },
              { label: "LCK REGULAR", sub: "Domestic Dominance", icon: null, img: tournamentLogos.lck, color: "text-gold", border: "border-gold/30", bg: "bg-gold/5" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center gap-6 p-6 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-sm relative overflow-hidden group`}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-${item.color.replace('text-', '')}/10 to-transparent`} />

                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  {item.icon ? (
                    <item.icon className={`w-12 h-12 ${item.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`} />
                  ) : (
                    <Image src={item.img!} alt={item.label} width={48} height={48} className="object-contain" />
                  )}
                </div>

                <div>
                  <div className={`font-heading text-2xl ${item.color}`}>{item.label}</div>
                  <div className="text-gray-400 text-sm font-mono tracking-wider uppercase">{item.sub}</div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4 text-center sm:text-left"
            >
              <p className="text-gray-500 text-sm italic">{t.summary}</p>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
