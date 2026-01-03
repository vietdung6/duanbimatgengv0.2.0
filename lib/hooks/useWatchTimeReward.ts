"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { rewardWatchTime } from "@/lib/actions/viewing-party-rewards";
import { useToast } from "@/components/ui/ToastContext";

export const REWARD_INTERVAL = 1800; // 30 minutes

export function useWatchTimeReward(
  sessionId: number, 
  isUserLoggedIn: boolean,
  sessionStatus: "scheduled" | "live" | "ended"
) {
  const { showToast } = useToast();
  // Timer starts from full interval
  const [timeLeft, setTimeLeft] = useState(REWARD_INTERVAL);
  const [canClaim, setCanClaim] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run if user is logged in and session is live
    if (!isUserLoggedIn || sessionStatus !== "live") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished
          if (timerRef.current) clearInterval(timerRef.current);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionId, isUserLoggedIn, sessionStatus, canClaim]); // Add canClaim dependency to stop interval when ready

  const claimReward = useCallback(async () => {
    if (!canClaim || isClaiming) return;

    setIsClaiming(true);
    try {
      const result = await rewardWatchTime(sessionId);
      
      if (result.success) {
        showToast(`🎉 +100 GenG Points: Thưởng xem viewing-party 30 phút!`, "success");
        // Reset timer
        setCanClaim(false);
        setTimeLeft(REWARD_INTERVAL);
        
        // Restart timer
        if (timerRef.current) clearInterval(timerRef.current);
        // Re-trigger effect by updating state implicitly or let effect handle it
        // The effect will restart because canClaim changed to false
      } else {
        showToast(result.message || "Lỗi nhận thưởng", "error");
      }
    } catch (error) {
      showToast("Có lỗi xảy ra", "error");
    } finally {
      setIsClaiming(false);
    }
  }, [canClaim, isClaiming, sessionId, showToast]);

  return {
    timeLeft,
    canClaim,
    isClaiming,
    claimReward
  };
}
