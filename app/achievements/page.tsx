"use client";

import { Medal, Calendar } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AchievementsTimeline } from "@/components/achievements/AchievementsTimeline";
import { AchievementsHero } from "@/components/achievements/AchievementsHero";
import {
  CEOQuoteSection,
  LegacyBannerSection,
  LegacyQuoteSection,
  MilestonesSection,
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
    { value: `${worldsChampions}x`, label: milestoneLabels.worldsChampions, icon: "worlds", color: "text-yellow-400" },
    { value: `${msiChampions}x`, label: milestoneLabels.msiChampions, icon: "msi", color: "text-blue-400" },
    { value: `${lckChampions}x`, label: milestoneLabels.lckChampions, icon: "lck", color: "text-gold" },
    { value: `${internationalTitles}x`, label: milestoneLabels.internationalTitles, icon: Medal, color: "text-purple-400" },
    { value: `${yearsActive}`, label: milestoneLabels.yearsOfLegacy, icon: Calendar, color: "text-white" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <AchievementsHero
        language={language}
        setExpandedYear={setExpandedYear}
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

      {/* Timeline */}
      <AchievementsTimeline
        language={language}
        expandedYear={expandedYear}
        setExpandedYear={setExpandedYear}
        isTourMode={isTourMode}
        currentTourYear={currentTourYear}
      />

      {/* 2025 Highlight */}
      <TripleCrown2025Section language={language} />

      {/* CEO Quote */}
      <CEOQuoteSection language={language} />

      {/* Legacy Quote */}
      <LegacyQuoteSection language={language} />
    </div>
  );
}
