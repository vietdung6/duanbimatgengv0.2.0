"use client";

import { Check, Trophy } from "lucide-react";
import { FilterSection } from "../FilterSection";

interface TournamentFilterProps {
  pendingTournaments: string[];
  togglePendingTournament: (id: string) => void;
  tournaments: { id: string; name: string }[];
  isTournamentOpen: boolean;
  setIsTournamentOpen: (val: boolean) => void;
}

export function TournamentFilter({
  pendingTournaments,
  togglePendingTournament,
  tournaments,
  isTournamentOpen,
  setIsTournamentOpen
}: TournamentFilterProps) {
  return (
    <FilterSection
      label="Giải đấu"
      icon={<Trophy className="w-3 h-3" />}
      isOpen={isTournamentOpen}
      onToggle={() => setIsTournamentOpen(!isTournamentOpen)}
      badgeCount={pendingTournaments.length}
    >
      <div className="space-y-2 mt-3">
        <button
          onClick={() => togglePendingTournament('all')}
          className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-[9px] font-heading transition-all border ${
            pendingTournaments.length === 0 
              ? "bg-gold/10 text-gold border-gold/50" 
              : "text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/5"
          }`}
        >
          <span>Tất cả giải đấu</span>
          {pendingTournaments.length === 0 && <Check className="w-2.5 h-2.5" />}
        </button>
        <div className="grid grid-cols-2 gap-2">
          {tournaments.map(t => (
            <button
              key={t.id}
              onClick={() => togglePendingTournament(t.id)}
              className={`flex items-center justify-between py-1.5 px-3 rounded-lg text-[9px] font-heading transition-all border ${
                pendingTournaments.includes(t.id) 
                  ? "bg-gold/10 text-gold border-gold/50" 
                  : "text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <span>{t.name}</span>
              {pendingTournaments.includes(t.id) && <Check className="w-2.5 h-2.5" />}
            </button>
          ))}
        </div>
      </div>
    </FilterSection>
  );
}
