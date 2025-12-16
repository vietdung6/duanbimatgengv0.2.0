"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EWCLogo, MSILogo, WorldsLogo, tournamentLogos } from "@/components/shared/Logos";
import { achievements } from "@/lib/data/achievements";
import { eraLogos } from "@/lib/data/eraLogos";
import { translations } from "@/lib/i18n/translations";

interface AchievementsTimelineProps {
  language: string;
  expandedYear: number | null;
  setExpandedYear: (year: number | null) => void;
  isTourMode: boolean;
  currentTourYear: number | null;
}

// Helper: get localized title
const getTitle = (item: { title: string; titleVi: string }, language: string) =>
  language === "en" ? item.title : item.titleVi;

// Helper: infer tournament logo from title
const getTournamentLogo = (title: string) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("worlds") || titleLower.includes("cktg") || titleLower.includes("thế giới")) {
    return <WorldsLogo className="w-8 h-8 text-yellow-400" />;
  }
  if (titleLower.includes("msi")) {
    return <MSILogo className="w-8 h-8 text-blue-400" />;
  }
  if (titleLower.includes("ewc")) {
    return <EWCLogo className="w-8 h-8 text-white" />;
  }
  if (
    titleLower.includes("lck") ||
    titleLower.includes("ogn") ||
    titleLower.includes("champions")
  ) {
    return <img src={tournamentLogos.lck} alt="LCK" className="w-8 h-8 object-contain" />;
  }
  return null;
};

