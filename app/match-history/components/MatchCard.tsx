"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Calendar, ChevronRight, Layers, User, Star } from "lucide-react";
import { TournamentLogo, TeamLogo } from "@/components/shared/LogoComponents";
import { getHomeTeamIdentity, getIdentityLogo } from "@/lib/utils/teamIdentity";

// Helper: Get logo from DB first, then fallback using name or date
function getHomeTeamLogo(series: any): string {
  // Priority 1: Use DB logo value if exists
  if (series.home_team_logo) return series.home_team_logo;

  // Priority 2: Use home_team_name to get logo (if name is set and not default)
  if (series.home_team_name && series.home_team_name !== "Gen.G") {
    return getIdentityLogo(series.home_team_name);
  }

  // Priority 3: Calculate from date if no name set
  const dateStr = typeof series.match_date === 'string'
    ? series.match_date
    : series.match_date?.toISOString?.() || new Date().toISOString();
  const { identity } = getHomeTeamIdentity(dateStr);
  return getIdentityLogo(identity);
}

// Helper: Get name from DB first, then fallback to era-based calculation
function getHomeTeamName(series: any): string {
  // Priority 1: Use DB value if exists and not default "Gen.G"
  if (series.home_team_name && series.home_team_name !== "Gen.G") {
    return series.home_team_name;
  }

  // Priority 2: Calculate from date
  const dateStr = typeof series.match_date === 'string'
    ? series.match_date
    : series.match_date?.toISOString?.() || new Date().toISOString();
  const { identity } = getHomeTeamIdentity(dateStr);
  return identity;
}

import { getNestedMatchUrl } from "@/app/utils/slugHelper";

