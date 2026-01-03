"use client";

import { X } from "lucide-react";

interface ActiveFiltersProps {
  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;
  resultFilter: 'all' | 'win' | 'loss';
  setResultFilter: (filter: 'all' | 'win' | 'loss') => void;
  selectedYears: string[];
  setSelectedYears: (years: string[]) => void;
  selectedTournaments: string[];
  setSelectedTournaments: (ids: string[]) => void;
  selectedTeams: string[];
  setSelectedTeams: (ids: string[]) => void;
  selectedOpponents: string[];
  setSelectedOpponents: (ids: string[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (ids: string[]) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  tournaments: { id: string; name: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export function ActiveFilters({
  sortOrder,
  setSortOrder,
  resultFilter,
  setResultFilter,
  selectedYears,
  setSelectedYears,
  selectedTournaments,
  setSelectedTournaments,
  selectedTeams,
  setSelectedTeams,
  selectedOpponents,
  setSelectedOpponents,
  selectedPlayers,
  setSelectedPlayers,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  tournaments,
  searchQuery,
  setSearchQuery,
  limit,
  setLimit
}: ActiveFiltersProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="hidden md:flex items-center gap-2 ml-4 flex-grow overflow-x-auto custom-scrollbar no-scrollbar py-1">
      {startDate && (
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-gold/5 border border-gold/20 text-[9px] text-gold whitespace-nowrap">
          Từ: {formatDate(startDate)} <X className="w-2 h-2 cursor-pointer hover:text-white" onClick={() => setStartDate("")} />
        </span>
      )}
      {endDate && (
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-gold/5 border border-gold/20 text-[9px] text-gold whitespace-nowrap">
          Đến: {formatDate(endDate)} <X className="w-2 h-2 cursor-pointer hover:text-white" onClick={() => setEndDate("")} />
        </span>
      )}
      {sortOrder !== 'newest' && (
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-gray-400 whitespace-nowrap">
          Cũ nhất <X className="w-2 h-2 cursor-pointer hover:text-gold" onClick={() => setSortOrder('newest')} />
        </span>
      )}
      {resultFilter !== 'all' && (
        <span className={`flex items-center gap-1 px-2 py-1 rounded border text-[9px] whitespace-nowrap ${
          resultFilter === 'win' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {resultFilter === 'win' ? 'Thắng' : 'Thua'} <X className="w-2 h-2 cursor-pointer hover:text-white" onClick={() => setResultFilter('all')} />
        </span>
      )}
      {selectedYears.map(y => (
        <span key={y} className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-gray-400 whitespace-nowrap">
          {y} <X className="w-2 h-2 cursor-pointer hover:text-gold" onClick={() => setSelectedYears(selectedYears.filter(year => year !== y))} />
        </span>
      ))}
      {selectedTournaments.map(tId => (
        <span key={tId} className="flex items-center gap-1 px-2 py-1 rounded bg-gold/5 border border-gold/20 text-[9px] text-gold whitespace-nowrap">
          {tournaments.find(t => t.id === tId)?.name} <X className="w-2 h-2 cursor-pointer hover:text-white" onClick={() => setSelectedTournaments(selectedTournaments.filter(id => id !== tId))} />
        </span>
      ))}
      {selectedTeams.map(teamId => {
        const teamNames: { [key: string]: string } = {
          'geng': 'Gen.G',
          'ssg': 'Samsung Galaxy',
          'ssw_sso': 'Samsung White/Ozone',
          'ssb': 'Samsung Blue'
        };
        return (
          <span key={teamId} className="flex items-center gap-1 px-2 py-1 rounded bg-gold/10 border border-gold/30 text-[9px] text-gold whitespace-nowrap font-bold">
            {teamNames[teamId]} <X className="w-2 h-2 cursor-pointer hover:text-white" onClick={() => setSelectedTeams(selectedTeams.filter(id => id !== teamId))} />
          </span>
        );
      })}
      {selectedOpponents.map(oppName => (
        <span key={oppName} className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-gray-300 whitespace-nowrap">
          Đấu với: {oppName} <X className="w-2 h-2 cursor-pointer hover:text-red-500" onClick={() => setSelectedOpponents(selectedOpponents.filter(name => name !== oppName))} />
        </span>
      ))}
      {selectedOpponents.map(oppId => (
        <span key={oppId} className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-gray-400 whitespace-nowrap">
          Vs {oppId} <X className="w-2 h-2 cursor-pointer hover:text-gold" onClick={() => setSelectedOpponents(selectedOpponents.filter(id => id !== oppId))} />
        </span>
      ))}
      {selectedPlayers.map(pId => (
        <span key={pId} className="flex items-center gap-1 px-2 py-1 rounded bg-gold/5 border border-gold/20 text-[9px] text-gold whitespace-nowrap">
          Player: {pId} <X className="w-2 h-2 cursor-pointer hover:text-white" onClick={() => setSelectedPlayers(selectedPlayers.filter(id => id !== pId))} />
        </span>
      ))}
      {searchQuery && (
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-white whitespace-nowrap italic">
          "{searchQuery}" <X className="w-2 h-2 cursor-pointer hover:text-red-500" onClick={() => setSearchQuery("")} />
        </span>
      )}
      {limit > 0 && (
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-gold/10 border border-gold/30 text-[9px] text-gold whitespace-nowrap">
          {limit} trận <X className="w-2 h-2 cursor-pointer hover:text-white" onClick={() => setLimit(0)} />
        </span>
      )}
    </div>
  );
}
