"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Tv, ChevronRight, Trophy, CheckCircle, XCircle, Users } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LineupSlot {
  role: string;
  player: string;
  note?: string;
}

interface UpcomingMatch {
  id: string;
  opponent: string;
  opponentLogo: string;
  date: string;
  time: string;
  timezone: string;
  tournament: string;
  venue: string;
  status: string;
  lineup?: LineupSlot[];
}

interface MatchResult {
  id: string;
  opponent: string;
  opponentLogo: string;
  date: string;
  score: { gen: number; opp: number };
  result: "win" | "loss";
  tournament: string;
  mvp: string;
  lineup?: LineupSlot[];
}

export default function SchedulePage() {
  const { language, t } = useLanguage();
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([]);
  const [recentResults, setRecentResults] = useState<MatchResult[]>([]);
  const [currentTournament, setCurrentTournament] = useState("LCK Spring 2025");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const response = await fetch("/api/admin/schedule");
      const data = await response.json();
      setUpcomingMatches(data.upcomingMatches || []);
      setRecentResults(data.recentResults || []);
      setCurrentTournament(data.currentTournament || "LCK Spring 2025");
    } catch (error) {
      console.error("Failed to load schedule:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 
                          rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">{currentTournament.toUpperCase()}</span>
            </div>
            <h1 className="font-heading text-5xl sm:text-7xl mb-4">
              <span className="text-gradient-gold">{t.schedule.title}</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              {t.schedule.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="font-heading text-2xl text-white">{t.schedule.upcomingMatches}</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">{t.schedule.loading}</p>
            </div>
          ) : upcomingMatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">{t.schedule.noMatches}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01, x: 10 }}
                className="card-dark flex flex-col md:flex-row items-center gap-6 p-6
                          cursor-pointer group bg-[#0A0A0A] border border-[#1A1A1A]"
              >
                {/* Date */}
                <div className="text-center md:text-left md:w-32 flex-shrink-0">
                  {mounted && (
                    <>
                      <div className="font-heading text-3xl text-gold">
                        {new Date(match.date).getDate()}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(match.date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    </>
                  )}
                </div>

                {/* Match Info */}
                <div className="flex-grow flex flex-col gap-4">
                  {/* Teams */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center 
                                    mb-1 overflow-hidden p-2 bg-white/5">
                        <img 
                          src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png"
                          alt="Gen.G Logo"
                          className="w-full h-full object-contain"
                          style={{ filter: 'brightness(1.1)' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<span class="text-2xl font-heading text-gold">G</span>';
                              parent.classList.add('bg-gold');
                            }
                          }}
                        />
                      </div>
                      <span className="text-white font-heading text-sm">GEN.G</span>
                    </div>

                    <span className="font-heading text-2xl text-gold">VS</span>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-black-charcoal rounded-xl flex items-center justify-center 
                                    mb-1 overflow-hidden">
                        {match.opponentLogo.startsWith('http') ? (
                          <img 
                            src={match.opponentLogo} 
                            alt={match.opponent}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = match.opponentLogo;
                                parent.classList.add('text-3xl');
                              }
                            }}
                          />
                        ) : (
                          <span className="text-3xl">{match.opponentLogo}</span>
                        )}
                      </div>
                      <span className="text-white font-heading text-sm">{match.opponent}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-gold" />
                      {match.time} KST
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-gold" />
                      {match.venue}
                    </span>
                  </div>

                  {/* Lineup Section */}
                  {match.lineup && match.lineup.length > 0 && (
                    <div className="border-t border-gray-800 pt-4 mt-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Users size={14} className="text-gold" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          {language === 'vi' ? 'Đội hình Gen.G' : 'Gen.G Lineup'}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {match.lineup.map((slot, idx) => (
                          <div key={idx} className="text-center bg-black-charcoal/50 rounded-lg p-2 border border-gray-800">
                            <div className="text-xs text-gray-500 mb-1 uppercase">
                              {slot.role}
                            </div>
                            <div className="text-sm font-semibold text-white">
                              {slot.player}
                            </div>
                            {slot.note && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {slot.note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Watch Button */}
                <div className="flex-shrink-0">
                    <button className="btn-outline-gold text-sm flex items-center gap-2
                                   group-hover:bg-gold group-hover:text-black transition-all">
                      <Tv size={16} />
                      {t.schedule.setReminder}
                      <ChevronRight size={16} />
                    </button>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Results */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-5 h-5 text-gold" />
            <h2 className="font-heading text-2xl text-white">{t.schedule.recentResults}</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">{t.schedule.loading}</p>
            </div>
          ) : recentResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">{t.schedule.noResults}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {recentResults.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`card-dark relative overflow-hidden bg-[#0A0A0A] border-2 ${
                  match.result === 'win' 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-red-500/50 bg-red-500/5'
                } hover:scale-[1.02] transition-all duration-300`}
              >
                {/* Result Badge - Enhanced */}
                <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                  match.result === 'win' 
                    ? 'bg-green-500/30 text-green-300 border border-green-500/50' 
                    : 'bg-red-500/30 text-red-300 border border-red-500/50'
                }`}>
                  {match.result === 'win' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>{match.result === 'win' ? (language === 'vi' ? 'THẮNG' : 'WIN') : (language === 'vi' ? 'THUA' : 'LOSS')}</span>
                </div>

                {/* Date - Enhanced */}
                {mounted && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                      {match.tournament}
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-300 text-sm font-semibold">
                        {new Date(match.date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Teams & Score - Enhanced */}
                <div className="space-y-4 mb-4">
                  {/* Gen.G Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center 
                                    overflow-hidden p-2 bg-white/5 border border-gold/20">
                        <img 
                          src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png"
                          alt="Gen.G Logo"
                          className="w-full h-full object-contain"
                          style={{ filter: 'brightness(1.1)' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<span class="text-xl font-heading text-gold">G</span>';
                              parent.classList.add('bg-gold');
                            }
                          }}
                        />
                      </div>
                      <span className="font-heading text-lg text-white">GEN.G</span>
                    </div>
                    <div className={`font-heading text-4xl font-bold ${
                      match.score.gen > match.score.opp ? 'text-gold' : 'text-gray-500'
                    }`}>
                      {match.score.gen}
                    </div>
                  </div>

                  {/* VS Divider */}
                  <div className="flex items-center justify-center">
                    <div className="h-px bg-gray-700 flex-1"></div>
                    <span className="px-3 text-gray-500 text-xs font-bold">VS</span>
                    <div className="h-px bg-gray-700 flex-1"></div>
                  </div>

                  {/* Opponent Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center 
                                    overflow-hidden p-2 bg-black-charcoal border border-gray-700">
                        {match.opponentLogo.startsWith('http') ? (
                          <img 
                            src={match.opponentLogo} 
                            alt={match.opponent}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = match.opponentLogo;
                                parent.classList.add('text-2xl');
                              }
                            }}
                          />
                        ) : (
                          <span className="text-2xl">{match.opponentLogo}</span>
                        )}
                      </div>
                      <span className="font-heading text-lg text-white">{match.opponent}</span>
                    </div>
                    <div className={`font-heading text-4xl font-bold ${
                      match.score.opp > match.score.gen ? 'text-gold' : 'text-gray-500'
                    }`}>
                      {match.score.opp}
                    </div>
                  </div>
                </div>

                {/* MVP - Enhanced */}
                {match.mvp && (
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex items-center gap-2 bg-gold/10 rounded-lg px-3 py-2">
                      <span className="text-gold text-lg">⭐</span>
                      <span className="text-gray-400 text-xs uppercase tracking-wider">MVP</span>
                      <span className="text-white font-bold ml-auto">{match.mvp}</span>
                    </div>
                  </div>
                )}

                {/* Lineup Section */}
                {match.lineup && match.lineup.length > 0 && (
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={14} className="text-gold" />
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        {language === 'vi' ? 'Đội hình Gen.G' : 'Gen.G Lineup'}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {match.lineup.map((slot, idx) => (
                        <div key={idx} className="text-center bg-black-charcoal/50 rounded-lg p-2 border border-gray-800">
                          <div className="text-xs text-gray-500 mb-1 uppercase">
                            {slot.role}
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {slot.player}
                          </div>
                          {slot.note && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {slot.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/achievements" className="btn-outline-gold inline-flex items-center gap-2">
              {t.schedule.viewAllResults} <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


