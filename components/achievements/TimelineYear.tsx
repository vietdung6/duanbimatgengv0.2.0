"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { EWCLogo, MSILogo, WorldsLogo, tournamentLogos } from "@/components/shared/Logos";
import { AchievementYear } from "@/lib/data/achievements";
import { eraLogos } from "@/lib/data/eraLogos";
import { Language, translations } from "@/lib/i18n/translations";
import { AchievementCard } from "./AchievementCard";

interface TimelineYearProps {
  yearData: AchievementYear;
  yearIndex: number;
  expandedYear: number | null;
  setExpandedYear: (year: number | null) => void;
  isTourMode: boolean;
  currentTourYear: number | null;
  language: Language;
}

export function TimelineYear({
  yearData,
  yearIndex,
  expandedYear,
  setExpandedYear,
  isTourMode,
  currentTourYear,
  language,
}: TimelineYearProps) {
  const t = translations[language].achievementsPage.timeline;

  // Calculate cups for this year
  const lckCups = yearData.items.filter(
    (i) =>
      (i.title.toLowerCase().includes("lck") ||
        i.title.toLowerCase().includes("champions")) &&
      (i.type === "gold" || i.type === "legendary"),
  ).length;
  const msiCups = yearData.items.filter(
    (i) =>
      i.title.toLowerCase().includes("msi") &&
      (i.type === "gold" || i.type === "legendary"),
  ).length;
  const worldsCups = yearData.items.filter(
    (i) =>
      (i.title.toLowerCase().includes("worlds") ||
        i.title.toLowerCase().includes("cktg")) &&
      i.type === "legendary",
  ).length;
  const ewcCups = yearData.items.filter(
    (i) =>
      i.title.toLowerCase().includes("ewc") &&
      (i.type === "gold" || i.type === "legendary"),
  ).length;
  const totalCups = lckCups + msiCups + worldsCups + ewcCups;

  return (
    <motion.div
      id={`year-${yearData.year}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: yearIndex * 0.05 }}
      className={`mb-4 scroll-mt-32 relative group ${isTourMode && currentTourYear === yearData.year
        ? "ring-2 ring-gold/60 shadow-gold-glow rounded-2xl"
        : ""
        }`}
    >
      {/* Timeline Dot - Now visible on ALL devices */}
      <div
        className={`absolute -left-4 sm:-left-5 top-[18px] w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 transition-all duration-300 z-10 ${expandedYear === yearData.year
          ? "bg-black border-gold shadow-[0_0_8px_rgba(255,215,0,0.6)] scale-125"
          : "bg-black border-gray-600 group-hover:border-gold/50"
          }`}
      />

      {/* Year Header */}
      <motion.button
        onClick={() =>
          setExpandedYear(
            expandedYear === yearData.year ? null : yearData.year,
          )
        }
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full bg-black-light border rounded-lg sm:rounded-xl p-3 sm:p-4 
                 flex items-center justify-between hover:border-gold/50 transition-all relative overflow-hidden group
                 ${yearData.era === "Samsung"
            ? "border-blue-500/30"
            : yearData.era === "Samsung Galaxy"
              ? "border-blue-400/30"
              : yearData.era === "MVP Ozone"
                ? "border-green-500/30"
                : "border-black-charcoal"
          }`}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.6 }}
        />
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap flex-1 min-w-0">
          <span className="font-heading text-xl sm:text-2xl md:text-3xl text-gold flex-shrink-0">
            {yearData.year}
          </span>
          {/* Era Logo + Name */}
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ${yearData.era === "Samsung"
              ? "bg-blue-500/20"
              : yearData.era === "Samsung Galaxy"
                ? "bg-blue-400/20"
                : yearData.era === "KSV"
                  ? "bg-purple-500/20"
                  : yearData.era === "MVP Ozone"
                    ? "bg-green-500/20"
                    : "bg-gold/20"
              }`}
          >
            {eraLogos[yearData.era] && (
              <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                <Image
                  src={eraLogos[yearData.era]!}
                  alt={yearData.era}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 16px, 20px"
                />
              </div>
            )}
            <span
              className={`text-[10px] sm:text-xs ${yearData.era === "Samsung"
                ? "text-blue-400"
                : yearData.era === "Samsung Galaxy"
                  ? "text-blue-300"
                  : yearData.era === "KSV"
                    ? "text-purple-400"
                    : yearData.era === "MVP Ozone"
                      ? "text-green-400"
                      : "text-gold"
                }`}
            >
              {yearData.era}
            </span>
          </div>
          {/* Cups count by type */}
          {totalCups > 0 && (
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {worldsCups > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <WorldsLogo className="w-4 h-4" />
                  {worldsCups}
                </span>
              )}
              {msiCups > 0 && (
                <span className="flex items-center gap-1 text-blue-400">
                  <MSILogo className="w-4 h-4" />
                  {msiCups}
                </span>
              )}
              {ewcCups > 0 && (
                <span className="flex items-center gap-1 text-white">
                  <EWCLogo className="w-4 h-4" />
                  {ewcCups}
                </span>
              )}
              {lckCups > 0 && (
                <span className="flex items-center gap-1 text-gold">
                  <div className="relative w-4 h-4">
                    <Image
                      src={tournamentLogos.lck}
                      alt="LCK"
                      fill
                      className="object-contain"
                      sizes="16px"
                    />
                  </div>
                  {lckCups}
                </span>
              )}
              <span className="text-gray-400 ml-1">
                ({totalCups} {t.cupsLabel})
              </span>
            </div>
          )}
        </div>
        <motion.div
          animate={{
            rotate: expandedYear === yearData.year ? 180 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-gold" />
        </motion.div>
      </motion.button>

      {/* Achievements List */}
      <AnimatePresence>
        {expandedYear === yearData.year && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="py-3 sm:py-4 space-y-2 sm:space-y-3 pl-4 sm:pl-6 md:pl-8 border-l-2 border-gold/30 ml-2 sm:ml-3 md:ml-4 mt-2 relative">
              {/* Animated timeline line */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-transparent"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />

              {[...yearData.items]
                .sort((a, b) => {
                  // Sort priority: legendary > gold > silver > bronze > info
                  const priority: Record<string, number> = {
                    legendary: 0,
                    gold: 1,
                    silver: 2,
                    bronze: 3,
                    info: 4,
                  };
                  const aPriority =
                    priority[a.type as keyof typeof priority] ?? 5;
                  const bPriority =
                    priority[b.type as keyof typeof priority] ?? 5;
                  return aPriority - bPriority;
                })
                .map((achievement, i) => (
                  <AchievementCard
                    key={i}
                    achievement={achievement}
                    index={i}
                    language={language}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
