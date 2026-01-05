"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Trophy, Users, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EWCLogo, MSILogo, WorldsLogo, tournamentLogos } from "@/components/shared/Logos";
import FeaturedPlayers from "@/components/home/FeaturedPlayers";

// Deterministic particle configs to avoid hydration mismatches (no Math.random)
const HERO_PARTICLES = Array.from({ length: 15 }, (_, i) => {
  const index = i + 1;
  return {
    left: (index * 100) / 16, // spread roughly across width
    duration: 8 + (index % 5), // 8–12s
    delay: (index % 7) * 0.5, // 0–3s
  };
});

export default function HomePage() {
  const { t, language } = useLanguage();

  const stats = [
    { icon: Trophy, value: "7x", label: t.home.stats.lckChampions, asterisk: "**", logo: <img src={tournamentLogos.lck} alt="LCK" className="w-8 h-8 object-contain" /> }, // Samsung + LCK Regular
    { icon: Star, value: "2x", label: t.home.stats.worldsChampions, asterisk: "*", logo: <WorldsLogo className="w-8 h-8 text-yellow-400" /> }, // Samsung only
    { icon: Calendar, value: "2013", label: t.home.stats.established, asterisk: "*" }, // Samsung only
    { icon: Users, value: "5", label: t.home.stats.starPlayers },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {/* Hero Image with Cinematic Zoom */}
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src="https://gamek.mediacdn.vn/thumb_w/640/133514250583805952/2025/7/14/geng-msi-1-17524662839241244737788.jpg"
              alt="Gen.G MSI 2025"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
            <div className="absolute inset-0 bg-gold/10 mix-blend-overlay" /> {/* Gold Tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-transparent to-gold/20 opacity-50" /> {/* Side Gold Accents */}
          </motion.div>

          {/* Gold accent gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[1000px] h-[1000px] bg-gradient-radial-gold opacity-20 blur-[100px] mix-blend-screen" />

          {/* Grid pattern / Texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/assets/noise.png')]" />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)` ,
              backgroundSize: '60px 60px'
            }} />
        </div>

        {/* Animated particles effect (Client Side Only ideally, but we use strict hydration safe div here) */}
        {/* We will use a CSS-only approach for simple floating dust or use the deterministic array we already have but nicer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {HERO_PARTICLES.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_#EAB308]"
              style={{
                left: `${particle.left}%`,
                top: "110%",
              }}
              animate={{
                y: [0, -1200],
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md border border-gold/30 
                        rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-gold text-xs sm:text-sm font-bold tracking-widest uppercase">{t.home.badge}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFE589] via-[#D4AF37] to-[#AA8220] drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">{t.home.title}</span>
            </motion.h1>

            <motion.p
              className="font-sans text-lg sm:text-xl md:text-2xl text-white/40 font-medium tracking-widest uppercase mb-6 sm:mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              LOL FANDOM VIETNAM
            </motion.p>

            <motion.p
              className="font-sans text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {t.home.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/achievements" className="group relative overflow-hidden bg-gold text-black font-bold text-sm sm:text-base py-3 px-8 rounded-full transition-transform hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  {t.home.exploreLegacy} <Trophy size={18} />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <Link href="/team" className="group relative overflow-hidden bg-black/50 backdrop-blur text-white border border-white/20 font-bold text-sm sm:text-base py-3 px-8 rounded-full transition-transform hover:scale-105 hover:border-gold/50 hover:text-gold">
                <span className="relative z-10 flex items-center gap-2">
                  {t.home.meetTeam} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] text-gold/50 tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 border border-gold/30 rounded-full flex justify-center pt-2 bg-black/20 backdrop-blur-sm">
              <motion.div
                className="w-1 h-2 bg-gold/80 rounded-full"
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-center mb-2 sm:mb-3">
                    {stat.logo || <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />}
                  </div>
                  <div className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-1">
                    {stat.value}
                    {stat.asterisk && <span className="text-gold text-sm sm:text-lg align-top">{stat.asterisk}</span>}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Asterisk notes */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-500 text-xs mt-6 space-y-1"
          >
            <p><span className="text-gold">*</span> {t.home.stats.noteSamsung}</p>
            <p><span className="text-gold">**</span> {t.home.stats.noteLckRegular}</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Players */}
      <FeaturedPlayers />

      {/* 2025 Achievements */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/** 2025 achievements teaser i18n */}
            {(() => {
              const a = t.home.achievementsTeaser;
              return (
                <>
                  <h2 className="font-heading text-4xl sm:text-5xl text-center mb-4">
                    <span className="text-gradient-gold">
                      {a.title}
                    </span>
                  </h2>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {a.subtitle}
                  </p>
                </>
              );
            })()}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 max-w-5xl mx-auto">
            {(() => {
              const a = t.home.achievementsTeaser;
              const cards = [
                {
                  title: a.msiTitle,
                  type: a.msiType,
                  logo: <MSILogo className="w-16 h-16 text-blue-400 mx-auto" />,
                  color: "from-blue-500/20"
                },
                {
                  title: a.ewcTitle,
                  type: a.ewcType,
                  logo: <EWCLogo className="w-16 h-16 text-white mx-auto" />,
                  color: "from-white/20"
                },
                {
                  title: a.lckTitle,
                  type: a.lckType,
                  logo: <div className="relative w-16 h-16 mx-auto"><Image src={tournamentLogos.lck} alt="LCK" fill className="object-contain" sizes="64px" /></div>,
                  color: "from-gold/20"
                },
              ];
              return cards.map((achievement, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
                  className={`card-dark card-glow bg-gradient-to-br ${achievement.color} to-transparent 
                         border border-gold/30 rounded-xl p-8 text-center
                         hover:border-gold/60 hover:shadow-gold/20`}
                >
                  <motion.div
                    className="mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {achievement.logo}
                  </motion.div>
                  <div className="text-gold font-heading text-sm mb-2 uppercase tracking-wider">{achievement.type}</div>
                  <div className="font-heading text-2xl text-white">{achievement.title}</div>
                </motion.div>
              ));
            })()}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/achievements" className="btn-outline-gold inline-flex items-center gap-2">
              {t.home.achievementsTeaser.cta} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Fan Zone Teaser */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Church of Chovy Minigame Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-dark relative overflow-hidden group cursor-pointer min-h-[300px]
                        flex flex-col justify-end"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-radial-gold opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded font-bold">
                  🎮 {t.home.features.minigame}
                </span>
              </div>

              <div className="relative z-20 p-6">
                <span className="text-5xl mb-4 block">⛩️</span>
                <h3 className="font-heading text-3xl text-gold mb-2">{t.home.features.shrineTitle}</h3>
                <p className="text-gray-400 mb-4">
                  {t.home.features.shrineDesc}
                </p>
                <Link href="/fan-zone/church" className="text-gold font-semibold inline-flex items-center gap-2 
                              group-hover:gap-3 transition-all">
                  {t.home.features.enterShrine} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Viewing Party Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-dark relative overflow-hidden group cursor-pointer min-h-[300px]
                        flex flex-col justify-end"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-red-600/20 text-red-500 text-xs px-2 py-1 rounded font-bold animate-pulse">
                  🔴 LIVE
                </span>
              </div>

              <div className="relative z-20 p-6">
                <span className="text-5xl mb-4 block">📺</span>
                <h3 className="font-heading text-3xl text-gold mb-2">Viewing Party</h3>
                <p className="text-gray-400 mb-4">
                  {language === 'en'
                    ? "Watch Gen.G matches together with other fans. Cheer, chat and earn rewards!"
                    : "Xem chung các trận đấu của Gen.G cùng fan hâm mộ. Cổ vũ, bình luận và nhận quà!"}
                </p>
                <Link href="/fan-zone/viewing-party" className="text-gold font-semibold inline-flex items-center gap-2 
                              group-hover:gap-3 transition-all">
                  {t.home.features.joinNow} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

