import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";
import TournamentTypeAddForm from "./TournamentTypeAddForm";
import TournamentTypeRow from "./TournamentTypeRow";
import { TournamentType, TournamentResource, OpponentGroup } from "./types";

export default function TournamentTypeManagement() {
  const { showToast } = useToast();
  const [types, setTypes] = useState<TournamentType[]>([]);
  const [tournaments, setTournaments] = useState<TournamentResource[]>([]);
  const [groups, setGroups] = useState<OpponentGroup[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [expandedTypeId, setExpandedTypeId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [typeRes, tRes, gRes] = await Promise.all([
        fetch("/api/staff/resources/tournament-types"),
        fetch("/api/staff/resources/tournaments"),
        fetch("/api/staff/resources/groups")
      ]);

      const typeData = await typeRes.json();
      const tData = await tRes.json();
      const gData = await gRes.json();

      if (typeRes.ok && tRes.ok && gRes.ok) {
        setTypes(Array.isArray(typeData) ? typeData : []);
        setTournaments(Array.isArray(tData) ? tData : []);
        setGroups(Array.isArray(gData) ? gData : []);
      } else {
        throw new Error("Không thể tải dữ liệu");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = async (data: { name: string; logo: string; category: "MAJOR" | "FRIENDLY"; description: string }) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/staff/resources/tournament-types", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        showToast("Đã thêm loại giải đấu thành công", "success");
        setIsAdding(false);
        fetchData();
      } else {
        throw new Error(result.details ? `${result.error} (${result.details})` : (result.error || "Lỗi khi thêm"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      showToast(message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateType = async (id: number, data: Partial<TournamentType>) => {
    try {
      const res = await fetch("/api/staff/resources/tournament-types", {
        method: "PUT",
        body: JSON.stringify({ id, ...data }),
      });
      const result = await res.json();
      if (res.ok) {
        showToast("Đã cập nhật thành công", "success");
        fetchData();
      } else {
        throw new Error(result.details ? `${result.error} (${result.details})` : (result.error || "Lỗi khi cập nhật"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      showToast(message, "error");
      throw error;
    }
  };

  const handleDeleteType = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa loại giải đấu này?")) return;
    try {
      const res = await fetch(`/api/staff/resources/tournament-types?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Đã xóa thành công", "success");
        fetchData();
      } else {
        throw new Error(data.details ? `${data.error} (${data.details})` : (data.error || "Lỗi khi xóa"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      showToast(message, "error");
      throw error;
    }
  };

  const handleAddTournament = async (type: TournamentType, formData: { name: string; year: number; patch: string; groupId: number | null }) => {
    try {
      const res = await fetch("/api/staff/resources/tournaments", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          year: formData.year,
          patch: formData.patch,
          type_id: type.id,
          is_official: true,
          is_current: false,
          opponent_group_id: formData.groupId
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Đã thêm giải đấu thành công", "success");
        fetchData();
      } else {
        throw new Error(data.details ? `${data.error} (${data.details})` : (data.error || "Lỗi khi thêm giải đấu"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      showToast(message, "error");
      throw error;
    }
  };

  const handleUpdateTournament = async (id: number, data: Partial<TournamentResource>) => {
    try {
      const res = await fetch("/api/staff/resources/tournaments", {
        method: "PUT",
        body: JSON.stringify({ id, ...data }),
      });
      const result = await res.json();
      if (res.ok) {
        showToast("Đã cập nhật giải đấu thành công", "success");
        fetchData();
      } else {
        throw new Error(result.details ? `${result.error} (${result.details})` : (result.error || "Lỗi khi cập nhật giải đấu"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      showToast(message, "error");
      throw error;
    }
  };

  const handleDeleteTournament = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa giải đấu này?")) return;
    try {
      const res = await fetch(`/api/staff/resources/tournaments?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Đã xóa giải đấu thành công", "success");
        fetchData();
      } else {
        throw new Error(data.details ? `${data.error} (${data.details})` : (data.error || "Lỗi khi xóa giải đấu"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      showToast(message, "error");
    }
  };

  const toggleExpand = (typeId: number) => {
    setExpandedTypeId(prev => prev === typeId ? null : typeId);
  };

  const filteredTypes = types.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm loại giải..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-gold/50 outline-none transition-all"
          />
        </div>
        <button
          onClick={() => setIsAdding(true)}
          disabled={actionLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50"
        >
          <Plus size={18} />
          Thêm loại giải
        </button>
      </div>

      {isAdding && (
        <TournamentTypeAddForm 
          onAdd={handleAddType}
          onCancel={() => setIsAdding(false)}
          loading={actionLoading}
        />
      )}

      <div className="overflow-hidden border border-white/10 rounded-xl bg-black/20">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
            <tr>
              <th className="w-10 px-2 md:px-6 py-4"></th>
              <th className="px-2 md:px-6 py-4">Tên loại</th>
              <th className="px-2 md:px-6 py-4">Phân loại</th>
              <th className="hidden md:table-cell px-6 py-4">Logo</th>
              <th className="hidden md:table-cell px-6 py-4">Mô tả</th>
              <th className="px-2 md:px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Đang tải...</td></tr>
            ) : filteredTypes.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Chưa có loại giải đấu nào</td></tr>
            ) : (
              filteredTypes.map(t => (
                <TournamentTypeRow
                  key={t.id}
                  type={t}
                  isExpanded={expandedTypeId === t.id}
                  onToggleExpand={() => toggleExpand(t.id)}
                  onUpdate={handleUpdateType}
                  onDelete={handleDeleteType}
                  tournaments={tournaments.filter(tour => tour.type_id === t.id)}
                  groups={groups}
                  onAddTournament={handleAddTournament}
                  onUpdateTournament={handleUpdateTournament}
                  onDeleteTournament={handleDeleteTournament}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
