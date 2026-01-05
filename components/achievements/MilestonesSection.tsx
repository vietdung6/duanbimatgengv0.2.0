"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MSILogo, WorldsLogo, tournamentLogos } from "@/components/shared/Logos";
import { translations, Language } from "@/lib/i18n/translations";

interface MilestonesSectionProps {
  language: Language;
  milestones: {
    value: string;
    label: string;
    icon: string | ComponentType<{ className?: string }>;
    color: string;
  }[];
}

export function MilestonesSection({ language, milestones }: MilestonesSectionProps) {
  const t = translations[language].achievementsPage;

  return (
    <section className="py-20 relative bg-[#050505]">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://metazones.vn/uploads/images/202406/GenG%20khoe%20cup_01_870x_MetaZones_666eff733cac8.jpg')] bg-cover bg-center grayscale opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <h2 className="font-heading text-4xl md:text-6xl text-white mb-16 text-center tracking-tighter">
          TROPHY <span className="text-transparent bg-clip-text bg-gradient-to-b from-gold to-yellow-900">ROOM</span>
        </h2>

        {/* The Showcase Layout */}
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch h-auto lg:h-[400px]">

          {/* Main Showcase: WORLDS (Left Side - Big) */}
          {milestones.filter(m => m.icon === "worlds").map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 lg:flex-[2] bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-3xl p-8 relative group overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-gold/10 blur-[120px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <WorldsLogo className="w-8 h-8 md:w-12 md:h-12 text-gold animate-pulse-slow" />
                  <span className="text-gray-400 tracking-widest text-xs md:text-sm font-bold border-b border-gray-700 pb-1">WORLD CHAMPIONS</span>
                </div>
                <div className="font-heading text-8xl md:text-[120px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 drop-shadow-2xl">
                  2X
                </div>
                <div className="text-xl md:text-2xl text-gold font-bold uppercase tracking-widest mt-2">{m.label}</div>
                <div className="mt-6 flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400">2014 SSW</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400">2017 SSG</span>
                </div>
              </div>
              {/* 3D Model Placeholder */}
              <div className="absolute -bottom-10 -right-10 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110">
                <WorldsLogo className="w-64 h-64 text-gold/20 rotate-12" />
              </div>
            </motion.div>
          ))}

          {/* Secondary Showcase: LCK & MSI (Right Side - Stacked) */}
          <div className="flex-1 flex flex-col gap-6">
            {/* LCK Box */}
            {milestones.filter(m => m.icon === "lck").map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-row items-center justify-between group hover:border-gold/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-gray-500 font-mono text-xs uppercase">
                    <span className="w-2 h-2 bg-gold rounded-full" /> {t.milestones.lckTitlesLabel}
                  </div>
                  <div className="font-heading text-6xl text-white">{m.value}</div>
                  <div className="text-gold tracking-widest font-bold">{m.label}</div>
                </div>
                <div className="w-24 h-24 relative opacity-50 group-hover:opacity-100 transition-opacity">
                  <Image src={tournamentLogos.lck} alt="LCK" fill className="object-contain grayscale group-hover:grayscale-0" />
                </div>
              </motion.div>
            ))}

            {/* Bottom Row */}
            <div className="flex-1 flex gap-6">
              {/* MSI */}
              {milestones.filter(m => m.icon === "msi").map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center group hover:bg-[#111] transition-colors"
                >
                  <MSILogo className="w-12 h-12 text-white/50 group-hover:text-blue-400 transition-colors mb-2" />
                  <div className="font-heading text-4xl text-white">{m.value}</div>
                  <div className="text-gray-500 text-xs tracking-widest mt-1 uppercase">{m.label}</div>
                </motion.div>
              ))}

              {/* EWC / Others (Last Item) */}
              {milestones.filter(m => typeof m.icon !== 'string').map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center group hover:bg-[#111] transition-colors"
                >
                  <m.icon className="w-12 h-12 text-white/50 group-hover:text-purple-400 transition-colors mb-2" />
                  <div className="font-heading text-4xl text-white">{m.value}</div>
                  <div className="text-gray-500 text-xs tracking-widest mt-1 uppercase">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
