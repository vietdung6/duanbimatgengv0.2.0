"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormSection } from "../shared/FormSection";
import { GeneralInfo } from "../shared/GeneralInfo";
import { OpponentSection } from "../shared/OpponentSection";
import { SquadSelector } from "../shared/SquadSelector";
import { useToast } from "@/components/ui/ToastContext";

interface ScheduleMatchFormProps {
  onSuccess?: () => void;
  hideHeader?: boolean;
}

export default function ScheduleMatchForm({ onSuccess, hideHeader }: ScheduleMatchFormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "17:00",
    tournamentId: null as number | null,
    stage: "",
    round_name: "",
    matchType: "BO3",
    patch: "",
    homeTeamIdentity: "Gen.G", // Always Gen.G for future
    opponentId: null as number | null,
    opponentName: "",
    squad: null as any,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) return showToast("Vui lòng chọn ngày thi đấu", "error");
    if (!formData.opponentId) return showToast("Vui lòng chọn đối thủ", "error");

    setLoading(true);
    try {
      const res = await fetch("/api/staff/matches/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Đã tạo lịch thi đấu thành công!", "success");
        if (onSuccess) {
          onSuccess();
        } else {
          // router.push("/staff/matches"); // Optional redirect
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
          <h2 className="text-2xl font-bold text-gold">
            Tạo Lịch thi đấu Mới (Schedule)
          </h2>
          <div className="text-sm text-gray-400">
            Gen.G vs {formData.opponentName || "???"}
          </div>
        </div>
      )}

      {/* 1. Thông tin chung */}
      <GeneralInfo
        value={formData}
        onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
      />

      {/* 2. Đối thủ */}
      <OpponentSection
        opponentId={formData.opponentId}
        onChange={(id, name) => setFormData(prev => ({ ...prev, opponentId: id, opponentName: name }))}
      />

      {/* 3. Đội hình dự kiến (Optional) */}
      <FormSection title="Đội hình dự kiến (Optional)">
        <SquadSelector
          initialData={formData.squad}
          onChange={(squad) => setFormData(prev => ({ ...prev, squad }))}
        />
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 rounded font-bold text-black shadow-gold-glow transition-all ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#F5E6A3] hover:shadow-gold-glow-lg'
            }`}
        >
          {loading ? "Đang xử lý..." : "Lưu Lịch Thi Đấu"}
        </button>
      </div>
    </form>
  );
}
