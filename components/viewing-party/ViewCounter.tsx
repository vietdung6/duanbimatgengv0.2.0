"use client";

import { useViewingParty } from "./ViewingPartyContext";
import { Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ViewCounter() {
  const { viewCount } = useViewingParty();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-gold/20 shadow-sm" title={t.viewingParty.liveViewers}>
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/50 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
        </span>
        <span className="text-[10px] font-bold text-gold tracking-wider">LIVE</span>
      </div>
      <div className="w-px h-3 bg-gold/20 mx-0.5" />
      <div className="flex items-center gap-1.5">
        <Users size={14} className="text-gold/80" />
        <span className="text-xs font-mono font-bold text-white tabular-nums">
          {viewCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
