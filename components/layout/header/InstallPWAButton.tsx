"use client";

import { Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface InstallPWAButtonProps {
  mobile?: boolean;
  onInstall: () => void;
}

export default function InstallPWAButton({ mobile = false, onInstall }: InstallPWAButtonProps) {
  const { t } = useLanguage();

  if (mobile) {
    return (
      <button
        onClick={onInstall}
        className="flex items-center justify-center gap-3 mt-2 w-full px-4 py-3 rounded-lg border border-gold/70 
                 bg-black/40 text-white font-heading text-lg"
        type="button"
      >
        <Download size={20} className="text-gold" />
        <span>{t.pwa.installButton}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onInstall}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gold/70 
               bg-black/40 hover:bg-gold/10 transition-colors text-sm"
      type="button"
    >
      <Download size={16} className="text-gold" />
      <span className="text-white font-medium">
        {t.pwa.installButton}
      </span>
    </button>
  );
}
