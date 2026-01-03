"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { StorySlide } from "@/lib/data/storySlides";
import { StoryProgress } from "./StoryProgress";
import { StorySlideContent } from "./StorySlideContent";
import { Language } from "@/lib/i18n/translations";

interface StoryOverlayProps {
    isOpen: boolean;
    slideIndex: number;
    currentSlide: StorySlide;
    progress: number;
    isPaused: boolean;
    totalSlides: number;
    language: Language;
    t: {
        tapHint: string;
        headerTitle: string;
        eras: Record<number, {
            era: string;
            title: string;
            note: string;
            highlights: string[];
        }>;
    };
    onClose: () => void;
    onGoToSlide: (index: number) => void;
    onNext: () => void;
    onPrev: () => void;
    onTogglePause: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onScreenTap: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function StoryOverlay({
    isOpen,
    slideIndex,
    currentSlide,
    progress,
    isPaused,
    totalSlides,
    language,
    t,
    onClose,
    onGoToSlide,
    onNext,
    onPrev,
    onTogglePause,
    onTouchStart,
    onTouchEnd,
    onScreenTap,
}: StoryOverlayProps) {
    if (typeof window === "undefined") return null;

    const content = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999]"
                    style={{ isolation: 'isolate' }}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onClick={onScreenTap}
                >
                    {/* Solid black background */}
                    <div className="absolute inset-0 bg-black" />

                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <motion.div
                            key={slideIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={currentSlide.bgImage}
                                alt={`Era ${currentSlide.year}`}
                                fill
                                className="object-cover"
                                priority
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-b ${currentSlide.bgGradient}`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                        </motion.div>
                    </div>

                    {/* Progress + Controls - TOP */}
                    <StoryProgress
                        slideIndex={slideIndex}
                        progress={progress}
                        isPaused={isPaused}
                        currentYear={currentSlide.year}
                        headerTitle={t.headerTitle}
                        logo={currentSlide.logo}
                        onSlideClick={onGoToSlide}
                        onTogglePause={onTogglePause}
                        onClose={onClose}
                    />

                    {/* Content - BOTTOM */}
                    <div className="absolute inset-0 flex flex-col justify-end pb-8 px-4 z-10 pointer-events-none">
                        <div className="pointer-events-auto">
                            <StorySlideContent
                                slide={currentSlide}
                                slideIndex={slideIndex}
                                language={language}
                                t={t}
                            />
                        </div>

                        {/* Desktop navigation arrows */}
                        <div className="hidden sm:flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-auto">
                            {slideIndex > 0 && (
                                <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                                    <ChevronLeft className="text-white" size={28} />
                                </button>
                            )}
                        </div>
                        <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-4 pointer-events-auto">
                            {slideIndex < totalSlides - 1 && (
                                <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                                    <ChevronRight className="text-white" size={28} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Slide counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                        <span className="text-white/60 text-xs font-medium">{slideIndex + 1} / {totalSlides}</span>
                    </div>

                    {/* Touch hint - first slide only, near header */}
                    {slideIndex === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute top-24 left-1/2 -translate-x-1/2 z-20 text-center">
                            <p className="text-white/50 text-xs px-3 py-1.5 bg-black/30 rounded-full backdrop-blur-sm">{t.tapHint}</p>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
