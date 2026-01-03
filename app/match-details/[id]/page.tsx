"use client";

import { useState, useEffect, use } from "react";
import { Trophy, Calendar, Clock, ChevronLeft, Star, Swords, Shield, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getHomeTeamIdentity, getIdentityLogo } from "@/lib/utils/teamIdentity";
import { GameScoreboard } from "@/components/match/GameScoreboard";

// Helper: Get logo from DB first, then fallback using name or date
function getHomeTeamLogo(match: { home_team_logo?: string | null; home_team_name?: string | null; match_date: string }): string {
  // Priority 1: Use DB logo if exists
  if (match.home_team_logo) return match.home_team_logo;

  // Priority 2: Use home_team_name to get logo
  if (match.home_team_name && match.home_team_name !== "Gen.G") {
    return getIdentityLogo(match.home_team_name);
  }

  // Priority 3: Calculate from date
  const { identity } = getHomeTeamIdentity(match.match_date);
  return getIdentityLogo(identity);
}

// Helper: Get name from DB first, then fallback to era-based calculation
function getHomeTeamName(match: { home_team_name?: string | null; match_date: string }): string {
  if (match.home_team_name && match.home_team_name !== "Gen.G") {
    return match.home_team_name;
  }
  const { identity } = getHomeTeamIdentity(match.match_date);
  return identity;
}

interface PlayerStat {
  id: number;
  player_name: string | null;
  role: string;
  team: string;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  summoner1: string | null;
  summoner2: string | null;
  damage_dealt: number | null;
  damage_taken: number | null;
}

interface Game {
  id: number;
  game_number: number;
  result: "win" | "loss";
  side: "blue" | "red";
  patch: string | null;
  vod_url: string | null;
  duration: string | null;
  player_stats?: PlayerStat[];
}

interface MatchDetails {
  id: number;
  home_team_name?: string | null;
  home_team_logo?: string | null;
  opponent_name: string;
  opponent_logo: string | null;
  match_date: string;
  tournament: string;
  stage: string | null;
  round_name: string | null;
  match_type: string;
  score_gen: number;
  score_opp: number;
  match_result: "win" | "loss" | "draw" | null;
  mvp: string | null;
  patch: string | null;
  roster: string[] | null;
  games: Game[] | null;
}

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatchDetails() {
      try {
        const response = await fetch(`/api/matches/${id}`);
        if (!response.ok) {
          throw new Error("Không thể tải thông tin trận đấu");
        }
        const data = await response.json();
        setMatch(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMatchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gold font-heading uppercase tracking-widest text-sm">Đang tải chi tiết trận đấu...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl max-w-md text-center">
          <Info className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-heading text-white mb-2 uppercase">Lỗi</h2>
          <p className="text-gray-400 mb-6">{error || "Không tìm thấy trận đấu"}</p>
          <Link
            href="/match-history"
            className="inline-flex items-center gap-2 px-6 py-2 bg-gold text-black font-bold rounded-full hover:bg-gold/80 transition-all"
          >
            <ChevronLeft size={18} />
            Quay lại Lịch sử
          </Link>
        </div>
      </div>
    );
  }

  const matchDate = new Date(match.match_date);

  // Get home team info from database with era-based fallback
  const homeTeamName = getHomeTeamName(match);
  const homeTeamLogo = getHomeTeamLogo(match);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb & Back */}
        <div className="mb-8">
          <Link
            href="/match-history"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-colors text-sm font-heading uppercase tracking-widest"
          >
            <ChevronLeft size={16} />
            Lịch sử thi đấu
          </Link>
        </div>

        {/* Match Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden mb-8"
        >
          <div className={`absolute top-0 left-0 right-0 h-1 ${match.match_result === 'win' ? 'bg-green-500' : 'bg-red-600'}`} />

          <div className="p-6 md:p-10">
            {/* Tournament Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2 text-gold text-xs md:text-sm font-heading tracking-[0.2em] mb-2 uppercase">
                <Trophy size={14} className="text-gold/50" />
                {match.tournament}
              </div>
              <h1 className="text-xl md:text-3xl font-heading text-center mb-1 uppercase tracking-wider">
                {match.stage} {match.round_name && `- ${match.round_name}`}
              </h1>
              <div className="flex items-center gap-4 text-gray-500 text-[10px] md:text-xs uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-gold/50" />
                  {matchDate.toLocaleDateString('en-GB').replace(/\//g, '-')}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-gold/50" />
                  {matchDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} KST
                </div>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="grid grid-cols-3 items-center gap-4 md:gap-8 max-w-4xl mx-auto">
              {/* Home Team */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <img
                    src={homeTeamLogo}
                    alt={homeTeamName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-heading text-sm md:text-xl uppercase tracking-wider">{homeTeamName}</span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] md:text-xs font-heading text-gray-600 tracking-widest mb-2 uppercase">
                  {match.match_type}
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <span className={`text-4xl md:text-7xl font-heading ${match.match_result === 'win' ? 'text-gold' : 'text-gray-500'}`}>
                    {match.score_gen}
                  </span>
                  <span className="text-2xl md:text-4xl text-gray-800">-</span>
                  <span className={`text-4xl md:text-7xl font-heading ${match.match_result === 'loss' ? 'text-red-500' : 'text-gray-500'}`}>
                    {match.score_opp}
                  </span>
                </div>
                <div className={`mt-4 px-4 py-1 rounded-full text-[10px] md:text-xs font-heading tracking-[0.2em] uppercase border ${match.match_result === 'win'
                  ? 'bg-green-600/10 text-green-500 border-green-600/20'
                  : 'bg-red-600/10 text-red-600 border-red-600/20'
                  }`}>
                  {match.match_result === 'win' ? 'Victory' : 'Defeat'}
                </div>
              </div>

              {/* Opponent */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 p-3 rounded-2xl border border-white/5">
                  {match.opponent_logo ? (
                    <img
                      src={match.opponent_logo}
                      alt={match.opponent_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-3xl font-heading">?</div>
                  )}
                </div>
                <span className="font-heading text-sm md:text-xl uppercase tracking-wider text-center">{match.opponent_name}</span>
              </div>
            </div>

            {/* MVP & Roster Info */}
            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {match.mvp && (
                <div className="flex items-center gap-4 bg-gold/5 border border-gold/10 p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <Star className="text-gold fill-gold" size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gold/60 font-heading uppercase tracking-widest">Player of the Match</div>
                    <div className="text-xl font-heading text-gold uppercase">{match.mvp}</div>
                  </div>
                </div>
              )}

              {match.roster && (
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] text-gray-500 font-heading uppercase tracking-widest mb-2">{homeTeamName} Lineup</div>
                  <div className="flex flex-wrap gap-2">
                    {match.roster.map((player, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded text-[10px] font-heading text-gray-300 uppercase">
                        {player}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Games Detail Section - LoL Esports Style */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Swords size={20} className="text-gold" />
            <h2 className="text-xl font-heading uppercase tracking-widest">Chi tiết các ván đấu</h2>
          </div>

          <GameScoreboard
            games={match.games || []}
            homeTeamName={homeTeamName}
            homeTeamLogo={homeTeamLogo}
            opponentName={match.opponent_name}
            opponentLogo={match.opponent_logo}
          />
        </div>
      </div>
    </div>
  );
}