export function AchievementsTimeline({
  language,
  expandedYear,
  setExpandedYear,
  isTourMode,
  currentTourYear,
}: AchievementsTimelineProps) {
  const t = translations[language].achievementsPage.timeline;

  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-xl sm:text-2xl text-gold mb-6 sm:mb-8 text-center px-2">
            {t.fullTimelineTitle}
          </h2>

          {/* Notes - Bottom right, below title */}
          <div className="mb-6 sm:mb-8 flex justify-end pr-2 sm:pr-4 md:pr-8">
            <div className="text-right text-gray-500 text-[10px] sm:text-xs">
              <p>
                <span className="text-gold">⭐</span>{" "}
                {t.fmvpNote}
              </p>
            </div>
          </div>

          {achievements.map((yearData, yearIndex) => {
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
                key={yearData.year}
                id={`year-${yearData.year}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: yearIndex * 0.05 }}
                className={`mb-4 scroll-mt-32 ${
                  isTourMode && currentTourYear === yearData.year
                    ? "ring-2 ring-gold/60 shadow-gold-glow rounded-2xl"
                    : ""
                }`}
              >
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
                           ${
                             yearData.era === "Samsung"
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
                      className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ${
                        yearData.era === "Samsung"
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
                        <img
                          src={eraLogos[yearData.era]}
                          alt={yearData.era}
                          className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                        />
                      )}
                      <span
                        className={`text-[10px] sm:text-xs ${
                          yearData.era === "Samsung"
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
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs flex-wrap">
                        {worldsCups > 0 && (
                          <span className="flex items-center gap-0.5 sm:gap-1 text-yellow-400">
                            <WorldsLogo className="w-3 h-3 sm:w-4 sm:h-4" />
                            {worldsCups}
                          </span>
                        )}
                        {msiCups > 0 && (
                          <span className="flex items-center gap-0.5 sm:gap-1 text-blue-400">
                            <MSILogo className="w-3 h-3 sm:w-4 sm:h-4" />
                            {msiCups}
                          </span>
                        )}
                        {ewcCups > 0 && (
                          <span className="flex items-center gap-0.5 sm:gap-1 text-white">
                            <EWCLogo className="w-3 h-3 sm:w-4 sm:h-4" />
                            {ewcCups}
                          </span>
                        )}
                        {lckCups > 0 && (
                          <span className="flex items-center gap-0.5 sm:gap-1 text-gold">
                            <img
                              src={tournamentLogos.lck}
                              alt="LCK"
                              className="w-3 h-3 sm:w-4 sm:h-4 object-contain"
                            />
                            {lckCups}
                          </span>
                        )}
                        <span className="text-gray-400 ml-0.5 sm:ml-1">
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
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -30, scale: 0.9 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{
                                delay: i * 0.08,
                                type: "spring",
                                stiffness: 100,
                                damping: 12,
                              }}
                              whileHover={{
                                scale: 1.02,
                                x: 5,
                                transition: { duration: 0.2 },
                              }}
                              className={`flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl relative overflow-hidden group/item ${
                                achievement.type === "legendary"
                                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-700/20 border-2 border-yellow-500/50"
                                  : achievement.type === "gold"
                                    ? "bg-yellow-500/10 border border-yellow-500/30"
                                    : achievement.type === "silver"
                                      ? "bg-gray-400/10 border border-gray-400/30"
                                      : achievement.type === "info"
                                        ? "bg-blue-500/10 border border-blue-500/30"
                                        : "bg-amber-700/10 border border-amber-700/30"
                              }`}
                            >
                              {/* Hover glow effect */}
                              <motion.div
                                className={`absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ${
                                  achievement.type === "legendary" ||
                                  achievement.type === "gold"
                                    ? "bg-gradient-to-r from-yellow-500/10 to-transparent"
                                    : "bg-gradient-to-r from-white/5 to-transparent"
                                }`}
                              />

                              {/* Shimmer effect for legendary/gold */}
                              {(achievement.type === "legendary" ||
                                achievement.type === "gold") && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                  initial={{ x: "-100%" }}
                                  whileHover={{ x: "200%" }}
                                  transition={{ duration: 0.8 }}
                                />
                              )}
                              <div className="relative z-10 flex items-center gap-4 w-full">
                                {getTournamentLogo(achievement.title) ? (
                                  <motion.div
                                    className="flex-shrink-0"
                                    whileHover={{
                                      rotate: [0, -15, 15, 0],
                                      scale: 1.1,
                                    }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    {getTournamentLogo(achievement.title)}
                                  </motion.div>
                                ) : (
                                  <motion.span
                                    className="text-xl sm:text-2xl md:text-3xl flex-shrink-0"
                                    animate={
                                      achievement.type === "legendary"
                                        ? {
                                            rotate: [0, 5, -5, 0],
                                          }
                                        : {}
                                    }
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }}
                                  >
                                    {achievement.icon}
                                  </motion.span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <motion.h3
                                    className={`font-semibold mb-1 sm:mb-2 text-sm sm:text-base ${
                                      achievement.type === "legendary"
                                        ? "text-yellow-300 sm:text-lg"
                                        : achievement.type === "gold"
                                          ? "text-yellow-400"
                                          : achievement.type === "silver"
                                            ? "text-gray-300"
                                            : achievement.type === "info"
                                              ? "text-blue-300"
                                              : "text-amber-600"
                                    }`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.08 + 0.1 }}
                                  >
                                    {getTitle(achievement, language)}
                                  </motion.h3>
                                  {achievement.players &&
                                    achievement.players.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {achievement.players.map(
                                          (player, idx) => {
                                            const isMVP =
                                              "mvp" in achievement &&
                                              achievement.mvp === player;
                                            return (
                                              <motion.div
                                                key={idx}
                                                initial={{
                                                  opacity: 0,
                                                  scale: 0,
                                                }}
                                                animate={{
                                                  opacity: 1,
                                                  scale: 1,
                                                }}
                                                transition={{
                                                  delay:
                                                    i * 0.08 +
                                                    idx * 0.05 +
                                                    0.2,
                                                  type: "spring",
                                                  stiffness: 200,
                                                }}
                                                whileHover={{
                                                  scale: 1.15,
                                                  y: -2,
                                                }}
                                                className={`text-xs px-2 py-0.5 rounded inline-flex items-center gap-1 cursor-pointer ${
                                                  isMVP
                                                    ? "bg-gradient-to-r from-yellow-500/40 to-yellow-600/40 text-yellow-200 border border-yellow-400/50 shadow-lg shadow-yellow-500/30"
                                                    : achievement.type ===
                                                        "legendary"
                                                      ? "bg-yellow-500/20 text-yellow-300"
                                                      : achievement.type ===
                                                          "gold"
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : achievement.type ===
                                                            "silver"
                                                          ? "bg-gray-400/20 text-gray-300"
                                                          : achievement.type ===
                                                              "info"
                                                            ? "bg-blue-500/20 text-blue-300"
                                                            : "bg-amber-700/20 text-amber-600"
                                                }`}
                                              >
                                                <span
                                                  className={
                                                    isMVP ? "font-bold" : ""
                                                  }
                                                >
                                                  {player}
                                                </span>
                                                {isMVP && (
                                                  <motion.span
                                                    className="text-yellow-300"
                                                    animate={{
                                                      rotate: [
                                                        0, 10, -10, 0,
                                                      ],
                                                    }}
                                                    transition={{
                                                      duration: 1,
                                                      repeat: Infinity,
                                                    }}
                                                  >
                                                    ⭐
                                                  </motion.span>
                                                )}
                                              </motion.div>
                                            );
                                          },
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

