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
        <motion.button
          onClick={tour.startTour}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-black/60 backdrop-blur-lg border border-gold/30 rounded-full overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />

          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gold/30 p-1 bg-black/50 group-hover:border-gold transition-colors">
              <Image src="/images/genrang_emote.png" alt="Genrang" fill className="object-contain p-1" sizes="40px" />
            </div>

            <div className="text-left flex flex-col justify-center">
              <span className="font-heading text-lg sm:text-xl text-white group-hover:text-gold transition-colors leading-none tracking-wide uppercase">
                {storyT.buttonText}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">
                Interactive Mode
              </span>
            </div>

            <div className="w-5 h-5 sm:w-6 sm:h-6 text-gold/50 group-hover:text-gold transition-colors border-l border-white/10 pl-3 sm:pl-4 ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            </div>
          </div>
        </motion.button>
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
