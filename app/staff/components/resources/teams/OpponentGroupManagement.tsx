"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2, Check, X, Users as UsersIcon, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";

interface TeamResource {
  id: number;
  name: string;
  logo_url: string | null;
}

interface OpponentGroup {
  id: number;
  name: string;
  members: { team: TeamResource }[];
}

export default function OpponentGroupManagement() {
  const { showToast } = useToast();
  const [groups, setGroups] = useState<OpponentGroup[]>([]);
  const [teams, setTeams] = useState<TeamResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [newName, setNewName] = useState("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, teamsRes] = await Promise.all([
        fetch("/api/staff/resources/groups"),
        fetch("/api/staff/resources/teams")
      ]);
      const groupsData = await groupsRes.json();
      const teamsData = await teamsRes.json();

      if (!groupsRes.ok) {
        throw new Error(groupsData.details ? `${groupsData.error} (${groupsData.details})` : (groupsData.error || "Không thể tải danh sách nhóm"));
      }
      if (!teamsRes.ok) {
        throw new Error(teamsData.details ? `${teamsData.error} (${teamsData.details})` : (teamsData.error || "Không thể tải danh sách đội"));
      }

      setGroups(Array.isArray(groupsData) ? groupsData : []);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error: any) {
      showToast(error.message || "Không thể tải dữ liệu", "error");
      setGroups([]);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName) return showToast("Vui lòng nhập tên nhóm", "error");
    try {
      const res = await fetch("/api/staff/resources/groups", {
        method: "POST",
        body: JSON.stringify({ name: newName, teamIds: selectedTeamIds }),
      });
      if (res.ok) {
        showToast("Đã thêm nhóm thành công", "success");
        setIsAdding(false);
        setNewName("");
        setSelectedTeamIds([]);
        fetchData();
      }
    } catch (error) {
      showToast("Lỗi khi thêm nhóm", "error");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!newName) return showToast("Vui lòng nhập tên nhóm", "error");
    try {
      const res = await fetch("/api/staff/resources/groups", {
        method: "PUT",
        body: JSON.stringify({ id, name: newName, teamIds: selectedTeamIds }),
      });
      if (res.ok) {
        showToast("Đã cập nhật nhóm thành công", "success");
        setEditingId(null);
        setNewName("");
        setSelectedTeamIds([]);
        fetchData();
      }
    } catch (error) {
      showToast("Lỗi khi cập nhật nhóm", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhóm này?")) return;
    try {
      const res = await fetch(`/api/staff/resources/groups?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Đã xóa nhóm thành công", "success");
        fetchData();
      }
    } catch (error) {
      showToast("Lỗi khi xóa nhóm", "error");
    }
  };

  const startEdit = (group: OpponentGroup) => {
    setEditingId(group.id);
    setNewName(group.name);
    setSelectedTeamIds(group.members.map(m => m.team.id));
  };

  const toggleTeamSelection = (teamId: number) => {
    setSelectedTeamIds(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">Nhóm các đối thủ để hỗ trợ nhập liệu nhanh hơn.</p>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setNewName("");
            setSelectedTeamIds([]);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
        >
          <Plus size={18} />
          Tạo nhóm mới
        </button>
      </div>

      {(isAdding || editingId !== null) && (
        <div className="p-6 bg-white/5 border border-gold/30 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gold">
              {editingId !== null ? "Chỉnh sửa nhóm" : "Tạo nhóm đối thủ mới"}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase tracking-widest">Tên nhóm</label>
              <input
                type="text"
                placeholder="Ví dụ: LCK Teams, Rivals, ..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-gold/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase tracking-widest">Chọn thành viên ({selectedTeamIds.length})</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-2 bg-black/20 rounded-xl custom-scrollbar">
                {teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => toggleTeamSelection(team.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                      selectedTeamIds.includes(team.id)
                        ? 'bg-gold/20 border-gold text-gold shadow-[0_0_10px_rgba(170,128,24,0.1)]'
                        : 'bg-white/5 border-transparent text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-black/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {team.logo_url ? (
                        <img src={team.logo_url} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <UsersIcon size={12} />
                      )}
                    </div>
                    <span className="text-xs truncate">{team.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); }} 
              className="px-6 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={() => editingId !== null ? handleUpdate(editingId) : handleAdd()} 
              className="px-8 py-2 bg-gold text-black rounded-xl text-sm font-bold shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Lưu nhóm
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-500">Đang tải...</div>
        ) : groups.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">Chưa có nhóm nào được tạo</div>
        ) : (
          groups.map(group => (
            <div key={group.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-gold transition-colors">{group.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">{group.members.length} đối thủ</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(group)} className="p-2 text-gray-500 hover:text-gold transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(group.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {group.members.map(({ team }) => (
                  <div key={team.id} className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-lg border border-white/5">
                    {team.logo_url && <img src={team.logo_url} alt="" className="w-3 h-3 object-contain" />}
                    <span className="text-[11px] text-gray-300">{team.name}</span>
                  </div>
                ))}
                {group.members.length === 0 && (
                  <p className="text-xs text-gray-600 italic">Nhóm trống</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
