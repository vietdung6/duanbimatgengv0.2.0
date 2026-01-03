"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, AlertCircle } from "lucide-react";
import CreateScheduledMatchModal from "./CreateScheduledMatchModal";
import { getMatches } from "@/lib/api/staff";
import type { Match } from "../../types";

export default function StaffScheduleTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    setLoading(true);
    try {
      const data = await getMatches();
      // Filter only scheduled matches
      setMatches(data.filter(m => m.match_status === 'scheduled'));
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách trận đấu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-gold flex items-center gap-2">
            <Calendar size={20} />
            Quản lý Lịch thi đấu
          </h2>
          <p className="text-xs text-gray-400 mt-1">Thêm và quản lý các trận đấu sắp diễn ra.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gold text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-gold/80 transition-all flex items-center gap-2 uppercase tracking-wide"
        >
          <Plus size={14} />
          Thêm Trận Đấu
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* List (Placeholder for now, will implement proper cards later) */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Đang tải dữ liệu...</div>
        ) : matches.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-800 p-12 text-center bg-white/[0.02]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900/50 mb-4 text-gray-600">
              <Calendar size={24} />
            </div>
            <p className="text-sm text-gray-500">Chưa có trận đấu nào sắp tới.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 text-gold text-xs font-bold hover:underline"
            >
              Thêm trận đấu ngay
            </button>
          </div>
        ) : (
          matches.map((match) => (
            <div 
              key={match.id} 
              className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="text-center w-16">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {new Date(match.match_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {new Date(match.match_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <div className="h-8 w-[1px] bg-white/10" />
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded p-1.5 flex items-center justify-center">
                    <img 
                      src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png" 
                      alt="GEN" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-bold">VS</span>
                  <div className="w-8 h-8 bg-white/5 rounded p-1.5 flex items-center justify-center">
                    {match.opponent_logo ? (
                      <img src={match.opponent_logo} alt={match.opponent_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-gray-500 font-bold">?</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white uppercase tracking-wide">{match.opponent_name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {match.tournament} • {match.match_type || 'BO3'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 group-hover:text-gold transition-colors">
                Scheduled
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <CreateScheduledMatchModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchMatches}
      />
    </div>
  );
}
