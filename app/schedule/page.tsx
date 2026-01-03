"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Tv, ChevronRight, Trophy, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { MatchCard } from "../match-history/components/MatchCard";

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

export default function SchedulePage() {
  const { language, t } = useLanguage();
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [currentTournament, setCurrentTournament] = useState("LCK Spring 2025");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [upcomingLimit, setUpcomingLimit] = useState(5);

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
              {upcomingMatches.slice(0, upcomingLimit).map((match, i) => (
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
                        {match.opponentLogo && match.opponentLogo.startsWith('http') ? (
                          <img 
                            src={match.opponentLogo} 
                            alt={match.opponent}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-3xl">${match.opponent?.[0] || '?'}</span>`;
                              }
                            }}
                          />
                        ) : (
                          <span className="text-3xl">{match.opponentLogo || match.opponent?.[0]}</span>
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
              
              {upcomingLimit < upcomingMatches.length && (
                <div className="text-center pt-4">
                  <button 
                    onClick={() => setUpcomingLimit(prev => prev + 5)}
                    className="btn-outline-gold inline-flex items-center gap-2"
                  >
                    {t.common?.loadMore || "Load More"}
                  </button>
                </div>
              )}
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
            <div className="grid gap-3">
              {recentResults.slice(0, 5).map((series, i) => (
                <MatchCard 
                  key={series.id} 
                  series={series} 
                  index={i} 
                  viewMode="full"
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/match-history" className="btn-outline-gold inline-flex items-center gap-2">
              {t.schedule.viewAllResults} <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


