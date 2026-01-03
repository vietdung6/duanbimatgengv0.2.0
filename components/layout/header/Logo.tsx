"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useRef } from "react";
import { useRouter, useProgress } from "@bprogress/next";
import confetti from "canvas-confetti";

export default function Logo() {
  const router = useRouter();
  const { start, stop } = useProgress();
  const [clickCount, setClickCount] = useState(0);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    // Start progress bar immediately for feedback
    start();

    // Clear any pending navigation
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }

    setClickCount(prev => {
      const newCount = prev + 1;

      // EASTER EGG TRIGGER (3 Clicks)
      if (newCount === 3) {
        stop(); // Stop the bar since we are staying
        // 1. Confetti Explosion
        const duration = 3000;
        const end = Date.now() + duration;
        const colors = ['#D4AF37', '#000000', '#FFFFFF']; // Gold, Black, White

        (function frame() {
          const left = end - Date.now();
          if (left <= 0) return;

          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
            zIndex: 9999
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
            zIndex: 9999
          });

          requestAnimationFrame(frame);
        }());

        // 2. Toggle Tiger Cursor Mode
        document.body.classList.toggle('tiger-mode');
        const isTigerMode = document.body.classList.contains('tiger-mode');

        if (isTigerMode) {
          console.log("%c🐯 TIGER NATION MODE: ACTIVATED!", "color: orange; font-weight: bold; font-size: 20px;");
        } else {
          console.log("%c🐯 TIGER NATION MODE: DEACTIVATED.", "color: gray; font-size: 16px;");
        }

        // 3. Mobile Haptic
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 400]);
        }

        return 0; // Reset count
      } else {
        // If not yet 5 clicks, schedule navigation
        navTimeoutRef.current = setTimeout(() => {
          router.push("/");
          setClickCount(0);
        }, 300); // Reduced delay to 300ms for responsiveness

        return newCount;
      }
    });
  }, [router, start, stop]);

  return (
    <div onClick={handleLogoClick} className="flex items-center gap-3 group cursor-pointer">
      <motion.div
        className="w-12 h-12 flex items-center justify-center
                  group-hover:shadow-gold-glow transition-all duration-300 rounded-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png"
          alt="Gen.G Logo"
          className="w-12 h-12 object-contain"
          draggable={false}
        />
      </motion.div>
      <div className="hidden sm:block">
        <h1 className="font-heading text-2xl text-gold uppercase tracking-wider">Gen.G</h1>
        <p className="text-xs text-gray-400 -mt-1">FANDOM</p>
      </div>
    </div>
  );
}
