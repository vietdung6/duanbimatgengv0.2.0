"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { WorldsLogo } from "@/components/shared/Logos";
import { translations, Language } from "@/lib/i18n/translations";

interface WorldsChampionsProps {
  language: Language;
}

export function WorldsChampionsSection({ language }: WorldsChampionsProps) {
  const t = translations[language].achievementsPage.worldsChampions;
  const [embers, setEmbers] = React.useState<Array<{ x: number; duration: number; delay: number }>>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setEmbers(
      [...Array(15)].map(() => ({
        x: Math.random() * 1600 - 800,
        duration: 8 + Math.random() * 7,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  if (!mounted) return null; // Or render a simplified version to avoid hydration mismatch

  return (
    <section className="py-20 relative bg-black overflow-hidden">
      {/* Background Elements */}
      {/* Dynamic Background Elements: THE GOLDEN ECLIPSE (GOD TIER) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#020202]" />

        {/* 1. Starfield Background (Subtle) */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* 2. Solar Flare Core (Intense) */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-amber-600/20 blur-[120px] rounded-[100%] opacity-80 mix-blend-screen" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gold/30 blur-[80px] rounded-[100%] mix-blend-screen" />

        {/* 3. Rotating God Rays */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] opacity-30 pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(234, 179, 8, 0.1) 15deg, transparent 30deg, transparent 50deg, rgba(234, 179, 8, 0.15) 70deg, transparent 90deg)'
          }}
        />

        {/* 4. Magic Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-350px] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] border-[1px] border-gold/20 rounded-full border-dashed opacity-40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] border-[1px] border-amber-500/10 rounded-full opacity-50"
        />

        {/* 5. Embers */}
        {embers.map((ember, i) => (
          <motion.div
            key={i}
            initial={{ y: 800, x: ember.x, opacity: 0, scale: 0 }}
            animate={{ y: -400, opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
            transition={{
              duration: ember.duration,
              repeat: Infinity,
              delay: ember.delay,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gradient-to-t from-gold to-amber-600 rounded-full blur-[1px] shadow-[0_0_10px_#EAB308]"
          />
        ))}

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-25 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <WorldsLogo className="w-12 h-12 md:w-16 md:h-16 text-gold mx-auto mb-4 md:mb-6 animate-pulse-slow drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />
          <h2 className="font-heading text-4xl md:text-7xl text-uppercase text-white tracking-widest leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">{t.mainTitleLine1}</span>
            <span className="block text-gold text-xl md:text-4xl mt-2 tracking-[0.3em] md:tracking-[0.5em] font-light">{t.mainTitleLine2}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 2014 SSW */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="group relative h-[450px] rounded-3xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-500"
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://genk.mediacdn.vn/2019/12/15/ssw-15764110208811551726480.jpg')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end justify-between border-b border-white/20 pb-4 mb-4">
                <div>
                  <div className="text-6xl font-heading text-white leading-none">2014</div>
                  <div className="text-white/60 font-mono tracking-widest text-sm uppercase mt-2">{t.era2014}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-heading text-white">SSW</div>
                  <div className="text-gold text-xs uppercase font-bold tracking-widest">{t.tag2014}</div>
                </div>
              </div>

              {/* Roster */}
              <div className="flex flex-wrap gap-2 text-sm text-gray-300 font-mono">
                <span>Looper</span> <span className="text-gold">•</span>
                <span>DanDy</span> <span className="text-gold">•</span>
                <span>PawN</span> <span className="text-gold">•</span>
                <span>imp</span> <span className="text-gold">•</span>
                <span className="text-white font-bold text-gold drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">Mata (MVP)</span>
              </div>
            </div>
          </motion.div>

          {/* 2017 SSG */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="group relative h-[450px] rounded-3xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-500"
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://genk.mediacdn.vn/zoom/700_438/2017/4601ef0100000578-5049659-image-a-1021509811710585-1509871803976-crop1509871983860p.jpg')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end justify-between border-b border-white/20 pb-4 mb-4">
                <div>
                  <div className="text-6xl font-heading text-white leading-none">2017</div>
                  <div className="text-white/60 font-mono tracking-widest text-sm uppercase mt-2">{t.era2017}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-heading text-white">SSG</div>
                  <div className="text-gold text-xs uppercase font-bold tracking-widest">{t.tag2017}</div>
                </div>
              </div>

              {/* Roster */}
              <div className="flex flex-wrap gap-2 text-sm text-gray-300 font-mono">
                <span>CuVee</span> <span className="text-gold">•</span>
                <span>Ambition</span> <span className="text-gold">•</span>
                <span>Crown</span> <span className="text-gold">•</span>
                <span className="text-white font-bold text-gold drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">Ruler (MVP)</span> <span className="text-gold">•</span>
                <span>CoreJJ</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
