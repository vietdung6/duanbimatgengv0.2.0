"use client";

import { useState, useMemo } from "react";
import { Plus, History, AlertCircle, Edit, Search, Trash2, Copy } from "lucide-react";
import type { Match } from "../../types";
import { MatchRow } from "@/lib/data/scheduleService";
import HistoryMatchForm from "../match-forms/history/HistoryMatchForm";
import { useToast } from "@/components/ui/ToastContext";
import { useMatches } from "@/lib/hooks/useMatches";
import { useTeams } from "@/lib/hooks/useTeams";
import { getHomeTeamIdentity, getIdentityLogo } from "@/lib/utils/teamIdentity";

export default function StaffHistoryTab() {
  const { showToast } = useToast();

  // React Query hooks - cached data
  const { data: allMatches, isLoading, error: fetchError, refetch } = useMatches();
  const { data: teams } = useTeams();

  // Local state
  const [view, setView] = useState<'list' | 'create'>('list');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; matchId: number | null }>({
    show: false,
    matchId: null
  });
  const [copyFromMatch, setCopyFromMatch] = useState<Match | null>(null);

  // Client-side filtering với useMemo - chỉ re-compute khi allMatches hoặc searchQuery thay đổi
  const matches = useMemo(() => {
    if (!allMatches) return [];

    // Filter finished matches
    let filtered = allMatches.filter((m: Match) => m.match_status === 'finished');

    // Sort by date descending
    filtered = filtered.sort((a: Match, b: Match) =>
      new Date(b.match_date).getTime() - new Date(a.match_date).getTime()
    );

    // Client-side search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((match: Match) => {
        // Search by opponent name
        if (match.opponent_name?.toLowerCase().includes(query)) return true;
        // Search by tournament
        if (match.tournament?.toLowerCase().includes(query)) return true;
        // Search by match type
        if (match.match_type?.toLowerCase().includes(query)) return true;
        // Search by short name via teams relation
        const team = teams?.find((t: any) => t.name === match.opponent_name);
        if (team?.short_name?.toLowerCase().includes(query)) return true;

        return false;
      });
    }

    return filtered;
  }, [allMatches, searchQuery, teams]);

  const error = fetchError ? "Không thể tải lịch sử đấu" : null;

  // Helper to convert API Match to MatchRow for the form
  const mapMatchToRow = (match: Match | null): MatchRow | undefined => {
    if (!match) return undefined;

    // Get era-specific identity based on match date
    // Get era-specific identity based on match date
    const dateStr = new Date(match.match_date).toISOString();
    const { identity } = getHomeTeamIdentity(dateStr);

    return {
      ...match,
      match_date: new Date(match.match_date),
      lineup: null, // API match might not have lineup structure expected by form yet
      roster: match.roster || null,
      games: match.games || [],
      home_team_name: match.home_team_name || identity,
      home_team_logo: match.home_team_logo || getIdentityLogo(match.home_team_name || identity),
      created_at: new Date(),
      updated_at: new Date(),
    } as unknown as MatchRow;
  }

  const handleDelete = async (matchId: number) => {
    setDeleteConfirm({ show: true, matchId });
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.matchId) return;

    try {
      const res = await fetch(`/api/staff/matches/history?id=${deleteConfirm.matchId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await refetch(); // Refetch từ React Query cache
        showToast("Đã xóa trận đấu thành công!", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "Không thể xóa trận đấu", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Đã xảy ra lỗi khi xóa trận đấu", "error");
    } finally {
      setDeleteConfirm({ show: false, matchId: null });
    }
  }

  if (view === 'create') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
          <h2 className="font-heading text-xl text-gold flex items-center gap-2">
            {editingMatch ? <Edit size={20} /> : <Plus size={20} />}
            {editingMatch ? "Cập nhật Trận đấu" : "Nhập liệu Trận đấu (History)"}
          </h2>
          <button
            onClick={() => {
              setView('list');
              setEditingMatch(null);
            }}
            className="text-gray-400 hover:text-white text-sm"
          >
            Quay lại danh sách
          </button>
        </div>
        <HistoryMatchForm
          initialData={mapMatchToRow(editingMatch)}
          copyFromMatch={copyFromMatch ? mapMatchToRow(copyFromMatch) : undefined}
          onSuccess={() => {
            setView('list');
            setEditingMatch(null);
            setCopyFromMatch(null);
            refetch(); // Refresh data sau khi create/update
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl text-gold flex items-center gap-2">
              <History size={20} />
              Lịch sử thi đấu
            </h2>
            <p className="text-xs text-gray-400 mt-1">Quản lý kết quả các trận đấu đã diễn ra.</p>
          </div>
          <button
            onClick={() => {
              setEditingMatch(null);
              setView('create');
            }}
            className="bg-gold text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-gold/80 transition-all flex items-center gap-2 uppercase tracking-wide"
          >
            <Plus size={14} />
            Nhập liệu Trận đấu
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đội, tên viết tắt (VD: DK, T1...), hoặc giải đấu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gold/50 outline-none transition-all"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Đang tải dữ liệu...</div>
        ) : matches.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-800 p-12 text-center bg-white/[0.02]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900/50 mb-4 text-gray-600">
              <History size={24} />
            </div>
            <p className="text-sm text-gray-500">Chưa có trận đấu nào trong lịch sử.</p>
            <button
              onClick={() => {
                setEditingMatch(null);
                setView('create');
              }}
              className="mt-4 text-gold text-xs font-bold hover:underline"
            >
              Nhập liệu ngay
            </button>
          </div>
        ) : (
          matches
            .filter((match: Match) => {
              if (!searchQuery) return true;
              const query = searchQuery.toLowerCase();

              // Basic fields check
              if (match.opponent_name.toLowerCase().includes(query)) return true;
              if (match.tournament.toLowerCase().includes(query)) return true;
              if (match.match_type?.toLowerCase().includes(query)) return true;

              // Short name check via TeamResource mapping
              const team = teams.find((t: any) => t.name === match.opponent_name);
              if (team && team.short_name && team.short_name.toLowerCase().includes(query)) return true;

              return false;
            })
            .map((match: Match) => (
              <div
                key={match.id}
                className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="text-center w-24">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {new Date(match.match_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-600">
                      {match.match_type}
                    </div>
                  </div>

                  <div className="h-8 w-[1px] bg-white/10" />

                  <div className="flex items-center gap-4">
                    {/* Gen.G */}
                    <div className={`text-sm font-bold ${match.match_result === 'win' ? 'text-blue-400' : match.match_result === 'loss' ? 'text-red-400' : 'text-gray-400'}`}>
                      {match.score_gen}
                    </div>
                    <div className="text-xs text-gray-500">vs</div>
                    <div className={`text-sm font-bold ${match.match_result === 'loss' ? 'text-blue-400' : match.match_result === 'win' ? 'text-red-400' : 'text-gray-400'}`}>
                      {match.score_opp}
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      <div className="w-6 h-6 bg-white/5 rounded-full p-1 flex items-center justify-center">
                        <img
                          src={match.opponent_logo || "/placeholder-team.png"}
                          alt={match.opponent_name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/40x40/black/white?text=" + match.opponent_name[0];
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-white">{match.opponent_name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${match.match_result === 'win' ? 'bg-blue-500/10 text-blue-400' :
                    match.match_result === 'loss' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'
                    }`}>
                    {match.match_result === 'win' ? 'Victory' : match.match_result === 'loss' ? 'Defeat' : 'Draw'}
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-gold">{match.tournament}</div>
                    <div className="text-[10px] text-gray-500">{match.stage}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCopyFromMatch(match);
                      setEditingMatch(null);
                      setView('create');
                    }}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white shadow-lg"
                    title="Sao chép từ trận này"
                  >
                    <Copy size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingMatch(match);
                      setCopyFromMatch(null);
                      setView('create');
                    }}
                    className="p-2 bg-[#D4AF37] rounded-lg hover:bg-[#F5E6A3] transition-colors text-black hover:text-black shadow-lg"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(match.id);
                    }}
                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-white shadow-lg"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#0A0A0A] border border-red-500/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-heading text-white">Xác nhận xóa</h3>
                <p className="text-sm text-gray-400 mt-1">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Bạn có chắc chắn muốn xóa trận đấu này không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm({ show: false, matchId: null })}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium shadow-lg"
              >
                Xóa trận đấu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
