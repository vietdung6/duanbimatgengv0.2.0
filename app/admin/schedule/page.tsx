"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Calendar, Trophy, Lock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Helper function to check if string is a URL
const isUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

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
  streamUrl: string;
  status: string;
  lineup: LineupSlot[];
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
  vodUrl: string;
  lineup: LineupSlot[];
}

interface ScheduleData {
  currentTournament: string;
  upcomingMatches: UpcomingMatch[];
  recentResults: MatchResult[];
}

export default function AdminSchedulePage() {
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    currentTournament: "LCK Spring 2025",
    upcomingMatches: [],
    recentResults: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Persisted auth: respect admin login from /admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authed = localStorage.getItem("adminAuthed") === "1";
      if (authed) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/schedule");
      const data = await response.json();
      setScheduleData(data);
    } catch {
      setMessage(t.admin.schedule.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Simple password check (in production, use proper auth)
    if (password === "geng2025") {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("adminAuthed", "1");
      }
      setMessage("");
    } else {
      setMessage(t.admin.schedule.incorrectPassword);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: "geng2025",
          data: scheduleData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage(t.admin.schedule.saveSuccess);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(t.admin.schedule.saveError);
      }
    } catch {
      setMessage(t.admin.schedule.saveError);
    } finally {
      setSaving(false);
    }
  };

  const addUpcomingMatch = () => {
    const newMatch: UpcomingMatch = {
      id: Date.now().toString(),
      opponent: "",
      opponentLogo: "🔴",
      date: new Date().toISOString().split("T")[0],
      time: "17:00",
      timezone: "GMT+7 (VN)",
      tournament: scheduleData.currentTournament || "LCK Spring 2025",
      venue: "LoL Park",
      streamUrl: "",
      status: "upcoming",
      lineup: [
        { role: "Top", player: "Kiin" },
        { role: "Jungle", player: "Canyon" },
        { role: "Mid", player: "Chovy" },
        { role: "ADC", player: "Ruler" },
        { role: "Support", player: "Duro" },
      ],
    };
    setScheduleData({
      ...scheduleData,
      upcomingMatches: [...scheduleData.upcomingMatches, newMatch],
    });
  };

  const removeUpcomingMatch = (id: string) => {
    setScheduleData({
      ...scheduleData,
      upcomingMatches: scheduleData.upcomingMatches.filter((m) => m.id !== id),
    });
  };

  const addResult = () => {
    const newResult: MatchResult = {
      id: `r${Date.now()}`,
      opponent: "",
      opponentLogo: "🔴",
      date: new Date().toISOString().split("T")[0],
      score: { gen: 0, opp: 0 },
      result: "win",
      tournament: scheduleData.currentTournament || "LCK Spring 2025",
      mvp: "",
      vodUrl: "",
      lineup: [
        { role: "Top", player: "Kiin" },
        { role: "Jungle", player: "Canyon" },
        { role: "Mid", player: "Chovy" },
        { role: "ADC", player: "Ruler" },
        { role: "Support", player: "Duro" },
      ],
    };
    setScheduleData({
      ...scheduleData,
      recentResults: [...scheduleData.recentResults, newResult],
    });
  };

  const removeResult = (id: string) => {
    setScheduleData({
      ...scheduleData,
      recentResults: scheduleData.recentResults.filter((r) => r.id !== id),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-8 max-w-md w-full"
        >
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-gold" />
            <h1 className="font-heading text-2xl text-white">{t.admin.schedule.loginTitle}</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            placeholder={t.admin.schedule.passwordPlaceholder}
            className="w-full bg-black-charcoal border border-gray-700 rounded-lg px-4 py-3 text-white mb-4 focus:border-gold focus:outline-none"
          />
          <button onClick={handleLogin} className="btn-gold w-full">
            {t.admin.schedule.loginButton}
          </button>
          {message && (
            <p className="text-red-400 text-sm mt-4 text-center">{message}</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl text-gold mb-2">
              {t.admin.schedule.title}
            </h1>
            <p className="text-gray-400">{t.admin.schedule.subtitle}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? t.admin.schedule.saving : t.admin.schedule.saveButton}
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("success")
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">{language === "en" ? "Loading..." : "Đang tải..."}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Current Tournament Setting */}
            <section className="card-dark p-6">
              <h2 className="font-heading text-xl text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                {language === "en" ? "Current Tournament" : "Giải Đấu Hiện Tại"}
              </h2>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={scheduleData.currentTournament || ""}
                  onChange={(e) => {
                    setScheduleData({ ...scheduleData, currentTournament: e.target.value });
                  }}
                  placeholder={language === "en" ? "e.g., LCK Spring 2025" : "VD: LCK Spring 2025"}
                  className="flex-1 bg-black-charcoal border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                />
                <div className="text-gray-400 text-sm">
                  {language === "en" ? "This will be displayed on the schedule page" : "Sẽ hiển thị trên trang lịch thi đấu"}
                </div>
              </div>
            </section>

            {/* Upcoming Matches */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-gold" />
                  {t.admin.schedule.upcomingMatches}
                </h2>
                <button
                  onClick={addUpcomingMatch}
                  className="btn-outline-gold flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  {t.admin.schedule.addMatch}
                </button>
              </div>

              {scheduleData.upcomingMatches.length === 0 && (
                <div className="text-center py-12 card-dark">
                  <p className="text-gray-400">{t.admin.schedule.noMatches}</p>
                </div>
              )}

              <div className="space-y-4">
                {scheduleData.upcomingMatches.map((match, index) => (
                  <div key={match.id} className="card-dark p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-heading text-lg text-gold">
                        {t.admin.schedule.matchNumber} #{index + 1}
                      </h3>
                      <button
                        onClick={() => removeUpcomingMatch(match.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                      <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.opponent}
                        </label>
                        <input
                          type="text"
                          value={match.opponent}
                          onChange={(e) => {
                            const updated = [...scheduleData.upcomingMatches];
                            updated[index].opponent = e.target.value;
                            setScheduleData({ ...scheduleData, upcomingMatches: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.opponentLogo}
                        </label>
                        <input
                          type="text"
                          value={match.opponentLogo}
                          onChange={(e) => {
                            const updated = [...scheduleData.upcomingMatches];
                            updated[index].opponentLogo = e.target.value;
                            setScheduleData({ ...scheduleData, upcomingMatches: updated });
                          }}
                          placeholder={t.admin.schedule.opponentLogoHint}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                        {/* Logo Preview */}
                        {match.opponentLogo && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-gray-500 text-xs">Preview:</span>
                            {isUrl(match.opponentLogo) ? (
                              <img 
                                src={match.opponentLogo} 
                                alt="Logo preview" 
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-2xl">{match.opponentLogo}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.date}
                        </label>
                        <input
                          type="date"
                          value={match.date}
                          onChange={(e) => {
                            const updated = [...scheduleData.upcomingMatches];
                            updated[index].date = e.target.value;
                            setScheduleData({ ...scheduleData, upcomingMatches: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.time} (+7 VN)
                        </label>
                        <input
                          type="time"
                          value={match.time}
                          onChange={(e) => {
                            const updated = [...scheduleData.upcomingMatches];
                            updated[index].time = e.target.value;
                            setScheduleData({ ...scheduleData, upcomingMatches: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.tournament}
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={match.tournament}
                            onChange={(e) => {
                              const updated = [...scheduleData.upcomingMatches];
                              updated[index].tournament = e.target.value;
                              setScheduleData({ ...scheduleData, upcomingMatches: updated });
                            }}
                            className="flex-1 bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                          >
                            <option value={scheduleData.currentTournament || "LCK Spring 2025"}>
                              {scheduleData.currentTournament || "LCK Spring 2025"} ({language === "en" ? "Current" : "Hiện tại"})
                            </option>
                            <option value="LCK Spring 2025">LCK Spring 2025</option>
                            <option value="LCK Summer 2025">LCK Summer 2025</option>
                            <option value="MSI 2025">MSI 2025</option>
                            <option value="Worlds 2025">Worlds 2025</option>
                            <option value="KespaCup 2025">KespaCup 2025</option>
                            <option value="CUSTOM">{language === "en" ? "Custom..." : "Tùy chỉnh..."}</option>
                          </select>
                          {match.tournament === "CUSTOM" && (
                            <input
                              type="text"
                              placeholder={language === "en" ? "Tournament name" : "Tên giải đấu"}
                              onChange={(e) => {
                                const updated = [...scheduleData.upcomingMatches];
                                updated[index].tournament = e.target.value;
                                setScheduleData({ ...scheduleData, upcomingMatches: updated });
                              }}
                              className="flex-1 bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                            />
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.venue}
                        </label>
                        <input
                          type="text"
                          value={match.venue}
                          onChange={(e) => {
                            const updated = [...scheduleData.upcomingMatches];
                            updated[index].venue = e.target.value;
                            setScheduleData({ ...scheduleData, upcomingMatches: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>


                      {/* Lineup editor */}
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm text-gray-300 font-semibold">
                            {language === "en" ? "Lineup (Gen.G)" : "Đội hình Gen.G"}
                          </h4>
                          <button
                            type="button"
                            className="text-xs text-gold hover:underline"
                            onClick={() => {
                              const updated = [...scheduleData.upcomingMatches];
                              updated[index].lineup = [
                                { role: "Top", player: "Kiin" },
                                { role: "Jungle", player: "Canyon" },
                                { role: "Mid", player: "Chovy" },
                                { role: "ADC", player: "Ruler" },
                                { role: "Support", player: "Duro" },
                              ];
                              setScheduleData({ ...scheduleData, upcomingMatches: updated });
                            }}
                          >
                            {language === "en" ? "Reset default roles" : "Đặt lại vai trò mặc định"}
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {match.lineup?.map((slot, li) => (
                            <div key={li} className="bg-black-charcoal border border-gray-700 rounded-lg p-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={slot.role}
                                  onChange={(e) => {
                                    const updated = [...scheduleData.upcomingMatches];
                                    updated[index].lineup[li].role = e.target.value;
                                    setScheduleData({ ...scheduleData, upcomingMatches: updated });
                                  }}
                                  className="flex-1 bg-black border border-gray-700 rounded px-2 py-1 text-white text-sm focus:border-gold focus:outline-none"
                                  placeholder={language === "en" ? "Role" : "Vai trò"}
                                />
                                <button
                                  type="button"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => {
                                    const updated = [...scheduleData.upcomingMatches];
                                    updated[index].lineup = updated[index].lineup.filter((_, idx) => idx !== li);
                                    setScheduleData({ ...scheduleData, upcomingMatches: updated });
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={slot.player}
                                onChange={(e) => {
                                  const updated = [...scheduleData.upcomingMatches];
                                  updated[index].lineup[li].player = e.target.value;
                                  setScheduleData({ ...scheduleData, upcomingMatches: updated });
                                }}
                                className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-white text-sm focus:border-gold focus:outline-none"
                                placeholder={language === "en" ? "Player name" : "Tên tuyển thủ"}
                              />
                              <input
                                type="text"
                                value={slot.note || ""}
                                onChange={(e) => {
                                  const updated = [...scheduleData.upcomingMatches];
                                  updated[index].lineup[li].note = e.target.value;
                                  setScheduleData({ ...scheduleData, upcomingMatches: updated });
                                }}
                                className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-white text-xs focus:border-gold focus:outline-none"
                                placeholder={language === "en" ? "Note (optional)" : "Ghi chú (tuỳ chọn)"}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...scheduleData.upcomingMatches];
                              const lineup = updated[index].lineup || [];
                              lineup.push({ role: "Sub", player: "" });
                              updated[index].lineup = lineup;
                              setScheduleData({ ...scheduleData, upcomingMatches: updated });
                            }}
                            className="border border-dashed border-gray-600 rounded-lg p-3 text-gray-400 hover:border-gold hover:text-gold transition-colors"
                          >
                            + {language === "en" ? "Add slot" : "Thêm vị trí"}
                          </button>
                        </div>
                      </div>

                      {/* Quick action: move to results */}
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const updatedUpcoming = [...scheduleData.upcomingMatches];
                            const match = updatedUpcoming[index];
                            const newResult: MatchResult = {
                              id: `r${Date.now()}`,
                              opponent: match.opponent,
                              opponentLogo: match.opponentLogo,
                              date: match.date,
                              score: { gen: 0, opp: 0 },
                              result: "win",
                              tournament: match.tournament,
                              mvp: "",
                              vodUrl: "",
                              lineup: match.lineup && match.lineup.length > 0
                                ? match.lineup
                                : [
                                    { role: "Top", player: "Kiin" },
                                    { role: "Jungle", player: "Canyon" },
                                    { role: "Mid", player: "Chovy" },
                                    { role: "ADC", player: "Ruler" },
                                    { role: "Support", player: "Duro" },
                                  ],
                            };
                            setScheduleData({
                              ...scheduleData,
                              upcomingMatches: updatedUpcoming.filter((m) => m.id !== match.id),
                              recentResults: [newResult, ...scheduleData.recentResults],
                            });
                          }}
                          className="text-xs px-3 py-2 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
                        >
                          {language === "en" ? "Move to results" : "Chuyển sang kết quả"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Results */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-gold" />
                  {t.admin.schedule.recentResults}
                </h2>
                <button
                  onClick={addResult}
                  className="btn-outline-gold flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  {t.admin.schedule.addResult}
                </button>
              </div>

              {scheduleData.recentResults.length === 0 && (
                <div className="text-center py-12 card-dark">
                  <p className="text-gray-400">{t.admin.schedule.noResults}</p>
                </div>
              )}

              <div className="space-y-4">
                {scheduleData.recentResults.map((result, index) => (
                  <div key={result.id} className="card-dark p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-heading text-lg text-gold">
                        {t.admin.schedule.resultNumber} #{index + 1}
                      </h3>
                      <button
                        onClick={() => removeResult(result.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.opponent}
                        </label>
                        <input
                          type="text"
                          value={result.opponent}
                          onChange={(e) => {
                            const updated = [...scheduleData.recentResults];
                            updated[index].opponent = e.target.value;
                            setScheduleData({ ...scheduleData, recentResults: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.opponentLogo}
                        </label>
                        <input
                          type="text"
                          value={result.opponentLogo}
                          onChange={(e) => {
                            const updated = [...scheduleData.recentResults];
                            updated[index].opponentLogo = e.target.value;
                            setScheduleData({ ...scheduleData, recentResults: updated });
                          }}
                          placeholder={t.admin.schedule.opponentLogoHint}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                        {/* Logo Preview */}
                        {result.opponentLogo && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-gray-500 text-xs">Preview:</span>
                            {isUrl(result.opponentLogo) ? (
                              <img 
                                src={result.opponentLogo} 
                                alt="Logo preview" 
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-2xl">{result.opponentLogo}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.date}
                        </label>
                        <input
                          type="date"
                          value={result.date}
                          onChange={(e) => {
                            const updated = [...scheduleData.recentResults];
                            updated[index].date = e.target.value;
                            setScheduleData({ ...scheduleData, recentResults: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.result}
                        </label>
                        <select
                          value={result.result}
                          onChange={(e) => {
                            const updated = [...scheduleData.recentResults];
                            updated[index].result = e.target.value as "win" | "loss";
                            setScheduleData({ ...scheduleData, recentResults: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        >
                          <option value="win">{t.admin.schedule.win}</option>
                          <option value="loss">{t.admin.schedule.loss}</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.genScore}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={result.score.gen}
                          onChange={(e) => {
                            const updated = [...scheduleData.recentResults];
                            updated[index].score.gen = parseInt(e.target.value) || 0;
                            setScheduleData({ ...scheduleData, recentResults: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.oppScore}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={result.score.opp}
                          onChange={(e) => {
                            const updated = [...scheduleData.recentResults];
                            updated[index].score.opp = parseInt(e.target.value) || 0;
                            setScheduleData({ ...scheduleData, recentResults: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.mvp}
                        </label>
                        <input
                          type="text"
                          value={result.mvp}
                          onChange={(e) => {
                            const updated = [...scheduleData.recentResults];
                            updated[index].mvp = e.target.value;
                            setScheduleData({ ...scheduleData, recentResults: updated });
                          }}
                          className="w-full bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                          {t.admin.schedule.tournament}
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={result.tournament}
                            onChange={(e) => {
                              const updated = [...scheduleData.recentResults];
                              updated[index].tournament = e.target.value;
                              setScheduleData({ ...scheduleData, recentResults: updated });
                            }}
                            className="flex-1 bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                          >
                            <option value={scheduleData.currentTournament || "LCK Spring 2025"}>
                              {scheduleData.currentTournament || "LCK Spring 2025"} ({language === "en" ? "Current" : "Hiện tại"})
                            </option>
                            <option value="LCK Spring 2025">LCK Spring 2025</option>
                            <option value="LCK Summer 2025">LCK Summer 2025</option>
                            <option value="MSI 2025">MSI 2025</option>
                            <option value="Worlds 2025">Worlds 2025</option>
                            <option value="KespaCup 2025">KespaCup 2025</option>
                            <option value="CUSTOM">{language === "en" ? "Custom..." : "Tùy chỉnh..."}</option>
                          </select>
                          {result.tournament === "CUSTOM" && (
                            <input
                              type="text"
                              placeholder={language === "en" ? "Tournament name" : "Tên giải đấu"}
                              onChange={(e) => {
                                const updated = [...scheduleData.recentResults];
                                updated[index].tournament = e.target.value;
                                setScheduleData({ ...scheduleData, recentResults: updated });
                              }}
                              className="flex-1 bg-black-charcoal border border-gray-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                            />
                          )}
                        </div>
                      </div>

                      {/* Lineup (concise) */}
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm text-gray-300 font-semibold">
                            {language === "en" ? "Lineup (Gen.G)" : "Đội hình Gen.G"}
                          </h4>
                          <button
                            type="button"
                            className="text-xs text-gold hover:underline"
                            onClick={() => {
                              const updated = [...scheduleData.recentResults];
                              updated[index].lineup = [
                                { role: "Top", player: "" },
                                { role: "Jungle", player: "" },
                                { role: "Mid", player: "" },
                                { role: "ADC", player: "" },
                                { role: "Support", player: "" },
                              ];
                              setScheduleData({ ...scheduleData, recentResults: updated });
                            }}
                          >
                            {language === "en" ? "Reset lineup" : "Đặt lại đội hình"}
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {result.lineup?.map((slot, li) => (
                            <div key={li} className="bg-black-charcoal border border-gray-700 rounded-lg p-2 space-y-1">
                              <input
                                type="text"
                                value={slot.role}
                                onChange={(e) => {
                                  const updated = [...scheduleData.recentResults];
                                  updated[index].lineup[li].role = e.target.value;
                                  setScheduleData({ ...scheduleData, recentResults: updated });
                                }}
                                className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-white text-xs focus:border-gold focus:outline-none"
                                placeholder={language === "en" ? "Role" : "Vai trò"}
                              />
                              <input
                                type="text"
                                value={slot.player}
                                onChange={(e) => {
                                  const updated = [...scheduleData.recentResults];
                                  updated[index].lineup[li].player = e.target.value;
                                  setScheduleData({ ...scheduleData, recentResults: updated });
                                }}
                                className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-white text-xs focus:border-gold focus:outline-none"
                                placeholder={language === "en" ? "Player" : "Tuyển thủ"}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

