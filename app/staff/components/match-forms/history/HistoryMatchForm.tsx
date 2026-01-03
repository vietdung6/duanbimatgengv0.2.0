"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormSection } from "../shared/FormSection";
import { GeneralInfo } from "../shared/GeneralInfo";
import { IdentitySection } from "./IdentitySection";
import { OpponentSection } from "../shared/OpponentSection";
import { GameResults, Game } from "./GameResults";
import { SquadSelector } from "../shared/SquadSelector";
import { useToast } from "@/components/ui/ToastContext";
import { MatchRow, LineupPlayer } from "@/lib/data/scheduleService";
import { getHomeTeamIdentity, getIdentityLogo } from "@/lib/utils/teamIdentity";

interface HistoryMatchFormProps {
  onSuccess?: () => void;
  hideHeader?: boolean;
  initialData?: MatchRow | undefined;
  copyFromMatch?: MatchRow | undefined;
}

interface MatchFormData {
  date: string;
  time: string;
  tournamentId: number | null;
  tournament: string; // Added field
  stage: string;
  round_name: string;
  matchType: string;
  patch: string;
  homeTeamIdentity: string;
  homeTeamLogo: string;
  opponentId: number | null;
  opponentName: string;
  opponentShortName: string;
  tournamentSlug: string;
  games: Game[];
  squad: LineupPlayer[] | null;
}

