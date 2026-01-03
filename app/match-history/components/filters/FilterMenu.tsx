"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { FilterHeader } from "./sections/FilterHeader";
import { TimeFilter } from "./sections/TimeFilter";
import { TeamFilter } from "./sections/TeamFilter";
import { TournamentFilter } from "./sections/TournamentFilter";
import { OpponentFilter } from "./sections/OpponentFilter";
import { PlayerFilter } from "./sections/PlayerFilter";

interface FilterMenuProps {
  pendingSearch: string;
  setPendingSearch: (val: string) => void;
  pendingYears: string[];
  togglePendingYear: (year: string) => void;
  years: string[];
  isYearOpen: boolean;
  setIsYearOpen: (val: boolean) => void;
  pendingTournaments: string[];
  togglePendingTournament: (id: string) => void;
  tournaments: { id: string; name: string }[];
  isTournamentOpen: boolean;
  setIsTournamentOpen: (val: boolean) => void;
  pendingTeams: string[];
  togglePendingTeam: (id: string) => void;
  isTeamOpen: boolean;
  setIsTeamOpen: (val: boolean) => void;
  pendingOpponents: string[];
  togglePendingOpponent: (id: string) => void;
  allOpponents: { id: string, name: string }[];
  isOpponentOpen: boolean;
  setIsOpponentOpen: (val: boolean) => void;
  pendingPlayers: string[];
  togglePendingPlayer: (id: string) => void;
  allPlayers: { id: string, name: string }[];
  isPlayerOpen: boolean;
  setIsPlayerOpen: (val: boolean) => void;
  pendingStartDate: string;
  setPendingStartDate: (val: string) => void;
  pendingEndDate: string;
  setPendingEndDate: (val: string) => void;
  handleReset: () => void;
  handleApply: () => void;
}

export function FilterMenu({
  pendingSearch,
  setPendingSearch,
  pendingYears,
  togglePendingYear,
  years,
  isYearOpen,
  setIsYearOpen,
  pendingTournaments,
  togglePendingTournament,
  tournaments,
  isTournamentOpen,
  setIsTournamentOpen,
  pendingTeams,
  togglePendingTeam,
  isTeamOpen,
  setIsTeamOpen,
  pendingOpponents,
  togglePendingOpponent,
  allOpponents,
  isOpponentOpen,
  setIsOpponentOpen,
  pendingPlayers,
  togglePendingPlayer,
  allPlayers,
  isPlayerOpen,
  setIsPlayerOpen,
  pendingStartDate,
  setPendingStartDate,
  pendingEndDate,
  setPendingEndDate,
  handleReset,
  handleApply
}: FilterMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full left-0 mt-3 w-[300px] md:w-[380px] bg-[#0D0D0D] border border-gold/30 rounded-2xl shadow-2xl z-[100] overflow-hidden"
    >
      <FilterHeader handleReset={handleReset} handleApply={handleApply} />

      <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {/* Tìm kiếm trong menu */}
        <div className="space-y-2">
          <label className="text-[9px] font-heading text-gray-500 uppercase tracking-widest block">Từ khóa</label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-gold transition-colors" />
            <input 
              type="text"
              placeholder="Tìm đối thủ, giải đấu..."
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-[10px] text-white outline-none focus:border-gold/30 transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <TimeFilter
            pendingStartDate={pendingStartDate}
            setPendingStartDate={setPendingStartDate}
            pendingEndDate={pendingEndDate}
            setPendingEndDate={setPendingEndDate}
            pendingYears={pendingYears}
            togglePendingYear={togglePendingYear}
            years={years}
            isYearOpen={isYearOpen}
            setIsYearOpen={setIsYearOpen}
          />
          
          <TeamFilter
            pendingTeams={pendingTeams}
            togglePendingTeam={togglePendingTeam}
            isTeamOpen={isTeamOpen}
            setIsTeamOpen={setIsTeamOpen}
          />

          <TournamentFilter
            pendingTournaments={pendingTournaments}
            togglePendingTournament={togglePendingTournament}
            tournaments={tournaments}
            isTournamentOpen={isTournamentOpen}
            setIsTournamentOpen={setIsTournamentOpen}
          />

          <OpponentFilter
            pendingOpponents={pendingOpponents}
            togglePendingOpponent={togglePendingOpponent}
            allOpponents={allOpponents}
            isOpponentOpen={isOpponentOpen}
            setIsOpponentOpen={setIsOpponentOpen}
          />

          <PlayerFilter
            pendingPlayers={pendingPlayers}
            togglePendingPlayer={togglePendingPlayer}
            allPlayers={allPlayers}
            isPlayerOpen={isPlayerOpen}
            setIsPlayerOpen={setIsPlayerOpen}
          />
        </div>
      </div>
    </motion.div>
  );
}
