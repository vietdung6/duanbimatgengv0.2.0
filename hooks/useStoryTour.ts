import { useState, useEffect, useRef, useCallback } from "react";
import { storySlides, SLIDE_DURATION } from "@/lib/data/storySlides";

interface UseStoryTourProps {
    isTourMode: boolean;
    setIsTourMode: (value: boolean) => void;
    setExpandedYear: (year: number | null) => void;
    setCurrentTourYear: (year: number | null) => void;
}

export function useStoryTour({
    isTourMode,
    setIsTourMode,
    setExpandedYear,
    setCurrentTourYear,
}: UseStoryTourProps) {
    const [slideIndex, setSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);
    const touchStartX = useRef<number | null>(null);

    const safeSlideIndex = Math.max(0, Math.min(slideIndex, storySlides.length - 1));
    const currentSlide = storySlides[safeSlideIndex]!;

    // Track mounted state for portal
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Progress bar animation
    useEffect(() => {
        if (!isTourMode || isPaused) {
            if (progressInterval.current) clearInterval(progressInterval.current);
            return;
        }

        setProgress(0);
        const startTime = Date.now();

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                if (slideIndex < storySlides.length - 1) {
                    setSlideIndex(prev => prev + 1);
                } else {
                    endTour();
                }
            }
        }, 50);

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [isTourMode, slideIndex, isPaused]);

    // Lock body scroll
    useEffect(() => {
        if (isTourMode) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isTourMode]);

    const goToSlide = useCallback((index: number) => {
        const clamped = Math.max(0, Math.min(storySlides.length - 1, index));
        setSlideIndex(clamped);
        setProgress(0);
        const slide = storySlides[clamped];
        if (slide) {
            setCurrentTourYear(slide.year);
            setExpandedYear(slide.year);
        }
    }, [setCurrentTourYear, setExpandedYear]);

    const nextSlide = useCallback(() => {
        if (slideIndex < storySlides.length - 1) {
            goToSlide(slideIndex + 1);
        } else {
            endTour();
        }
    }, [slideIndex, goToSlide]);

    const prevSlide = useCallback(() => {
        if (slideIndex > 0) goToSlide(slideIndex - 1);
    }, [slideIndex, goToSlide]);

    const startTour = useCallback(() => {
        setIsTourMode(true);
        setSlideIndex(0);
        setProgress(0);
        setIsPaused(false);
        const firstSlide = storySlides[0];
        if (firstSlide) {
            setCurrentTourYear(firstSlide.year);
            setExpandedYear(firstSlide.year);
        }
    }, [setIsTourMode, setCurrentTourYear, setExpandedYear]);

    const endTour = useCallback(() => {
        setIsTourMode(false);
        setSlideIndex(0);
        setProgress(0);
        setCurrentTourYear(null);
    }, [setIsTourMode, setCurrentTourYear]);

    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        if (touch) touchStartX.current = touch.clientX;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touch = e.changedTouches[0];
        if (!touch) return;
        const diff = touchStartX.current - touch.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        touchStartX.current = null;
    }, [nextSlide, prevSlide]);

    const handleScreenTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        if (x < width * 0.3) prevSlide();
        else if (x > width * 0.7) nextSlide();
        else togglePause();
    }, [prevSlide, nextSlide, togglePause]);

    return {
        slideIndex,
        currentSlide,
        progress,
        isPaused,
        mounted,
        startTour,
        endTour,
        goToSlide,
        nextSlide,
        prevSlide,
        togglePause,
        handleTouchStart,
        handleTouchEnd,
        handleScreenTap,
        totalSlides: storySlides.length,
    };
}