export default function HistoryMatchForm({ onSuccess, hideHeader, initialData, copyFromMatch }: HistoryMatchFormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [identityOptions, setIdentityOptions] = useState<string[]>([]);
  const [opponentGroupId, setOpponentGroupId] = useState<number | null>(null);

  const [formData, setFormData] = useState<MatchFormData>(() => {
    // If copying from another match (copies tournament info only, NOT opponent)
    if (copyFromMatch && !initialData) {
      // Parse date and time from source match
      const srcDate = new Date(copyFromMatch.match_date);
      const srcDateStr = srcDate.toISOString().split('T')[0] ?? "";
      const srcTimeStr = srcDate.toTimeString().slice(0, 5);

      return {
        date: srcDateStr,
        time: srcTimeStr,
        tournamentId: copyFromMatch.tournament_resource_id || null,
        tournament: copyFromMatch.tournament || "", // Initialize
        stage: copyFromMatch.stage || "",
        round_name: copyFromMatch.round_name || "",
        matchType: copyFromMatch.match_type || "BO3",
        patch: copyFromMatch.patch || "",
        homeTeamIdentity: copyFromMatch.home_team_name || "Gen.G",
        homeTeamLogo: copyFromMatch.home_team_logo || getIdentityLogo(copyFromMatch.home_team_name || "Gen.G"),
        opponentId: null as number | null,
        opponentName: "", // Do NOT copy opponent
        opponentShortName: "",
        tournamentSlug: "",
        games: [] as Game[],
        squad: null as LineupPlayer[] | null,
      };
    }

    if (initialData) {
      // Parse date and time from match_date
      const dateObj = new Date(initialData.match_date);
      const dateStr = dateObj.toISOString().split('T')[0] ?? "";
      const timeStr = dateObj.toTimeString().slice(0, 5);

      // Map games
      const mappedGames = initialData.games?.map((g: any) => {
        const rawResult = g.result?.toLowerCase();
        return {
          result: (rawResult === 'win' || rawResult === 'loss') ? rawResult : 'win',
          side: g.side?.toLowerCase() || 'blue',
          duration: g.duration || '',
          vodUrl: g.vodUrl || g.vod_url || ''
        };
      }) || [];

      // Helper to parse tournament slug from full slug
      // Format: {home}-vs-{opp}-{tour}-{date}-{hash}
      let extractedSlug = "";
      if (initialData.slug) {
        try {
          // Remove date and hash suffix (YYYY-MM-DD-hash)
          const dateRegex = /-(\d{4}-\d{2}-\d{2})-[^-]+$/;
          const match = initialData.slug.match(dateRegex);

          if (match && match.index) {
            const prefixPart = initialData.slug.substring(0, match.index);
            // prefixPart: "gen-vs-t1-chung-ket-lck"
            // Expecting "home-vs-opp-" at start
            const parts = prefixPart.split('-');

            // parts[0]=home, parts[1]=vs, parts[2]=opp. Remainder is tour.
            // Check if parts structure looks valid (at least 4 parts: home, vs, opp, tour...)
            // Actually, if tour is empty, parts length is 3.
            if (parts.length >= 3 && parts[1] === 'vs') {
              extractedSlug = parts.slice(3).join('-');
            }
          }
        } catch (e) {
          console.warn("Failed to parse existing slug:", initialData.slug);
        }
      }

      return {
        date: dateStr,
        time: timeStr,
        tournamentId: initialData.tournament_resource_id || null,
        tournament: initialData.tournament || "", // Initialize for editing
        stage: initialData.stage || "",
        round_name: initialData.round_name || "",
        matchType: initialData.match_type || "BO3",
        patch: initialData.patch || "",
        homeTeamIdentity: initialData.home_team_name || "Gen.G",
        homeTeamLogo: initialData.home_team_logo || getIdentityLogo(initialData.home_team_name || "Gen.G"),
        opponentId: null as number | null,
        opponentName: initialData.opponent_name || "",
        opponentShortName: initialData.opponent_short_name || "",
        tournamentSlug: extractedSlug,
        games: mappedGames,
        squad: (initialData.lineup && typeof initialData.lineup === 'string')
          ? JSON.parse(initialData.lineup)
          : (initialData.lineup || null),
      };
    }

    return {
      date: new Date().toISOString().split('T')[0] ?? "",
      time: "17:00",
      tournamentId: null as number | null,
      tournament: "", // Default empty
      stage: "",
      round_name: "",
      matchType: "BO3",
      patch: "",
      homeTeamIdentity: "Gen.G",
      homeTeamLogo: getIdentityLogo("Gen.G"),
      opponentId: null as number | null,
      opponentName: "",
      opponentShortName: "",
      tournamentSlug: "",
      games: [] as Game[],
      squad: null as LineupPlayer[] | null,
    };
  });

  // Update Identity AND Logo based on Date
  useEffect(() => {
    if (!formData.date) return;
    const { identity, options } = getHomeTeamIdentity(formData.date);

    setFormData(prev => {
      // If we have options (ambiguous date) and the current identity is one of them, keep it.
      // This preserves the selection when editing an existing match or when the user manually selected it.
      if (options && options.includes(prev.homeTeamIdentity as any)) {
        return prev;
      }

      // Otherwise, switch to the default identity AND logo for this date.
      if (prev.homeTeamIdentity !== identity) {
        return {
          ...prev,
          homeTeamIdentity: identity,
          homeTeamLogo: getIdentityLogo(identity) // ⬅️ ALSO update the logo!
        };
      }
      return prev;
    });
    setIdentityOptions(options || []);
  }, [formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) return showToast("Vui lòng chọn ngày thi đấu", "error");
    if (!formData.opponentId && !initialData) return showToast("Vui lòng chọn đối thủ", "error");

    setLoading(true);
    console.log("[HistoryMatchForm] Submitting:", initialData ? { ...formData, id: initialData.id } : formData); // DEBUG LOG

    try {
      const res = await fetch("/api/staff/matches/history", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialData ? { ...formData, id: initialData.id } : formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(initialData ? "Cập nhật trận đấu thành công!" : "Đã lưu trận đấu thành công!", "success");
        if (onSuccess) {
          onSuccess();
        } else {
          // Default behavior if no callback provided (e.g., standalone page)
          // router.push("/staff/matches"); 
        }
      } else {
        throw new Error(data.error || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      {!hideHeader && (
        <div className="flex justify-between items-center mb-6 border-b border-gold/20 pb-2">
          <div>
            <h2 className="text-2xl font-bold text-gold">
              {initialData ? "Cập nhật Lịch sử đấu" : "Nhập liệu Lịch sử đấu (History Match)"}
            </h2>
            <div className="text-sm text-gray-400 mt-1">
              {copyFromMatch ? (
                <span className="text-blue-400">Sao chép từ: {copyFromMatch.opponent_name}</span>
              ) : (
                <>ID: {formData.homeTeamIdentity} vs {formData.opponentName || "???"}</>
              )}
            </div>
          </div>

          {/* Top Save Button */}
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded font-bold text-black text-sm transition-colors ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#F5E6A3]'
              }`}
          >
            {loading ? "Đang lưu..." : (initialData ? "Cập nhật" : "Lưu ngay")}
          </button>
        </div>
      )}

      {/* 1. Thông tin chung */}
      <GeneralInfo
        value={formData}
        onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
        onTournamentSelect={(tournament) => {
          if (tournament.opponent_group_id) {
            setOpponentGroupId(tournament.opponent_group_id);
          }
        }}
      />

      {/* 2. Slug & URL Preview */}
      <FormSection title="Cấu hình URL (SEO)" className="animate-in slide-in-from-left-2 duration-500">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Slug Giải đấu (Custom Tournament Slug)
            </label>
            <input
              type="text"
              value={formData.tournamentSlug}
              onChange={(e) => setFormData(prev => ({ ...prev, tournamentSlug: e.target.value }))}
              placeholder="VD: chung-ket-lck (để trống sẽ tự tạo)"
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Chỉ nhập phần tên giải đấu. Hệ thống sẽ tự ghép: {`{home}-{opp}-{slug}-{date}-{hash}`}
            </p>
          </div>

          {/* URL Preview */}
          <div className="p-3 bg-black/30 rounded border border-gray-800 flex flex-col gap-1">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">URL Preview (Dự kiến)</span>
            <div className="text-sm font-mono text-green-400 break-all">
              /match/
              <span className="text-gold">{getHomeTeamIdentity(formData.date).identity.toLowerCase().includes("ozone") ? "sso" : "gen"}</span>
              -vs-
              <span className="text-gold">{formData.opponentShortName ? formData.opponentShortName.toLowerCase() : (formData.opponentName ? formData.opponentName.substring(0, 3).toLowerCase() : "opp")}</span>
              /
              <span className="text-blue-400">{formData.tournamentSlug || "lck-spring-2024"}</span>
              /
              <span className="text-gray-400">{formData.date || "YYYY-MM-DD"}</span>
              /
              <span className="text-gray-500">x8k9pz</span>
            </div>
          </div>
        </div>
      </FormSection>

      {/* 3. Danh tính & Đối thủ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IdentitySection
          identity={formData.homeTeamIdentity}
          options={identityOptions}
          onIdentityChange={(identity) => setFormData(prev => ({
            ...prev,
            homeTeamIdentity: identity,
            homeTeamLogo: getIdentityLogo(identity)
          }))}
        />
        <OpponentSection
          opponentId={formData.opponentId}
          initialOpponentName={initialData?.opponent_name ?? undefined}
          onChange={(id, name, shortName) => setFormData(prev => ({
            ...prev,
            opponentId: id,
            opponentName: name,
            opponentShortName: shortName || ""
          }))}
          autoSelectedGroupId={opponentGroupId}
        />
      </div>

      {/* 3. Đội hình thi đấu (moved above game results) */}
      <FormSection title="Đội hình thi đấu">
        <SquadSelector
          onChange={(squad) => setFormData(prev => ({ ...prev, squad }))}
        />
      </FormSection>

      {/* 4. Kết quả thi đấu */}
      <GameResults
        games={formData.games}
        squad={formData.squad}
        onChange={(games) => setFormData(prev => ({ ...prev, games }))}
      />

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
        <button
          type="button"
          className="px-4 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          onClick={() => router.back()}
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded font-bold text-black transition-colors ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#F5E6A3]'
            }`}
        >
          {loading ? "Đang lưu..." : (initialData ? "Cập nhật Trận đấu" : "Lưu Trận đấu")}
        </button>
      </div>
    </form>
  );
}