export function MatchCard({ series, index, viewMode = 'full' }: { series: any, index: number, viewMode?: 'full' | 'simple' }) {
  if (viewMode === 'simple') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative bg-[#0A0A0A] border border-white/5 rounded-lg overflow-hidden hover:border-gold/30 transition-all"
      >
        <Link href={getNestedMatchUrl(series)} prefetch={false} className="flex items-center p-2 md:p-2.5 gap-2 md:gap-4">
          <div className={`w-1 h-12 md:h-10 rounded-full ${series.match_result === 'win' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]'}`} />

          <div className="flex-grow grid grid-cols-12 items-center gap-2 md:gap-4">
            <div className="col-span-3 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-gold text-[8px] md:text-[10px] font-heading mb-0.5">
                {series.tournament_logo ? (
                  <TournamentLogo logo={series.tournament_logo} name={series.tournament} className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                ) : (
                  <Trophy className="w-2.5 md:w-3 h-2.5 md:h-3 flex-shrink-0" />
                )}
                <span className="truncate uppercase">{series.tournament}</span>
              </div>
              <div className="text-[7px] md:text-[9px] font-heading text-gray-400 mb-1">{series.round_name}</div>

              <div className="flex items-center gap-1 text-gray-400 text-[8px] md:text-[10px] mb-0.5">
                <Calendar className="w-2.5 md:w-3 h-2.5 md:h-3 flex-shrink-0 text-gold" />
                {new Date(series.match_date).toLocaleDateString('en-GB').replace(/\//g, '-')}
              </div>
            </div>

            {/* Match Info */}
            <div className="col-span-7 md:col-span-7 flex items-center justify-between px-1 md:px-4">
              <div className="flex flex-col items-center gap-1 flex-1">
                <img
                  src={getHomeTeamLogo(series)}
                  alt={getHomeTeamName(series)}
                  className="w-6 h-6 md:w-8 md:h-8 object-contain"
                />
                <span className="text-white text-[8px] md:text-[11px] font-heading uppercase tracking-wider">{getHomeTeamName(series)}</span>
              </div>

              <div className="flex flex-col items-center gap-0.5 px-2 md:px-6">
                <div className="text-[7px] md:text-[8px] font-heading text-gray-600 tracking-widest uppercase mb-1">{series.match_type}</div>
                <div className="flex items-center gap-2 md:gap-3 bg-white/5 px-2 md:px-3 py-0.5 md:py-1 rounded-lg border border-white/5 group-hover:border-white/10 transition-all">
                  <span className={`text-sm md:text-base font-heading ${series.match_result === 'win' ? 'text-gold' : 'text-gray-400'}`}>{series.score_gen}</span>
                  <span className="text-gray-600 text-[10px] md:text-xs">-</span>
                  <span className={`text-sm md:text-base font-heading ${series.match_result === 'loss' ? 'text-red-500' : 'text-gray-400'}`}>{series.score_opp}</span>
                </div>

                {series.mvp && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[7px] md:text-[9px] font-heading text-gold font-bold uppercase tracking-tighter">
                      MVP: {series.mvp}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-1 flex-1">
                <img src={series.opponent_logo} alt={series.opponent_name} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                <span className="text-white text-[8px] md:text-[11px] font-heading uppercase tracking-wider truncate max-w-[50px] md:max-w-none text-center">{series.opponent_short_name || series.opponent_name}</span>
              </div>
            </div>

            {/* Result Tag */}
            <div className="col-span-2 flex flex-col items-end justify-center gap-1">
              <span className={`text-[9px] md:text-[11px] font-heading uppercase tracking-widest ${series.match_result === 'win' ? 'text-green-500' : 'text-red-600'}`}>
                {series.match_result === 'win' ? 'Win' : 'Loss'}
              </span>
            </div>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative group bg-[#0A0A0A] border ${series.is_featured ? 'border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.05)]' : 'border-white/5'} rounded-xl overflow-hidden hover:border-white/10 transition-all`}
    >
      <div className="flex flex-col lg:flex-row items-stretch">
        <div className="p-3 lg:w-56 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-center bg-white/[0.02]">
          <div className="flex items-center gap-2 text-gold text-[10px] md:text-[11px] font-heading mb-1">
            {series.tournament_logo ? (
              <TournamentLogo logo={series.tournament_logo} name={series.tournament} className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Trophy className="w-3 h-3" />
            )}
            {series.tournament.toUpperCase()}
          </div>
          <div className="text-white font-heading text-sm md:text-base mb-0.5 leading-tight">{series.stage}</div>
          <div className="text-gray-500 text-xs mb-3">{series.round_name}</div>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Calendar className="w-3 h-3 text-gold/50" />
                {new Date(series.match_date).toLocaleDateString('en-GB').replace(/\//g, '-')}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Layers className="w-3 h-3 text-gold/50" />
                Patch {series.patch}
              </div>
            </div>

            {/* Lineup chuyển sang cột trái */}
            {series.roster && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                {series.roster.map((player: string, i: number) => {
                  const isMVP = series.mvp && player.toLowerCase() === series.mvp.toLowerCase();
                  return (
                    <span
                      key={i}
                      className={`flex items-center gap-1 text-[9px] font-heading uppercase tracking-tighter border-r last:border-r-0 border-gold/20 pr-2 last:pr-0 ${isMVP ? 'text-gold font-bold' : 'text-gold/60'
                        }`}
                    >
                      {player}
                      {isMVP && <Star className="w-2 h-2 fill-gold text-gold" />}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow p-3 md:p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8 relative">
          <div className="flex justify-end">
            <TeamDisplay
              name={getHomeTeamName(series)}
              logo={getHomeTeamLogo(series)}
              isGenG
            />
          </div>

          <div className="flex flex-col items-center gap-2 min-w-[140px] md:min-w-[280px]">
            <ScoreDisplay
              type={series.match_type}
              scoreGen={series.score_gen}
              scoreOpp={series.score_opp}
              result={series.match_result}
            />

            {/* W L chuyển sang cột giữa */}
            <div className="flex items-center gap-1.5 h-6">
              {series.games && series.games.map((game: any, i: number) => {
                const res = typeof game === 'string' ? game : game.result;
                return (
                  <div
                    key={i}
                    className="flex items-center"
                    title={`Ván ${i + 1}: ${res === 'win' ? 'Thắng' : 'Thua'}`}
                  >
                    <div className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold font-heading transition-all ${res === 'win' ? 'text-green-500' : 'text-red-600'
                      }`}>
                      {res === 'win' ? 'W' : 'L'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-start">
            <TeamDisplay name={series.opponent_short_name || series.opponent_name} logo={series.opponent_logo} />
          </div>
        </div>

        <Link href={getNestedMatchUrl(series)} prefetch={false} className="lg:w-16 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center group/btn py-2.5 lg:py-0 border-t lg:border-t-0 lg:border-l border-white/5">
          <div className="flex lg:flex-col items-center gap-2 text-gray-400 group-hover/btn:text-white">
            <span className="font-heading text-[9px] lg:[writing-mode:vertical-lr] uppercase tracking-[0.2em]">Chi tiết</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${series.match_result === 'win' ? 'bg-green-500 shadow-[2px_0_10px_rgba(34,197,94,0.2)]' : 'bg-red-600 shadow-[2px_0_10px_rgba(220,38,38,0.2)]'}`} />
    </motion.div>
  );
}

function TeamDisplay({ name, logo, isGenG = false }: { name: string, logo: string, isGenG?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-[70px] md:w-[100px]">
      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg bg-white/5 p-2 flex items-center justify-center border border-white/5 ${isGenG ? 'group-hover:border-gold/30' : 'group-hover:border-white/20'} transition-all`}>
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to text if image fails
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-bold text-gray-400">${name[0]}</span>`;
          }}
        />
      </div>
      <span className="font-heading text-white text-[10px] md:text-xs tracking-wider uppercase text-center truncate w-full">{name}</span>
    </div>
  );
}

function ScoreDisplay({ type, scoreGen, scoreOpp, result }: {
  type: string,
  scoreGen: number,
  scoreOpp: number,
  result: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 min-w-[100px]">
      <div className="text-[10px] md:text-xs font-heading text-gray-600 tracking-widest">{type}</div>

      <div className="flex items-center gap-3 md:gap-4">
        <span className={`text-2xl md:text-4xl font-heading ${result === 'win' ? 'text-gold' : 'text-gray-500'}`}>{scoreGen}</span>
        <span className="text-xl md:text-2xl text-gray-800">-</span>
        <span className={`text-2xl md:text-4xl font-heading ${result === 'loss' ? 'text-red-500' : 'text-gray-500'}`}>{scoreOpp}</span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <div className={`px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-heading tracking-widest uppercase ${result === 'win' ? 'bg-green-600/10 text-green-500 border border-green-600/20' : 'bg-red-600/10 text-red-600 border border-red-600/20'
          }`}>
          {result === 'win' ? 'Victory' : 'Defeat'}
        </div>
      </div>
    </div>
  );
}
