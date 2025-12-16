"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Trophy, Users, Star } from "lucide-react";
import Link from "next/link";
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
    { icon: Calendar, value: "2012", label: t.home.stats.established, asterisk: "*" }, // Samsung only
    { icon: Users, value: "5", label: t.home.stats.starPlayers },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          {/* Hero Image */}
          <div className="absolute inset-0">
            <img 
              src="https://gamek.mediacdn.vn/thumb_w/640/133514250583805952/2025/7/14/geng-msi-1-17524662839241244737788.jpg"
              alt="Gen.G MSI 2025"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
            {/* Gold accent overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
          </div>
          
          {/* Gold accent gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[800px] h-[800px] bg-gradient-radial-gold opacity-10 blur-3xl" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
               style={{
                 backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
                 backgroundSize: '50px 50px'
               }} />
        </div>

        {/* Animated particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {HERO_PARTICLES.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold rounded-full"
              style={{
                left: `${particle.left}%`,
                top: "100%",
              }}
              animate={{
                y: [0, -1000],
                opacity: [0, 1, 0],
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
        <div className="relative z-10 text-center px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 
                        rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gold text-xs sm:text-sm font-medium">{t.home.badge}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-gradient-gold drop-shadow-lg">{t.home.title}</span>
            </motion.h1>
            
            <motion.p 
              className="font-heading text-xl sm:text-3xl md:text-4xl text-white/60 mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t.home.subtitle}
            </motion.p>

            {/* Subtitle */}
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {t.home.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/team" className="btn-gold inline-flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6">
                {t.home.meetTeam} <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Link>
              <Link href="/fan-zone/shrine" className="btn-outline-gold inline-flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6">
                <span>⛩️</span> {t.home.shrine}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-3 bg-gold rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black-light border-y border-black-charcoal relative overflow-hidden">
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
                  logo: <img src={tournamentLogos.lck} alt="LCK" className="w-16 h-16 mx-auto object-contain" />,
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
                <Link href="/fan-zone/shrine" className="text-gold font-semibold inline-flex items-center gap-2 
                              group-hover:gap-3 transition-all">
                  {t.home.features.enterShrine} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Predictions Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-dark relative overflow-hidden group cursor-pointer min-h-[300px]
                        flex flex-col justify-end"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold">
                  🎮 {t.home.features.minigame}
                </span>
              </div>
              
              <div className="relative z-20 p-6">
                <span className="text-5xl mb-4 block">🔮</span>
                <h3 className="font-heading text-3xl text-gold mb-2">{t.home.features.predictionTitle}</h3>
                <p className="text-gray-400 mb-4">
                  {t.home.features.predictionDesc}
                </p>
                <Link href="/fan-zone/predictions" className="text-gold font-semibold inline-flex items-center gap-2 
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
