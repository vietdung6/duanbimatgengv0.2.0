"use client";

import { motion } from "framer-motion";
import { AchievementItem } from "@/lib/data/achievements";
import { Language } from "@/lib/i18n/translations";
import { TournamentLogo } from "./TournamentLogo";

interface AchievementCardProps {
  achievement: AchievementItem;
  index: number;
  language: Language;
}

const getTitle = (item: { title: string; titleVi?: string }, language: Language) =>
  language === "en" ? item.title : (item.titleVi || item.title);

export function AchievementCard({ achievement, index, language }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 12,
      }}
      whileHover={{
        scale: 1.02,
        x: 5,
        transition: { duration: 0.2 },
      }}
      className={`flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl relative overflow-hidden group/item ${achievement.type === "legendary"
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
        className={`absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ${achievement.type === "legendary" || achievement.type === "gold"
            ? "bg-gradient-to-r from-yellow-500/10 to-transparent"
            : "bg-gradient-to-r from-white/5 to-transparent"
          }`}
      />

      {/* Shimmer effect for legendary/gold */}
      {(achievement.type === "legendary" || achievement.type === "gold") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8 }}
        />
      )}

      <div className="relative z-10 flex items-center gap-4 w-full">
        {/* Logo or Icon */}
        <TournamentLogo
          title={achievement.title}
          icon={achievement.icon}
          type={achievement.type}
        />

        <div className="flex-1 min-w-0">
          <motion.h3
            className={`font-semibold mb-1 sm:mb-2 text-sm sm:text-base ${achievement.type === "legendary"
                ? "text-yellow-300 sm:text-lg"
                : achievement.type === "gold"
                  ? "text-yellow-400"
                  : achievement.type === "silver"
                    ? "text-gray-300"
                    : achievement.type === "info"
                      ? "text-gray-300"
                      : "text-amber-600"
              }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.08 + 0.1 }}
          >
            {getTitle(achievement, language)}
          </motion.h3>

          {achievement.players && achievement.players.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {achievement.players.map((player, idx) => {
                const isMVP = "mvp" in achievement && achievement.mvp === player;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.08 + idx * 0.05 + 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    className={`text-xs px-2.5 py-1 rounded-md inline-flex items-center gap-1 cursor-pointer ${isMVP
                        ? "bg-gradient-to-r from-yellow-500/40 to-yellow-600/40 text-yellow-200 border border-yellow-400/50 shadow-lg shadow-yellow-500/30"
                        : achievement.type === "legendary"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                  >
                    {isMVP && <span className="text-xs">⭐</span>}
                    {player}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
