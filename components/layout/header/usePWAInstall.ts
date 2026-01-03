"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Typed beforeinstallprompt event used for PWA install
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const router = useRouter();

  // Capture beforeinstallprompt event for Android / supported browsers
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      // Store event so we can trigger it later
      setDeferredPrompt(e);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    // If native PWA prompt is available (Android / supported browsers), trigger it
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } finally {
        setDeferredPrompt(null);
      }
      return;
    }

    // Fallback: navigate to the PWA instructions page
    router.push("/pwa");
  };

  return { handleInstallClick };
}
