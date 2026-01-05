"use client";

import { Medal, Calendar } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AchievementsHero } from "@/components/achievements/AchievementsHero";
import {
  CEOQuoteSection,
  LegacyBannerSection,
  LegacyQuoteSection,
  MilestonesSection,
  MSIChampionsSection,
  TripleCrown2025Section,
  WorldsChampionsSection,
} from "@/components/achievements/AchievementSections";

export default function AchievementsPage() {
  const [expandedYear, setExpandedYear] = useState<number | null>(2025);
  const [isTourMode, setIsTourMode] = useState(false);
  const [currentTourYear, setCurrentTourYear] = useState<number | null>(null);
  const { language, t } = useLanguage();

  // Calculate totals
  const worldsChampions = 2; // 2014 Samsung White, 2017 Samsung Galaxy
  const lckChampions = 7; // 2014 Spring(1), 2022 Summer(1), 2023 Spring(1), 2024 Spring(1), 2024 Summer(1), 2025 Regular(=2 old cups)
  const msiChampions = 2; // 2024, 2025
  const ewcChampions = 1; // 2025
  const internationalTitles = worldsChampions + msiChampions + ewcChampions; // Total international majors (Worlds + MSI + EWC)
  const yearsActive = 12; // 2013-2025

  const milestoneLabels = t.achievementsPage.milestones;
  const milestones = [
    { value: `${worldsChampions}x`, label: milestoneLabels.worldsLabelShort, icon: "worlds", color: "text-yellow-400" },
    { value: `${msiChampions}x`, label: milestoneLabels.msiLabelShort, icon: "msi", color: "text-blue-400" },
    { value: `${lckChampions}x`, label: milestoneLabels.lckLabelShort, icon: "lck", color: "text-gold" },
    { value: `${internationalTitles}x`, label: milestoneLabels.internationalLabelShort, icon: Medal, color: "text-purple-400" },
    { value: `${yearsActive}`, label: milestoneLabels.yearsLabelShort, icon: Calendar, color: "text-white" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <AchievementsHero
        language={language}
        setExpandedYear={() => { }} // No-op as timeline is moved
        isTourMode={isTourMode}
        setIsTourMode={setIsTourMode}
        currentTourYear={currentTourYear}
        setCurrentTourYear={setCurrentTourYear}
      />

      {/* Legacy Banner */}
      <div>
        <LegacyBannerSection language={language} />
      </div>

      {/* Milestones */}
      <MilestonesSection language={language} milestones={milestones} />

      {/* Worlds Champions Highlight */}
      <WorldsChampionsSection language={language} />

      {/* MSI Champions Highlight */}
      <MSIChampionsSection language={language} />



      {/* 2025 Highlight */}
      <TripleCrown2025Section language={language} />

      {/* View Full History CTA */}
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <a
          href="/history"
          className="group relative px-8 py-4 bg-black border border-white/20 rounded-full overflow-hidden hover:border-gold/50 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gold/10 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500" />
          <div className="relative flex items-center gap-3">
            <span className="font-heading text-xl text-white group-hover:text-gold transition-colors">VIEW FULL HISTORY</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </a>
      </div>

      {/* CEO Quote */}
      <CEOQuoteSection language={language} />

      {/* Legacy Quote */}
      <LegacyQuoteSection language={language} />
    </div>
  );
}
