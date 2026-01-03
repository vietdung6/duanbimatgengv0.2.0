"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";
import { storySlides, StorySlide } from "@/lib/data/storySlides";
import { Language } from "@/lib/i18n/translations";

interface StorySlideContentProps {
    slide: StorySlide;
    slideIndex: number;
    language: Language;
    t: {
        eras: Record<number, {
            era: string;
            title: string;
            note: string;
            highlights: string[];
        }>;
    };
}

export function StorySlideContent({ slide, slideIndex, language, t }: StorySlideContentProps) {
    const eraTranslation = t.eras[slide.year];
    if (!eraTranslation) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={slideIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
            >
                {/* Era Badge */}
                <motion.div className={`inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 ${slide.accentColor} text-sm font-medium`}>
                    {eraTranslation.era}
                </motion.div>

                {/* Title */}
                <motion.h2 className="text-white font-heading text-3xl sm:text-4xl md:text-5xl leading-tight">
                    {eraTranslation.title}
                </motion.h2>

                {/* Description */}
                <motion.p className="text-gray-200 text-base sm:text-lg max-w-xl leading-relaxed">
                    {eraTranslation.note}
                </motion.p>

                {/* Highlights */}
                <motion.div className="flex flex-wrap gap-2">
                    {eraTranslation.highlights.map((h, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                            {h}
                        </span>
                    ))}
                </motion.div>

                {/* Players */}
                <motion.div className="flex flex-wrap gap-2 pt-2">
                    {slide.players.map((player, idx) => (
                        <span
                            key={idx}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${player === slide.mvp
                                    ? "bg-gradient-to-r from-yellow-500/40 to-yellow-600/40 text-yellow-200 border border-yellow-400/50"
                                    : "bg-black/40 text-gray-300 border border-white/10"
                                }`}
                        >
                            {player === slide.mvp && "⭐ "}{player}
                        </span>
                    ))}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
