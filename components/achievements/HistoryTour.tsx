"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HistoryTourProps {
  language: string;
  expandedYear: number | null;
  setExpandedYear: (year: number | null) => void;
  isTourMode: boolean;
  setIsTourMode: (value: boolean) => void;
  currentTourYear: number | null;
  setCurrentTourYear: (year: number | null) => void;
}

export function HistoryTour({
  language,
  expandedYear: _expandedYear,
  setExpandedYear,
  isTourMode,
  setIsTourMode,
  currentTourYear,
  setCurrentTourYear,
}: HistoryTourProps) {
  const [tourIndex, setTourIndex] = useState(0);
  const lastWheelTimeRef = useRef(0);

  // Tour stops definition
  const tourStops = [
    {
      year: 2014,
      title:
        language === "en"
          ? "Origins & Worlds 2014"
          : "Khởi nguồn & CKTG 2014",
      note:
        language === "en"
          ? "Samsung White peak: Worlds 2014 champions, Mata MVP."
          : "Đỉnh cao Samsung White: Vô địch CKTG 2014, Mata MVP.",
      highlights:
        language === "en"
          ? ["Worlds 2014 Champion", "Mata Worlds MVP", "Era-defining dominance"]
          : ["Vô địch CKTG 2014", "Mata MVP CKTG", "Thống trị vàng"],
    },
    {
      year: 2017,
      title:
        language === "en"
          ? "2017: Ending SKT Dynasty"
          : "2017: Chấm dứt triều đại SKT",
      note:
        language === "en"
          ? "Samsung Galaxy 3-0 SKT in finals, Ruler/CoreJJ shine."
          : "Samsung Galaxy 3-0 SKT ở chung kết, Ruler/CoreJJ tỏa sáng.",
      highlights:
        language === "en"
          ? ["Worlds 2017 Champion", "3-0 vs SKT", "FMVP Ruler"]
          : ["Vô địch CKTG 2017", "3-0 SKT", "FMVP Ruler"],
    },
    {
      year: 2022,
      title:
        language === "en"
          ? "Chovy Joins — New Era"
          : "Chovy gia nhập — kỷ nguyên mới",
      note:
        language === "en"
          ? "Gen.G rebuilds around Chovy for sustained contention."
          : "Gen.G tái thiết quanh Chovy, duy trì vị thế top.",
      highlights:
        language === "en"
          ? ["LCK titles resume", "Rebuild around Chovy", "New foundation for dynasty"]
          : ["Trở lại vô địch LCK", "Tái thiết xoanh quanh Chovy", "Nền móng triều đại mới"],
    },
    {
      year: 2024,
      title:
        language === "en"
          ? "4 LCKs & First International (MSI)"
          : "4 LCK liên tiếp & MSI đầu tiên",
      note:
        language === "en"
          ? "Back-to-back LCK streak plus MSI 2024 — first global trophy as Gen.G."
          : "Chuỗi LCK liên tiếp và MSI 2024 — cúp quốc tế đầu tiên với tên Gen.G.",
      highlights:
        language === "en"
          ? ["MSI 2024 Champion", "LCK streak", "Peyz/Lehends breakout"]
          : ["Vô địch MSI 2024", "Chuỗi LCK liên tiếp", "Peyz/Lehends bùng nổ"],
    },
    {
      year: 2025,
      title:
        language === "en"
          ? "2025 Triple Crowns"
          : "2025: Bộ ba danh hiệu",
      note:
        language === "en"
          ? "MSI + EWC + LCK Regular — asserting supremacy."
          : "MSI + EWC + LCK Regular — khẳng định vị thế.",
      highlights:
        language === "en"
          ? ["MSI 2025 Champion", "EWC 2025 Champion", "Regular Season title"]
          : ["Vô địch MSI 2025", "Vô địch EWC 2025", "Vô địch Regular"],
    },
  ];

  const tourYears = tourStops.map((s) => s.year);

  const scrollToYear = (year: number) => {
    const el = document.getElementById(`year-${year}`);
    if (!el) return;
    const doScroll = () => {
      const top = el.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top, behavior: "smooth" });
    };
    doScroll();
    requestAnimationFrame(() => {
      setTimeout(doScroll, 80);
    });
  };

  const goTour = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(tourYears.length - 1, nextIndex));
    setTourIndex(clamped);
    const year = tourYears[clamped] ?? null;
    setCurrentTourYear(year);
    if (year !== null) {
      setExpandedYear(year);
      scrollToYear(year);
    }
  };

  const startTour = () => {
    setIsTourMode(true);
    setTourIndex(0);
    const firstYear = tourYears[0] ?? null;
    setCurrentTourYear(firstYear);
    if (firstYear !== null) {
      setExpandedYear(firstYear);
      scrollToYear(firstYear);
    }
  };

  const endTour = () => {
    setIsTourMode(false);
    setTourIndex(0);
    setCurrentTourYear(null);
  };

  // Scroll wheel navigation while tour mode on
  useEffect(() => {
    if (!isTourMode) return;
    const handler = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 500) return;
      if (Math.abs(e.deltaY) < 20) return;
      lastWheelTimeRef.current = now;
      if (e.deltaY > 0) {
        goTour(tourIndex + 1);
      } else {
        goTour(tourIndex - 1);
      }
    };
    window.addEventListener("wheel", handler, { passive: true });
    return () => window.removeEventListener("wheel", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTourMode, tourIndex]);

  return (
    <>
      {/* CTA under hero text */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.75 }}
      >
        <button
          onClick={startTour}
          className="btn-gold flex items-center gap-2 text-sm sm:text-base px-4 sm:px-5 py-2 sm:py-3 w-full sm:w-auto justify-center"
        >
          <img
            src="/images/genrang_emote.png"
            alt="Genrang"
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
          />
          {language === "en" ? "History Tour" : "Tham quan lịch sử"}
        </button>
        <span className="text-gray-400 text-xs sm:text-sm text-center">
          {language === "en"
            ? "Walk through our eras on this page."
            : "Đi qua các kỷ nguyên ngay trên trang này."}
        </span>
      </motion.div>

      {/* Floating tour controls */}
      {isTourMode && (
        <div className="fixed bottom-4 right-4 z-[90]">
          <div className="bg-black/85 border border-gold/30 rounded-2xl shadow-lg p-4 flex flex-col gap-3 backdrop-blur-md max-w-sm">
            <div>
              <div className="text-gold text-xs font-semibold uppercase tracking-wide">
                {language === "en" ? "History Tour" : "Tham quan lịch sử"}
              </div>
              <div className="text-white font-heading text-lg">
                {tourStops[tourIndex]?.title}
              </div>
              <div className="text-gray-400 text-sm">
                {tourStops[tourIndex]?.note}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {tourStops[tourIndex]?.highlights.map((h, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-full bg-gold/10 text-gold text-xs"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                {tourYears.map((year, idx) => (
                  <button
                    key={year}
                    onClick={() => goTour(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentTourYear === year ? "w-6 bg-gold" : "w-2 bg-gray-600"
                    }`}
                    aria-label={`Year ${year}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goTour(tourIndex - 1)}
                  disabled={tourIndex === 0}
                  className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
                    tourIndex === 0
                      ? "border-gray-700 text-gray-600 cursor-not-allowed"
                      : "border-gold/40 text-white hover:border-gold"
                  }`}
                >
                  {language === "en" ? "Back" : "Trước"}
                </button>
                <button
                  onClick={() => {
                    if (tourIndex === tourYears.length - 1) {
                      endTour();
                    } else {
                      goTour(tourIndex + 1);
                    }
                  }}
                  className="btn-gold px-3 py-2 text-xs"
                >
                  {tourIndex === tourYears.length - 1
                    ? language === "en"
                      ? "Finish"
                      : "Kết thúc"
                    : language === "en"
                      ? "Next"
                      : "Tiếp"}
                </button>
                <button
                  onClick={endTour}
                  className="text-gray-400 hover:text-white text-sm px-2"
                  aria-label="Close tour"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

