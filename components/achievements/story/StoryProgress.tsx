"use client";

import { motion } from "framer-motion";
import { X, Play, Pause } from "lucide-react";
import Image from "next/image";
import { storySlides } from "@/lib/data/storySlides";

interface StoryProgressProps {
    slideIndex: number;
    progress: number;
    isPaused: boolean;
    currentYear: number;
    headerTitle: string;
    logo: string; // Era-specific logo
    onSlideClick: (index: number) => void;
    onTogglePause: () => void;
    onClose: () => void;
}

export function StoryProgress({
    slideIndex,
    progress,
    isPaused,
    currentYear,
    headerTitle,
    logo,
    onSlideClick,
    onTogglePause,
    onClose,
}: StoryProgressProps) {
    return (
        <div className="absolute top-0 left-0 right-0 z-50 px-3 pt-4 pb-2 safe-area-inset-top bg-gradient-to-b from-black/60 to-transparent">
            {/* Progress Bars */}
            <div className="flex gap-1.5">
                {storySlides.map((_, idx) => (
                    <div
                        key={idx}
                        className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onSlideClick(idx); }}
                    >
                        <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: "0%" }}
                            animate={{
                                width: idx < slideIndex ? "100%" : idx === slideIndex ? `${progress}%` : "0%"
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Top controls */}
            <div className="flex items-center justify-between mt-4 px-1">
                <div className="flex items-center gap-3">
                    {/* Era-specific logo */}
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gold shadow-lg shadow-gold/20 bg-black/50">
                        <Image
                            src={logo}
                            alt="Team Logo"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div>
                        <span className="text-white font-bold text-sm">{headerTitle}</span>
                        <span className="text-gray-400 text-xs ml-2">{currentYear}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Pause/Play Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onTogglePause(); }}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                        aria-label={isPaused ? "Play" : "Pause"}
                    >
                        {isPaused ? <Play size={18} className="text-white ml-0.5" /> : <Pause size={18} className="text-white" />}
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/30 border border-white/20 hover:border-red-400/50 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}

