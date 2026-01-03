import React, { useState } from 'react';
import { Trophy, Plus } from 'lucide-react';
import TournamentItem from './TournamentItem';
import { TournamentType, TournamentResource, OpponentGroup } from "./types";

interface TournamentTypeExpandedRowProps {
  type: TournamentType;
  tournaments: TournamentResource[];
  groups: OpponentGroup[];
  onAdd: (type: TournamentType, data: { name: string; year: number; patch: string; groupId: number | null }) => Promise<void>;
  onUpdate: (id: number, data: Partial<TournamentResource>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TournamentTypeExpandedRow({
  type,
  tournaments,
  groups,
  onAdd,
  onUpdate,
  onDelete
}: TournamentTypeExpandedRowProps) {
  const [ntName, setNtName] = useState("");
  const [ntYear, setNtYear] = useState(new Date().getFullYear());
  const [ntPatch, setNtPatch] = useState("");
  const [ntGroupId, setNtGroupId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleYearChange = (year: number) => {
    setNtYear(year);
    setNtName(`${type.name} ${year}`);
  };

  const handleAddSubmit = async () => {
    if (!ntName) return;

    try {
      setActionLoading(true);
      await onAdd(type, {
        name: ntName,
        year: ntYear,
        patch: ntPatch,
        groupId: ntGroupId
      });

      // Reset form
      setNtName("");
      setNtYear(new Date().getFullYear());
      setNtPatch("");
      setNtGroupId(null);
    } catch (error) {
      console.error("Error adding tournament:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <tr className="bg-white/[0.02]">
      <td colSpan={6} className="px-2 md:px-6 pb-6 pt-0">
        <div className="pl-4 md:pl-14 space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Trophy size={12} />
              Danh sách giải đấu
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {tournaments.map(tour => (
                <TournamentItem
                  key={tour.id}
                  tournament={tour}
                  groups={groups}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
              {tournaments.length === 0 && (
                <div className="text-gray-500 text-xs italic p-2">Chưa có giải đấu nào</div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/20 border border-gold/20 space-y-3">
            <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-2">
              <Plus size={12} />
              Thêm giải đấu mới ({type.name})
            </h4>
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-full md:w-24 space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Năm</label>
                <input
                  type="number"
                  value={ntYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-gold/50"
                />
              </div>
              <div className="w-full md:w-24 space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Patch</label>
                <input
                  type="text"
                  placeholder="14.1"
                  value={ntPatch}
                  onChange={(e) => setNtPatch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-gold/50"
                />
              </div>
              <div className="w-full md:flex-1 min-w-[200px] space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Tên giải đấu</label>
                <input
                  type="text"
                  value={ntName}
                  onChange={(e) => setNtName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-gold/50"
                />
              </div>
              <div className="w-full md:w-40 space-y-1">
                <label className="text-[10px] text-gray-500 uppercase">Nhóm đối thủ</label>
                <select
                  value={ntGroupId || ""}
                  onChange={(e) => setNtGroupId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-gold/50"
                >
                  <option value="">-- Chọn nhóm --</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddSubmit}
                disabled={actionLoading}
                className="w-full md:w-auto px-4 py-1.5 bg-gold text-black rounded-lg text-sm font-bold hover:bg-gold/90 transition-all disabled:opacity-50 h-[34px]"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
