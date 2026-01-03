"use client";

import { Check, Users } from "lucide-react";
import { FilterSection } from "../FilterSection";

interface TeamFilterProps {
  pendingTeams: string[];
  togglePendingTeam: (id: string) => void;
  isTeamOpen: boolean;
  setIsTeamOpen: (val: boolean) => void;
}

export function TeamFilter({
  pendingTeams,
  togglePendingTeam,
  isTeamOpen,
  setIsTeamOpen
}: TeamFilterProps) {
  const isSamsungSelected = ['ssg', 'ssw_sso', 'ssb'].every(opt => pendingTeams.includes(opt));
  const isAnySamsungSelected = ['ssg', 'ssw_sso', 'ssb'].some(opt => pendingTeams.includes(opt));

  return (
    <FilterSection
      label="Đội tuyển / Thời kỳ"
      icon={<Users className="w-3 h-3" />}
      isOpen={isTeamOpen}
      onToggle={() => setIsTeamOpen(!isTeamOpen)}
      badgeCount={pendingTeams.length}
    >
      <div className="space-y-2 mt-3">
        <button
          onClick={() => togglePendingTeam('all')}
          className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[9px] font-heading transition-all border ${
            pendingTeams.length === 0 
              ? "bg-gold/10 text-gold border-gold/50" 
              : "text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/5"
          }`}
        >
          <span>Tất cả đội tuyển</span>
          {pendingTeams.length === 0 && <Check className="w-2.5 h-2.5" />}
        </button>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={() => togglePendingTeam('geng')}
            className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[9px] font-heading transition-all border ${
              pendingTeams.includes('geng') 
                ? "bg-gold/10 text-gold border-gold/50 font-bold" 
                : "text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <span>Gen.G</span>
            {pendingTeams.includes('geng') && <Check className="w-2.5 h-2.5" />}
          </button>

          <button
            onClick={() => togglePendingTeam('samsung')}
            className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[9px] font-heading transition-all border ${
              isSamsungSelected 
                ? "bg-gold/10 text-gold border-gold/50 font-bold" 
                : isAnySamsungSelected
                  ? "bg-gold/5 text-gold/70 border-gold/20"
                  : "text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <span>Samsung</span>
            {isSamsungSelected && <Check className="w-2.5 h-2.5" />}
          </button>
        </div>

        {/* Sub-options for Samsung */}
        <div className="pl-4 space-y-2 border-l border-white/10 mt-2">
          <button
            onClick={() => togglePendingTeam('ssg')}
            className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[8px] font-heading transition-all border ${
              pendingTeams.includes('ssg') 
                ? "bg-gold/10 text-gold border-gold/50" 
                : "text-gray-500 border-transparent hover:border-white/10 hover:bg-white/5"
            }`}
          >
            <span>Samsung Galaxy</span>
            {pendingTeams.includes('ssg') && <Check className="w-2 h-2" />}
          </button>
          <button
            onClick={() => togglePendingTeam('ssw_sso')}
            className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[8px] font-heading transition-all border ${
              pendingTeams.includes('ssw_sso') 
                ? "bg-gold/10 text-gold border-gold/50" 
                : "text-gray-500 border-transparent hover:border-white/10 hover:bg-white/5"
            }`}
          >
            <span>Samsung White/Ozone</span>
            {pendingTeams.includes('ssw_sso') && <Check className="w-2 h-2" />}
          </button>
          <button
            onClick={() => togglePendingTeam('ssb')}
            className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[8px] font-heading transition-all border ${
              pendingTeams.includes('ssb') 
                ? "bg-gold/10 text-gold border-gold/50" 
                : "text-gray-500 border-transparent hover:border-white/10 hover:bg-white/5"
            }`}
          >
            <span>Samsung Blue</span>
            {pendingTeams.includes('ssb') && <Check className="w-2 h-2" />}
          </button>
        </div>
      </div>
    </FilterSection>
  );
}
