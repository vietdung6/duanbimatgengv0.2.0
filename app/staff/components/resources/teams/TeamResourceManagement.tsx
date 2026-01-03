"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2, Check, X, Image as ImageIcon, Globe } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";

interface Region {
  id: number;
  name: string;
}

interface TeamResource {
  id: number;
  name: string;
  logo_url: string | null;
  region: string | null;
  short_name: string | null;
  region_id: number | null;
  regionRef: Region | null;
}

export default function TeamResourceManagement() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState<TeamResource[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Region management state
  const [isManageRegions, setIsManageRegions] = useState(false);
  const [newRegionName, setNewRegionName] = useState("");

  // Form states
  const [newName, setNewName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [newRegionId, setNewRegionId] = useState<number | string>(""); // Use ID for selection
  const [newShortName, setNewShortName] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const res = await fetch("/api/staff/resources/regions");
      const data = await res.json();
      if (res.ok) {
        setRegions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch regions");
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/staff/resources/teams");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ? `${data.error} (${data.details})` : (data.error || "Không thể tải danh sách đội"));
      }
      setTeams(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast(error.message || "Không thể tải danh sách đội", "error");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRegion = async () => {
    if (!newRegionName) return;
    try {
      const res = await fetch("/api/staff/resources/regions", {
        method: "POST",
        body: JSON.stringify({ name: newRegionName }),
      });
      if (res.ok) {
        showToast("Đã thêm khu vực", "success");
        setNewRegionName("");
        fetchRegions();
      } else {
        showToast("Lỗi khi thêm khu vực", "error");
      }
    } catch (error) {
      showToast("Lỗi khi thêm khu vực", "error");
    }
  };

  const handleDeleteRegion = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa khu vực này?")) return;
    try {
      const res = await fetch(`/api/staff/resources/regions?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Đã xóa khu vực", "success");
        fetchRegions();
      }
    } catch (error) {
      showToast("Lỗi khi xóa khu vực", "error");
    }
  };

  const handleAdd = async () => {
    if (!newName) return showToast("Vui lòng nhập tên đội", "error");
    try {
      const res = await fetch("/api/staff/resources/teams", {
        method: "POST",
        body: JSON.stringify({ 
          name: newName, 
          logo_url: newLogoUrl, 
          region_id: newRegionId ? Number(newRegionId) : null,
          short_name: newShortName 
        }),
      });
      if (res.ok) {
        showToast("Đã thêm đội thành công", "success");
        setIsAdding(false);
        setNewName("");
        setNewLogoUrl("");
        setNewRegionId("");
        setNewShortName("");
        fetchTeams();
      }
    } catch (error) {
      showToast("Lỗi khi thêm đội", "error");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!newName) return showToast("Vui lòng nhập tên đội", "error");
    try {
      const res = await fetch("/api/staff/resources/teams", {
        method: "PUT",
        body: JSON.stringify({ 
          id, 
          name: newName, 
          logo_url: newLogoUrl, 
          region_id: newRegionId ? Number(newRegionId) : null,
          short_name: newShortName 
        }),
      });
      if (res.ok) {
        showToast("Đã cập nhật đội thành công", "success");
        setEditingId(null);
        setNewName("");
        setNewLogoUrl("");
        setNewRegionId("");
        setNewShortName("");
        fetchTeams();
      }
    } catch (error) {
      showToast("Lỗi khi cập nhật đội", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đội này?")) return;
    try {
      const res = await fetch(`/api/staff/resources/teams?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Đã xóa đội thành công", "success");
        fetchTeams();
      }
    } catch (error) {
      showToast("Lỗi khi xóa đội", "error");
    }
  };

  const startEdit = (team: TeamResource) => {
    setEditingId(team.id);
    setNewName(team.name);
    setNewLogoUrl(team.logo_url || "");
    setNewRegionId(team.regionRef?.id || team.region_id || "");
    setNewShortName(team.short_name || "");
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.short_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.region?.toLowerCase().includes(search.toLowerCase()) ||
    t.regionRef?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm đội..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-gold/50 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsManageRegions(!isManageRegions)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-all"
          >
            <Globe size={18} />
            Quản lý Khu vực
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
          >
            <Plus size={18} />
            Thêm đội mới
          </button>
        </div>
      </div>

      {isManageRegions && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe size={16} /> Quản lý Khu vực
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tên khu vực mới (Ví dụ: LCK, LPL)"
              value={newRegionName}
              onChange={(e) => setNewRegionName(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
            />
            <button 
              onClick={handleAddRegion}
              className="px-4 py-2 bg-gold text-black rounded-lg text-sm font-bold whitespace-nowrap"
            >
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.map(r => (
              <div key={r.id} className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg group">
                <span className="text-sm text-gray-300">{r.name}</span>
                <button 
                  onClick={() => handleDeleteRegion(r.id)}
                  className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {regions.length === 0 && <p className="text-sm text-gray-500">Chưa có khu vực nào</p>}
          </div>
        </div>
      )}

      {isAdding && (
        <div className="p-4 bg-white/5 border border-gold/30 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-gold">Thêm đội mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tên đội (Ví dụ: T1, Gen.G, ...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
            />
            <input
              type="text"
              placeholder="Tên viết tắt (Ví dụ: T1, GEN)"
              value={newShortName}
              onChange={(e) => setNewShortName(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
            />
            <select
              value={newRegionId}
              onChange={(e) => setNewRegionId(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50 text-gray-300"
            >
              <option value="">Chọn khu vực</option>
              {regions.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="URL Logo"
              value={newLogoUrl}
              onChange={(e) => setNewLogoUrl(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Hủy</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-gold text-black rounded-lg text-sm font-bold">Lưu lại</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-500">Đang tải...</div>
        ) : filteredTeams.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">Không tìm thấy đội nào</div>
        ) : (
          filteredTeams.map(team => (
            <div key={team.id} className="group relative p-4 bg-white/5 border border-white/10 rounded-xl hover:border-gold/30 transition-all">
              {editingId === team.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Tên đội"
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newShortName}
                      onChange={(e) => setNewShortName(e.target.value)}
                      placeholder="Viết tắt"
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm outline-none"
                    />
                    <select
                      value={newRegionId}
                      onChange={(e) => setNewRegionId(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm outline-none text-gray-300"
                    >
                      <option value="">Chọn khu vực</option>
                      {regions.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={newLogoUrl}
                    onChange={(e) => setNewLogoUrl(e.target.value)}
                    placeholder="URL Logo"
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:text-red-400"><X size={16} /></button>
                    <button onClick={() => handleUpdate(team.id)} className="p-1.5 text-gold hover:text-white"><Check size={16} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center border border-white/5 overflow-hidden">
                    {team.logo_url ? (
                      <img src={team.logo_url} alt={team.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <ImageIcon className="text-gray-600" size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{team.name}</p>
                      {team.short_name && <span className="text-xs text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">[{team.short_name}]</span>}
                    </div>
                    {(team.regionRef?.name || team.region) && (
                      <p className="text-xs text-gray-500 mt-0.5">{team.regionRef?.name || team.region}</p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(team)} className="p-2 text-gray-400 hover:text-gold transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(team.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
