"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2, Check, X, Users } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";

interface SquadPreset {
  id: number;
  name: string;
  top: string | null;
  jungle: string | null;
  mid: string | null;
  ad: string | null;
  support: string | null;
  coach: string | null;
  sub: string | null;
  is_active: boolean;
}

const PlayerInput = ({ label, role, value, onChange, players }: { label: string, role: string, value: string, onChange: (val: string) => void, players: any[] }) => {
  const getPlayerByIgn = (ign: string | null) => players.find(p => p.ign.toLowerCase() === ign?.toLowerCase());
  const getPlayersByRole = (role: string) => players.filter(p => p.role === role && p.is_active);

  const player = getPlayerByIgn(value);
  const roleId = `players-${role}`;

  return (
    <div className="relative">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            list={roleId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none pl-10"
            placeholder={`Chọn ${label}...`}
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center border border-gray-600">
            {player?.image_url ? (
              <img src={player.image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <Users size={12} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>
      <datalist id={roleId}>
        {getPlayersByRole(role).map(p => <option key={p.id} value={p.ign} />)}
      </datalist>
    </div>
  );
};

export default function SquadPresetManagement() {
  const { showToast } = useToast();
  const [squads, setSquads] = useState<SquadPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    top: "",
    jungle: "",
    mid: "",
    ad: "",
    support: "",
    coach: "",
    sub: "",
    is_active: true
  });

  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    fetchSquads();
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/staff/resources/players");
      const data = await res.json();
      if (res.ok) setPlayers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch players", error);
    }
  };

  const getPlayersByRole = (role: string) => players.filter(p => p.role === role && p.is_active);
  const getPlayerByIgn = (ign: string | null) => players.find(p => p.ign.toLowerCase() === ign?.toLowerCase());

  const fetchSquads = async () => {
    try {
      const res = await fetch("/api/staff/resources/squads");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch squads");
      setSquads(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      top: "",
      jungle: "",
      mid: "",
      ad: "",
      support: "",
      coach: "",
      sub: "",
      is_active: true
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEditClick = (squad: SquadPreset) => {
    setFormData({
      name: squad.name,
      top: squad.top || "",
      jungle: squad.jungle || "",
      mid: squad.mid || "",
      ad: squad.ad || "",
      support: squad.support || "",
      coach: squad.coach || "",
      sub: squad.sub || "",
      is_active: squad.is_active
    });
    setEditingId(squad.id);
    setIsAdding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return showToast("Vui lòng nhập tên đội hình", "error");

    try {
      const url = "/api/staff/resources/squads";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(editingId ? "Cập nhật thành công" : "Thêm mới thành công", "success");
        fetchSquads();
        resetForm();
      } else {
        throw new Error("Action failed");
      }
    } catch (error) {
      showToast("Có lỗi xảy ra", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đội hình này?")) return;
    try {
      const res = await fetch(`/api/staff/resources/squads?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Đã xóa thành công", "success");
        fetchSquads();
      }
    } catch (error) {
      showToast("Lỗi khi xóa", "error");
    }
  };

  const filteredSquads = squads.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/[0.03] p-4 rounded-xl border border-white/5">
        <div>
          <h2 className="text-xl font-bold text-gold">Quản lý Đội hình</h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý các mẫu đội hình (Squad Presets) để sử dụng nhanh trong lịch thi đấu.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-black rounded-xl text-sm font-bold hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          Thêm Đội hình Mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm đội hình theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-gold/50 outline-none transition-all"
        />
      </div>

      {/* Form Area */}
      {
        (isAdding || editingId) && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingId ? "Chỉnh sửa Đội hình" : "Thêm Đội hình Mới"}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Tên Preset (VD: Gen.G 2024, LCK Spring 2025)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
                  placeholder="Ví dụ: Gen.G 2024 LCK Summer"
                />
              </div>

              <PlayerInput
                label="Top"
                role="TOP"
                value={formData.top}
                onChange={(v) => setFormData(prev => ({ ...prev, top: v }))}
                players={players}
              />
              <PlayerInput
                label="Jungle"
                role="JUNGLE"
                value={formData.jungle}
                onChange={(v) => setFormData(prev => ({ ...prev, jungle: v }))}
                players={players}
              />
              <PlayerInput
                label="Mid"
                role="MID"
                value={formData.mid}
                onChange={(v) => setFormData(prev => ({ ...prev, mid: v }))}
                players={players}
              />
              <PlayerInput
                label="ADC"
                role="AD"
                value={formData.ad}
                onChange={(v) => setFormData(prev => ({ ...prev, ad: v }))}
                players={players}
              />
              <PlayerInput
                label="Support"
                role="SUPPORT"
                value={formData.support}
                onChange={(v) => setFormData(prev => ({ ...prev, support: v }))}
                players={players}
              />
              <PlayerInput
                label="Coach"
                role="COACH"
                value={formData.coach}
                onChange={(v) => setFormData(prev => ({ ...prev, coach: v }))}
                players={players}
              />

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Sub (Dự bị)</label>
                <div className="relative">
                  <input
                    type="text"
                    list="players-SUB"
                    value={formData.sub}
                    onChange={(e) => setFormData({ ...formData, sub: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none pl-10"
                    placeholder="Nhập tên dự bị (nếu có)"
                  />
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center border border-gray-600">
                    {getPlayerByIgn(formData.sub)?.image_url ? (
                      <img src={getPlayerByIgn(formData.sub).image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Users size={12} className="text-gray-400" />
                    )}
                  </div>
                </div>
                <datalist id="players-SUB">
                  {players.map(p => <option key={p.id} value={p.ign} />)}
                </datalist>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gold text-black px-8 py-2.5 rounded-xl font-bold hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 transition-all active:scale-95"
                >
                  <Check size={18} />
                  {editingId ? "Cập nhật Đội hình" : "Thêm mới Đội hình"}
                </button>
              </div>
            </form>
          </div>
        )
      }

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400 col-span-full text-center py-8">Đang tải...</p>
        ) : filteredSquads.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-8">Chưa có đội hình nào. Hãy tạo mới!</p>
        ) : (
          filteredSquads.map((squad) => (
            <div key={squad.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors relative group">
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditClick(squad)}
                  className="p-1.5 bg-gray-800 text-blue-400 rounded hover:bg-gray-700"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(squad.id)}
                  className="p-1.5 bg-gray-800 text-red-400 rounded hover:bg-gray-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold border border-gold/20">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{squad.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${squad.is_active ? "bg-green-900 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                    {squad.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Main Roster */}
                <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                  {["top", "jungle", "mid", "ad", "support"].map((role) => {
                    const ign = squad[role as keyof SquadPreset] as string;
                    const player = getPlayerByIgn(ign);
                    return (
                      <div key={role} className="flex flex-col items-center gap-1 group/player relative">
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                          {player?.image_url ? (
                            <img src={player.image_url} alt={ign} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-500">{role.substring(0, 1).toUpperCase()}</span>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-300 truncate max-w-[60px]">{ign || "-"}</span>

                        {/* Tooltip for Role */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover/player:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {role.toUpperCase()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coach & Sub */}
                <div className="flex gap-4 text-xs text-gray-400 border-t border-gray-800 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-500">COACH:</span>
                    <span className="text-white">{squad.coach || "-"}</span>
                  </div>
                  {squad.sub && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-500">SUB:</span>
                      <span className="text-white">{squad.sub}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div >
  );
}
