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
    <section className="py-8 sm:py-10 md:py-12 border-b border-black-charcoal">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-6 md:grid-cols-5 gap-3 sm:gap-4">
          {milestones.map((milestone, i) => {
            const Icon =
              typeof milestone.icon === "string" ? null : milestone.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`card-dark text-center relative group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 col-span-2 md:col-span-1 ${i === 3 ? "col-start-2" : ""
                  } md:col-start-auto`}
              >
                <div className={`absolute inset-0 bg-${milestone.color.replace('text-', '')}/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl`} />

                {milestone.icon === "worlds" ? (
                  <div className="flex justify-center mb-1.5 sm:mb-2">
                    <WorldsLogo
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${milestone.color}`}
                    />
                  </div>
                ) : milestone.icon === "msi" ? (
                  <div className="flex justify-center mb-1.5 sm:mb-2">
                    <MSILogo
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${milestone.color}`}
                    />
                  </div>
                ) : milestone.icon === "lck" ? (
                  <div className="flex justify-center mb-1.5 sm:mb-2">
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                      <Image
                        src={tournamentLogos.lck}
                        alt="LCK"
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 24px, (max-width: 768px) 28px, 32px"
                      />
                    </div>
                  </div>
                ) : Icon ? (
                  <Icon
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mx-auto mb-1.5 sm:mb-2 ${milestone.color}`}
                  />
                ) : null}
                <div
                  className={`font-heading text-2xl sm:text-3xl md:text-4xl mb-1 ${milestone.color} flex items-center justify-center gap-1`}
                >
                  {milestone.value}
                  {milestone.icon === "lck" && (
                    <span className="text-gold text-sm sm:text-base md:text-lg">
                      *
                    </span>
                  )}
                </div>
                <div className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-tight">
                  {milestone.label}
                </div>
                {milestone.icon === "lck" && (
                  <div className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs mt-1 px-1">
                    {t.legacy.lckRegularNote}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

