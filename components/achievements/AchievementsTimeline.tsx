"use client";

import { achievements } from "@/lib/data/achievements";
import { translations, Language } from "@/lib/i18n/translations";
import { TimelineYear } from "./TimelineYear";

interface AchievementsTimelineProps {
  language: Language;
  expandedYear: number | null;
  setExpandedYear: (year: number | null) => void;
  isTourMode: boolean;
  currentTourYear: number | null;
}

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

          {/* Notes - Bottom right, below title - Increased font size for legibility */}
          <div className="mb-6 sm:mb-8 flex justify-end pr-2 sm:pr-4 md:pr-8">
            <div className="text-right text-gray-500 text-xs">
              <p>
                <span className="text-gold">⭐</span>{" "}
                {t.fmvpNote}
              </p>
            </div>
          </div>

          {/* Timeline Container with Line visible on ALL devices */}
          <div className="relative pl-6 sm:pl-8">
            {/* Timeline Line - Now visible on mobile too! */}
            <div className="absolute left-2 sm:left-3 top-2 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gray-800 to-transparent" />

            <div className="space-y-4 sm:space-y-6">
              {achievements.map((yearData, yearIndex) => (
                <TimelineYear
                  key={yearData.year}
                  yearData={yearData}
                  yearIndex={yearIndex}
                  expandedYear={expandedYear}
                  setExpandedYear={setExpandedYear}
                  isTourMode={isTourMode}
                  currentTourYear={currentTourYear}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
