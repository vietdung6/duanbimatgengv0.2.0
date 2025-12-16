"use client";

import { motion } from "framer-motion";
import { HistoryTour } from "@/components/achievements/HistoryTour";
import { translations } from "@/lib/i18n/translations";

interface AchievementsHeroProps {
  language: string;
  expandedYear: number | null;
  setExpandedYear: (year: number | null) => void;
  isTourMode: boolean;
  setIsTourMode: (value: boolean) => void;
  currentTourYear: number | null;
  setCurrentTourYear: (year: number | null) => void;
}

export function AchievementsHero({
  language,
  expandedYear,
  setExpandedYear,
  isTourMode,
  setIsTourMode,
  currentTourYear,
  setCurrentTourYear,
}: AchievementsHeroProps) {
  const heroText = translations[language].achievementsPage.hero;

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ minHeight: "400px" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.img
          src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/518937717_1168409358430330_4592867484714323039_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=xC5cIKq-6aIQ7kNvwHfBqLV&_nc_oc=AdkMRSNVq5QcNvJC803lSVSt1eFX9YtyF7KOL4ryu8jlWtbxaPHCwPD8QeV0uIpEcsA&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=GpxXF9ZUc40z5Mp6ec_bGw&oh=00_AfkkXEB8qOdc4i_Mholmg-L-uAHAHM2rzluZKkKZcopcZA&oe=6940F229"
          alt="Achievements Banner"
          className="object-cover"
          style={{
            width: "720px",
            height: "900px",
            maxWidth: "90%",
            maxHeight: "70vh",
            objectFit: "cover",
            objectPosition: "center center",
          }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        {/* Animated Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold/30 rounded-full"
            initial={{
              x: `${20 + i * 15}%`,
              y: `${30 + i * 10}%`,
              opacity: 0,
            }}
            animate={{
              y: [
                `${30 + i * 10}%`,
                `${20 + i * 10}%`,
                `${30 + i * 10}%`,
              ],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <motion.h1
            className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 px-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              type: "spring",
              stiffness: 200,
            }}
          >
            <motion.span
              className="text-gradient-gold inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {heroText.title}
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base md:text-lg px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {heroText.description}
          </motion.p>

          <HistoryTour
            language={language}
            expandedYear={expandedYear}
            setExpandedYear={setExpandedYear}
            isTourMode={isTourMode}
            setIsTourMode={setIsTourMode}
            currentTourYear={currentTourYear}
            setCurrentTourYear={setCurrentTourYear}
          />
        </motion.div>
      </div>
    </section>
  );
}

