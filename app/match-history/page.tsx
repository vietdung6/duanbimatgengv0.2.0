"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HeroSection } from "./components/HeroSection";
import { FilterBar } from "./components/FilterBar";
import { MatchCard } from "./components/MatchCard";
import { EmptyState } from "./components/EmptyState";

export default function MatchHistoryPage() {
  const { t } = useLanguage();
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedOpponents, setSelectedOpponents] = useState<string[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [resultFilter, setResultFilter] = useState<'all' | 'win' | 'loss'>('all');
  const [viewMode, setViewMode] = useState<'full' | 'simple'>('full');
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch("/api/admin/schedule");
        const data = await response.json();
        setAllMatches(data.recentResults || []);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  const years = useMemo(() => {
    return Array.from(new Set(allMatches.map(series => new Date(series.match_date).getFullYear().toString()))).sort((a, b) => b.localeCompare(a));
  }, [allMatches]);

  const tournaments = useMemo(() => {
    const mainTournaments = ['LCK', 'Worlds', 'MSI', 'EWC'];
    const foundTournaments = new Set<string>();

    allMatches.forEach(series => {
      mainTournaments.forEach(t => {
        if (series.tournament.includes(t)) foundTournaments.add(t);
      });
    });

    const list = Array.from(foundTournaments).map(t => ({ id: t, name: t }));
    list.push({ id: 'Other', name: 'Khác' });
    return list;
  }, [allMatches]);

  const allOpponents = useMemo(() => {
    const opponents = Array.from(new Set(allMatches.map(series => series.opponent_name))).sort();
    return opponents.map(name => ({ id: name, name }));
  }, [allMatches]);

  // Helper function to parse lineup safely
  const parseLineup = (lineup: any): any[] => {
    if (!lineup) return [];
    if (Array.isArray(lineup)) return lineup;
    if (typeof lineup === 'string') {
      try {
        const parsed = JSON.parse(lineup);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const allPlayers = useMemo(() => {
    const playerSet = new Set<string>();
    allMatches.forEach(series => {
      const lineup = parseLineup(series.lineup);
      lineup.forEach((p: any) => {
        if (typeof p === 'string') playerSet.add(p);
        else if (p.player) playerSet.add(p.player);
      });
    });
    return Array.from(playerSet).sort().map(name => ({ id: name, name }));
  }, [allMatches]);

  const { filteredSeries, totalFilteredCount } = useMemo(() => {
    let result = allMatches.filter(series => {
      const matchDate = new Date(series.match_date);
      const matchYearNum = matchDate.getFullYear();
      const matchYear = matchYearNum.toString();

      // Filter by Year
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(matchYear);

      // Filter by Date Range
      let matchesDateRange = true;
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && matchDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && matchDate <= end;
      }

      // Filter by Tournament
      const matchesTournament = selectedTournaments.length === 0 || selectedTournaments.some(t => {
        if (t === 'Other') {
          return !['LCK', 'Worlds', 'MSI', 'EWC'].some(key => series.tournament.includes(key));
        }
        return series.tournament.includes(t);
      });

      // Filter by Opponent
      const matchesOpponent = selectedOpponents.length === 0 || selectedOpponents.includes(series.opponent_name);

      // Filter by Team
      const matchesTeam = selectedTeams.length === 0 || selectedTeams.some(teamId => {
        if (teamId === 'geng') {
          return (series.home_team_name && series.home_team_name.includes('Gen.G')) || matchYearNum >= 2018;
        }
        if (teamId === 'ssg') {
          return (series.home_team_name && series.home_team_name.includes('Galaxy')) || (matchYearNum >= 2015 && matchYearNum <= 2017);
        }
        if (teamId === 'ssw_sso') {
          return (series.home_team_name && (series.home_team_name.includes('White') || series.home_team_name.includes('Ozone'))) ||
            (!series.home_team_name && matchYearNum >= 2013 && matchYearNum <= 2014); // Fallback if no home_team_name
        }
        if (teamId === 'ssb') {
          return (series.home_team_name && series.home_team_name.includes('Blue')) ||
            (!series.home_team_name && matchYearNum >= 2013 && matchYearNum <= 2014); // Warning: This fallback overlaps with White/Ozone
        }
        return false;
      });

      // Filter by Player
      const matchesPlayer = selectedPlayers.length === 0 || selectedPlayers.includes('all') || (() => {
        const lineup = parseLineup(series.lineup);
        return lineup.some((p: any) => {
          const playerName = typeof p === 'string' ? p : p.player;
          return selectedPlayers.includes(playerName);
        });
      })();

      // Filter by Search
      const matchesSearch = series.opponent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        series.tournament.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by Result
      const matchesResult = resultFilter === 'all' || series.match_result === resultFilter;

      return matchesYear && matchesDateRange && matchesTournament && matchesOpponent && matchesTeam && matchesPlayer && matchesSearch && matchesResult;
    });

    // Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.match_date).getTime();
      const dateB = new Date(b.match_date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const totalFilteredCount = result.length;

    // Apply Limit
    if (limit > 0) {
      result = result.slice(0, limit);
    }

    return { filteredSeries: result, totalFilteredCount };
  }, [allMatches, selectedYears, startDate, endDate, selectedTournaments, selectedOpponents, selectedTeams, selectedPlayers, searchQuery, sortOrder, resultFilter, limit]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <HeroSection />

      <div className="relative z-30">
        <FilterBar
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
          allOpponents={allOpponents}
          allPlayers={allPlayers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          years={years}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          resultFilter={resultFilter}
          setResultFilter={setResultFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          limit={limit}
          setLimit={setLimit}
        />
      </div>

      <section className="container mx-auto px-4 relative z-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-heading uppercase tracking-widest">{t.matchHistory.loading}</p>
          </div>
        ) : (
          <div className={viewMode === 'simple' ? "space-y-2" : "grid gap-3"}>
            {filteredSeries.length > 0 ? (
              filteredSeries.map((series, index) => (
                <MatchCard
                  key={series.id}
                  series={series}
                  index={index}
                  viewMode={viewMode}
                />
              ))
            ) : (
              <EmptyState onReset={() => {
                setSelectedYears([]);
                setSelectedTournaments([]);
                setSelectedTeams([]);
                setSelectedOpponents([]);
                setSelectedPlayers([]);
                setStartDate("");
                setEndDate("");
                setSearchQuery("");
                setResultFilter('all');
                setLimit(10);
              }} />
            )}

            {/* Load More Button */}
            {!loading && totalFilteredCount > limit && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setLimit(prev => prev + 10)}
                  className="group relative px-8 py-3 bg-black border border-gold/30 rounded-full overflow-hidden transition-all hover:border-gold"
                >
                  <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative font-heading text-sm text-gold tracking-widest uppercase">
                    {t.matchHistory.loadMore.replace('{count}', (totalFilteredCount - limit).toString())}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
