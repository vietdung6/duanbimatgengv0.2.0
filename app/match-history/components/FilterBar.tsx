"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, Filter } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { FilterMenu } from "./filters/FilterMenu";
import { OptionsMenu } from "./filters/OptionsMenu";
import { ActiveFilters } from "./filters/ActiveFilters";

interface FilterBarProps {
  selectedYears: string[];
  setSelectedYears: (years: string[]) => void;
  selectedTournaments: string[];
  setSelectedTournaments: (tournaments: string[]) => void;
  selectedTeams: string[];
  setSelectedTeams: (teams: string[]) => void;
  selectedOpponents: string[];
  setSelectedOpponents: (opponents: string[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  tournaments: { id: string, name: string }[];
  allOpponents: { id: string, name: string }[];
  allPlayers: { id: string, name: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  years: string[];
  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;
  resultFilter: 'all' | 'win' | 'loss';
  setResultFilter: (filter: 'all' | 'win' | 'loss') => void;
  viewMode: 'full' | 'simple';
  setViewMode: (mode: 'full' | 'simple') => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export function FilterBar({ 
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
  allOpponents,
  allPlayers,
  searchQuery, 
  setSearchQuery, 
  years,
  sortOrder,
  setSortOrder,
  resultFilter,
  setResultFilter,
  viewMode,
  setViewMode,
  limit,
  setLimit
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isTournamentOpen, setIsTournamentOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isOpponentOpen, setIsOpponentOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  const [pendingYears, setPendingYears] = useState<string[]>(selectedYears);
  const [pendingTournaments, setPendingTournaments] = useState<string[]>(selectedTournaments);
  const [pendingTeams, setPendingTeams] = useState<string[]>(selectedTeams);
  const [pendingOpponents, setPendingOpponents] = useState<string[]>(selectedOpponents);
  const [pendingPlayers, setPendingPlayers] = useState<string[]>(selectedPlayers);
  const [pendingStartDate, setPendingStartDate] = useState(startDate);
  const [pendingEndDate, setPendingEndDate] = useState(endDate);
  const [pendingSearch, setPendingSearch] = useState(searchQuery);
  const [pendingSortOrder, setPendingSortOrder] = useState<'newest' | 'oldest'>(sortOrder);
  const [pendingResultFilter, setPendingResultFilter] = useState<'all' | 'win' | 'loss'>(resultFilter);
  const [pendingViewMode, setPendingViewMode] = useState<'full' | 'simple'>(viewMode);
  const [pendingLimit, setPendingLimit] = useState<number>(limit);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Đồng bộ pending state khi props thay đổi
  useEffect(() => {
    setPendingYears(selectedYears);
    setPendingTournaments(selectedTournaments);
    setPendingTeams(selectedTeams);
    setPendingOpponents(selectedOpponents);
    setPendingPlayers(selectedPlayers);
    setPendingStartDate(startDate);
    setPendingEndDate(endDate);
    setPendingSearch(searchQuery);
    setPendingSortOrder(sortOrder);
    setPendingResultFilter(resultFilter);
    setPendingViewMode(viewMode);
    setPendingLimit(limit);
  }, [selectedYears, selectedTournaments, selectedTeams, selectedOpponents, startDate, endDate, searchQuery, sortOrder, resultFilter, viewMode, limit]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePendingYear = (year: string) => {
    if (year === 'all') {
      setPendingYears([]);
      return;
    }
    setPendingYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const togglePendingTournament = (id: string) => {
    if (id === 'all') {
      setPendingTournaments([]);
      return;
    }
    setPendingTournaments(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const togglePendingTeam = (id: string) => {
    if (id === 'all') {
      setPendingTeams([]);
      return;
    }
    
    // Nếu là 'samsung' (nút tổng), toggle tất cả các sub-options
    if (id === 'samsung') {
      const samsungSubOptions = ['ssg', 'ssw_sso', 'ssb'];
      const allSamsungSelected = samsungSubOptions.every(opt => pendingTeams.includes(opt));
      
      if (allSamsungSelected) {
        setPendingTeams(prev => prev.filter(t => !samsungSubOptions.includes(t)));
      } else {
        setPendingTeams(prev => [...new Set([...prev, ...samsungSubOptions])]);
      }
      return;
    }

    setPendingTeams(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const togglePendingOpponent = (id: string) => {
    if (id === 'all') {
      setPendingOpponents([]);
      return;
    }
    setPendingOpponents(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const togglePendingPlayer = (id: string) => {
    if (id === 'all') {
      setPendingPlayers([]);
      return;
    }
    setPendingPlayers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    setSelectedYears(pendingYears);
    setSelectedTournaments(pendingTournaments);
    setSelectedTeams(pendingTeams);
    setSelectedOpponents(pendingOpponents);
    setSelectedPlayers(pendingPlayers);
    setStartDate(pendingStartDate);
    setEndDate(pendingEndDate);
    setSearchQuery(pendingSearch);
    setSortOrder(pendingSortOrder);
    setResultFilter(pendingResultFilter);
    setViewMode(pendingViewMode);
    setLimit(pendingLimit);
    setIsOpen(false);
  };

  const handleReset = () => {
    setPendingYears([]);
    setPendingTournaments([]);
    setPendingTeams([]);
    setPendingOpponents([]);
    setPendingPlayers([]);
    setPendingStartDate("");
    setPendingEndDate("");
    setPendingSearch("");
    setPendingSortOrder('newest');
    setPendingResultFilter('all');
  };

  const activeFiltersCount = (selectedYears.length > 0 ? 1 : 0) + 
                             (selectedTournaments.length > 0 ? 1 : 0) + 
                             (selectedTeams.length > 0 ? 1 : 0) + 
                             (selectedOpponents.length > 0 ? 1 : 0) + 
                             (selectedPlayers.length > 0 ? 1 : 0) + 
                             (startDate || endDate ? 1 : 0) +
                             (searchQuery ? 1 : 0) +
                             (sortOrder !== 'newest' ? 1 : 0) +
                             (resultFilter !== 'all' ? 1 : 0);

  return (
    <section className="container mx-auto px-4 mb-8">
      <div className="flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl relative">
        <div className="flex items-center gap-2">
          {/* Nút mở bộ lọc chính */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setIsOptionsOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all font-heading uppercase tracking-wider text-[8px] md:text-[9px] overflow-hidden group ${
                isOpen || activeFiltersCount > 0 
                  ? "bg-gold text-black border-gold font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                  : "bg-black/40 text-gray-400 border-white/10 hover:border-gold/50 hover:text-white"
              }`}
            >
              <Filter className={`w-2.5 h-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              <span>Bộ lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              <ChevronRight className={`w-2 h-2 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Menu bộ lọc tổng hợp */}
            <AnimatePresence>
              {isOpen && (
                <FilterMenu
                  pendingSearch={pendingSearch}
                  setPendingSearch={setPendingSearch}
                  pendingYears={pendingYears}
                  togglePendingYear={togglePendingYear}
                  years={years}
                  isYearOpen={isYearOpen}
                  setIsYearOpen={setIsYearOpen}
                  pendingTournaments={pendingTournaments}
                  togglePendingTournament={togglePendingTournament}
                  tournaments={tournaments}
                  isTournamentOpen={isTournamentOpen}
                  setIsTournamentOpen={setIsTournamentOpen}
                  pendingTeams={pendingTeams}
                  togglePendingTeam={togglePendingTeam}
                  isTeamOpen={isTeamOpen}
                  setIsTeamOpen={setIsTeamOpen}
                  pendingOpponents={pendingOpponents}
                  togglePendingOpponent={togglePendingOpponent}
                  allOpponents={allOpponents}
                  isOpponentOpen={isOpponentOpen}
                  setIsOpponentOpen={setIsOpponentOpen}
                  pendingPlayers={pendingPlayers}
                  togglePendingPlayer={togglePendingPlayer}
                  allPlayers={allPlayers}
                  isPlayerOpen={isPlayerOpen}
                  setIsPlayerOpen={setIsPlayerOpen}
                  pendingStartDate={pendingStartDate}
                  setPendingStartDate={setPendingStartDate}
                  pendingEndDate={pendingEndDate}
                  setPendingEndDate={setPendingEndDate}
                  handleReset={handleReset}
                  handleApply={handleApply}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Nút Tùy chọn (Sort & Result) */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => {
                setIsOptionsOpen(!isOptionsOpen);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all font-heading uppercase tracking-wider text-[8px] md:text-[9px] ${
                isOptionsOpen 
                  ? "bg-white/10 text-white border-white/20" 
                  : "bg-black/40 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <span>Tùy chọn</span>
              <ChevronRight className={`w-2 h-2 transition-transform duration-300 ${isOptionsOpen ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {isOptionsOpen && (
                <OptionsMenu
                  pendingSortOrder={pendingSortOrder}
                  setPendingSortOrder={setPendingSortOrder}
                  pendingResultFilter={pendingResultFilter}
                  setPendingResultFilter={setPendingResultFilter}
                  pendingViewMode={pendingViewMode}
                setPendingViewMode={setPendingViewMode}
                pendingLimit={pendingLimit}
                setPendingLimit={setPendingLimit}
                handleApply={handleApply}
              />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hiển thị nhanh các tag đã lọc (nếu có) */}
        <ActiveFilters
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            resultFilter={resultFilter}
            setResultFilter={setResultFilter}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
            selectedTournaments={selectedTournaments}
            setSelectedTournaments={setSelectedTournaments}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            selectedOpponents={selectedOpponents}
            setSelectedOpponents={setSelectedOpponents}
            selectedPlayers={selectedPlayers}
            setSelectedPlayers={setSelectedPlayers}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            tournaments={tournaments}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            limit={limit}
            setLimit={setLimit}
          />
      </div>


      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.4); }
      `}</style>
    </section>
  );
}


