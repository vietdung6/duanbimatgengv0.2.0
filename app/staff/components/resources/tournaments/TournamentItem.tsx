import React, { useState } from 'react';
import { Trophy, Users, Trash2, Edit2, Check, X } from 'lucide-react';
import { TournamentResource, OpponentGroup } from "./types";

interface TournamentItemProps {
  tournament: TournamentResource;
  groups: OpponentGroup[];
  onUpdate: (id: number, data: Partial<TournamentResource>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TournamentItem({ tournament, groups, onUpdate, onDelete }: TournamentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: tournament.name,
    year: tournament.year,
    opponent_group_id: tournament.opponent_group_id
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate(tournament.id, {
        name: editValues.name,
        year: Number(editValues.year),
        type_id: tournament.type_id, // Preserve existing type_id
        opponent_group_id: editValues.opponent_group_id ?? null
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update tournament", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValues({
      name: tournament.name,
      year: tournament.year,
      opponent_group_id: tournament.opponent_group_id
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 rounded-lg bg-black/40 border border-gold/30 text-sm">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={editValues.year}
            onChange={(e) => setEditValues({ ...editValues, year: Number(e.target.value) })}
            className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-gold font-bold text-center outline-none focus:border-gold/50"
          />
          <input
            type="text"
            value={editValues.name}
            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
            className="flex-1 md:w-64 bg-black/40 border border-white/10 rounded px-2 py-1 text-gray-300 font-medium outline-none focus:border-gold/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <select
            value={editValues.opponent_group_id || ""}
            onChange={(e) => setEditValues({ ...editValues, opponent_group_id: e.target.value ? Number(e.target.value) : null })}
            className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-gray-300 outline-none focus:border-gold/50"
          >
            <option value="">-- Nhóm --</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={loading}
            className="p-1.5 text-green-500 hover:bg-green-500/10 rounded transition-all"
            title="Lưu"
          >
            <Check size={14} />
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-all"
            title="Hủy"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 rounded-lg bg-black/20 border border-white/5 text-sm hover:border-gold/30 transition-colors group">
      <div className="flex items-center gap-2">
        <span className="text-gold font-bold w-12">{tournament.year}</span>
        <span className="md:hidden flex-1 text-gray-300 font-medium">{tournament.name}</span>
      </div>
      <span className="hidden md:block flex-1 text-gray-300 font-medium">{tournament.name}</span>
      <div className="flex items-center gap-2 justify-between md:justify-end w-full md:w-auto">
        <div className="flex items-center gap-2">
          {tournament.opponent_group && (
            <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
              <Users size={12} />
              {tournament.opponent_group.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all"
            title="Sửa giải đấu"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(tournament.id)}
            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
            title="Xóa giải đấu"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
