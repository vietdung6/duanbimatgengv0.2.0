"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AchievementsTimeline } from "@/components/achievements/AchievementsTimeline";
import { motion } from "framer-motion";

export default function HistoryPage() {
    const [expandedYear, setExpandedYear] = useState<number | null>(2025);
    const [isTourMode, setIsTourMode] = useState(false);
    const [currentTourYear, setCurrentTourYear] = useState<number | null>(null);
    const { language, t } = useLanguage();

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="font-heading text-5xl md:text-7xl text-uppercase text-white tracking-widest leading-none mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">FULL</span>{" "}
                        <span className="text-gold">HISTORY</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm tracking-wide">
                        {t.achievementsPage.hero.description}
                    </p>
                </motion.div>

                {/* Timeline */}
                <AchievementsTimeline
                    language={language}
                    expandedYear={expandedYear}
                    setExpandedYear={setExpandedYear}
                    isTourMode={isTourMode}
                    currentTourYear={currentTourYear}
                />
            </div>
        </div>
    );
}
