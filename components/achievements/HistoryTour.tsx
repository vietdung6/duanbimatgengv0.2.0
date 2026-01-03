"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useStoryTour } from "@/hooks/useStoryTour";
import { StoryOverlay } from "./story";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface HistoryTourProps {
  setExpandedYear: (year: number | null) => void;
  isTourMode: boolean;
  setIsTourMode: (value: boolean) => void;
  currentTourYear: number | null;
  setCurrentTourYear: (year: number | null) => void;
}

export function HistoryTour({
  setExpandedYear,
  isTourMode,
  setIsTourMode,
  currentTourYear,
  setCurrentTourYear,
}: HistoryTourProps) {
  const { language, t } = useLanguage();

  // Fallback if storyTour translations not loaded
  const defaultStoryT = {
    buttonText: language === "en" ? "History Story" : "Câu chuyện lịch sử",
    buttonSubtext: language === "en" ? "Experience our journey in story format" : "Trải nghiệm hành trình của chúng tôi dạng Story",
    tapHint: language === "en" ? "Tap sides to navigate • Tap center to pause" : "Chạm hai bên để điều hướng • Chạm giữa để tạm dừng",
    headerTitle: language === "en" ? "Gen.G History" : "Lịch sử Gen.G",
    eras: {} as Record<number, { era: string; title: string; note: string; highlights: string[] }>,
  };

  const storyT = t.achievementsPage?.storyTour ?? defaultStoryT;

  const tour = useStoryTour({
    isTourMode,
    setIsTourMode,
    setExpandedYear,
    setCurrentTourYear,
  });

  return (
    <>
      {/* CTA Button */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.75 }}
      >
        <button
          onClick={tour.startTour}
          className="btn-gold flex items-center gap-2 text-sm sm:text-base px-4 sm:px-5 py-2 sm:py-3 w-full sm:w-auto justify-center"
        >
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <Image src="/images/genrang_emote.png" alt="Genrang" fill className="object-contain" sizes="24px" />
          </div>
          {storyT.buttonText}
        </button>
        <span className="text-gray-400 text-xs sm:text-sm text-center">
          {storyT.buttonSubtext}
        </span>
      </motion.div>

      {/* Story Overlay - Rendered via Portal */}
      {tour.mounted && (
        <StoryOverlay
          isOpen={isTourMode}
          slideIndex={tour.slideIndex}
          currentSlide={tour.currentSlide}
          progress={tour.progress}
          isPaused={tour.isPaused}
          totalSlides={tour.totalSlides}
          language={language}
          t={storyT}
          onClose={tour.endTour}
          onGoToSlide={tour.goToSlide}
          onNext={tour.nextSlide}
          onPrev={tour.prevSlide}
          onTogglePause={tour.togglePause}
          onTouchStart={tour.handleTouchStart}
          onTouchEnd={tour.handleTouchEnd}
          onScreenTap={tour.handleScreenTap}
        />
      )}
    </>
  );
}
