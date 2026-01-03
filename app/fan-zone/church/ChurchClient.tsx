"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import BlessingModal from "./BlessingModal";
import ChurchBackground from "./components/ChurchBackground";
import AltarContainer from "./components/AltarContainer";
import AltarHeader from "./components/AltarHeader";
import PrayInterface from "./components/PrayInterface";

import { AuthUser } from "@/lib/auth";

interface ChurchClientProps {
  initialHasPrayed: boolean;
  initialStreak: number;
  user: AuthUser;
}

export default function ChurchClient({ initialHasPrayed, initialStreak, user: _user }: ChurchClientProps) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useLanguage();
  const [candlesLit, setCandlesLit] = useState(0);
  const [showBlessing, setShowBlessing] = useState(false);
  const [hasPrayedToday, setHasPrayedToday] = useState(initialHasPrayed);
  const [streak, setStreak] = useState(initialStreak);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState("");
  const [mounted, setMounted] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  // Countdown timer logic
  useEffect(() => {
    setMounted(true);
    const updateTimer = () => {
      const now = new Date();

      // Calculate Next Reset Time (00:01 VN Time)
      const vnOffset = 7 * 60 * 60 * 1000;
      const vnTime = new Date(now.getTime() + vnOffset);

      const vnYear = vnTime.getUTCFullYear();
      const vnMonth = vnTime.getUTCMonth();
      const vnDay = vnTime.getUTCDate();

      // Construct Today 00:01 VN (as UTC timestamp shifted)
      const nextResetVN = new Date(Date.UTC(vnYear, vnMonth, vnDay, 0, 1, 0, 0));

      // If we are past today's reset, set target to tomorrow
      if (vnTime.getTime() >= nextResetVN.getTime()) {
        nextResetVN.setDate(nextResetVN.getDate() + 1);
      }

      // Convert back to real UTC timestamp
      const targetTime = new Date(nextResetVN.getTime() - vnOffset);

      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilReset("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(timer);
  }, []);

  const handlePray = async () => {
    if (loading) return;

    if (!hasPrayedToday) {
      setLoading(true);
      setMessage(null);

      try {
        const res = await fetch("/api/church/pray", {
          method: "POST",
        });
        const result = await res.json();

        if (result.success) {
          setHasPrayedToday(true);
          setStreak(result.streak);
          setJustClaimed(true);
          // Animate candles one by one quickly
          for (let i = 1; i <= 10; i++) {
            setCandlesLit(i);
            await new Promise(r => setTimeout(r, 100));
          }

          setShowBlessing(true);
          setMessage(result.message);
          router.refresh();
        } else {
          setMessage(result.message);
        }
      } catch {
        setMessage("Có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    } else {
      // Fun interaction for already prayed users
      const newCount = candlesLit + 1;
      setCandlesLit(newCount);
      setJustClaimed(false);

      if (newCount === 10) {
        setShowBlessing(true);
      }
    }
  };

  const resetCandles = () => {
    setCandlesLit(0);
    setMessage(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 relative overflow-hidden bg-black selection:bg-gold/30 flex items-center">
      <ChurchBackground mounted={mounted} />

      <div className="container mx-auto px-4 relative z-10 max-w-3xl w-full">
        <AltarContainer>
          <AltarHeader />
          <PrayInterface
            hasPrayedToday={hasPrayedToday}
            candlesLit={candlesLit}
            loading={loading}
            timeUntilReset={timeUntilReset}
            message={message}
            onPray={handlePray}
            onReset={resetCandles}
            streak={streak}
          />
        </AltarContainer>
      </div>

      {/* Blessing Modal Overlay */}
      <BlessingModal
        show={showBlessing}
        onClose={() => setShowBlessing(false)}
        justClaimed={justClaimed}
      />
    </div>
  );
}
