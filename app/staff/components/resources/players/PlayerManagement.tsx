"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2, Check, X, User, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";

interface Player {
  id: number;
  ign: string;
  real_name: string | null;
  role: string;
  image_url: string | null;
  nationality: string | null;
  is_active: boolean;
  join_date: string | null;
}

const ROLES = ["TOP", "JUNGLE", "MID", "AD", "SUPPORT", "COACH", "SUB"];

export default function PlayerManagement() {
  const { showToast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    ign: "",
    real_name: "",
    role: "MID",
    image_url: "",
    nationality: "KR",
    is_active: true,
    join_date: ""
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/staff/resources/players");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch players");
      setPlayers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      ign: "",
      real_name: "",
      role: "MID",
      image_url: "",
      nationality: "KR",
      is_active: true,
      join_date: ""
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEditClick = (player: Player) => {
    setFormData({
      ign: player.ign,
      real_name: player.real_name || "",
      role: player.role,
      image_url: player.image_url || "",
      nationality: player.nationality || "KR",
      is_active: player.is_active,
      join_date: player.join_date ? new Date(player.join_date).toISOString().split('T')[0] || "" : ""
    });
    setEditingId(player.id);
    setIsAdding(false);
  };

  const handleSubmit = async () => {
    if (!formData.ign) return showToast("Vui lòng nhập IGN (Tên thi đấu)", "error");

    try {
      const url = "/api/staff/resources/players";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      showToast(editingId ? "Cập nhật thành công" : "Thêm mới thành công", "success");
      resetForm();
      fetchPlayers();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa tuyển thủ này?")) return;
    try {
      const res = await fetch(`/api/staff/resources/players?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Đã xóa thành công", "success");
        fetchPlayers();
      }
    } catch (error) {
      showToast("Lỗi khi xóa", "error");
    }
  };

  const filteredPlayers = players.filter(p => 
    p.ign.toLowerCase().includes(search.toLowerCase()) ||
    p.real_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm tuyển thủ (IGN, Tên thật, Vai trò)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-gold/50 outline-none transition-all"
          />
        </div>
        <button
          onClick={() => { resetForm(); setIsAdding(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
        >
          <Plus size={18} />
          Thêm Tuyển thủ
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="p-4 bg-white/5 border border-gold/30 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center">
             <h3 className="text-sm font-bold text-gold">{editingId ? "Cập nhật Tuyển thủ" : "Thêm Tuyển thủ Mới"}</h3>
             <button onClick={resetForm}><X className="text-gray-400 hover:text-white" size={18} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label className="text-xs text-gray-400 mb-1 block">IGN (In-Game Name) *</label>
                <input
                type="text"
                placeholder="Ví dụ: Chovy"
                value={formData.ign}
                onChange={(e) => handleInputChange("ign", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
                />
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Tên thật</label>
                <input
                type="text"
                placeholder="Ví dụ: Jeong Ji-hoon"
                value={formData.real_name}
                onChange={(e) => handleInputChange("real_name", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
                />
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Vai trò (Role) *</label>
                <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50 text-gray-300"
                >
                    {ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Quốc tịch</label>
                <input
                type="text"
                placeholder="Ví dụ: KR"
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
                />
            </div>
            <div className="lg:col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Avatar URL</label>
                <input
                type="text"
                placeholder="https://..."
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
                />
            </div>
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Ngày gia nhập</label>
                <input
                type="date"
                value={formData.join_date}
                onChange={(e) => handleInputChange("join_date", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50 text-gray-300"
                />
            </div>
            <div className="flex items-center gap-2 h-full pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange("is_active", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-gold focus:ring-gold bg-black/40"
                    />
                    <span className="text-sm text-gray-300">Đang hoạt động</span>
                </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Hủy</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-gold text-black rounded-lg text-sm font-bold">Lưu lại</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-500">Đang tải...</div>
        ) : filteredPlayers.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">Không tìm thấy tuyển thủ nào</div>
        ) : (
          filteredPlayers.map(player => (
            <div key={player.id} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-gold/30 transition-all">
              <div className="aspect-[4/3] bg-black/40 relative">
                {player.image_url ? (
                  <img src={player.image_url} alt={player.ign} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <User size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(player)} className="p-1.5 bg-black/60 text-white rounded hover:bg-gold hover:text-black transition-colors">
                        <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(player.id)} className="p-1.5 bg-black/60 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 size={14} />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white leading-none">{player.ign}</h3>
                            <p className="text-xs text-gray-400 mt-1">{player.real_name}</p>
                        </div>
                        <span className="text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                            {player.role}
                        </span>
                    </div>
                </div>
              </div>
              <div className="p-3 flex justify-between items-center text-xs text-gray-500 bg-white/[0.02]">
                 <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${player.is_active ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                    {player.is_active ? 'Active' : 'Inactive'}
                 </div>
                 <span>{player.nationality}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
