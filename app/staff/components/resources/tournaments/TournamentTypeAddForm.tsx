import { useState } from "react";
import { Plus } from "lucide-react";

interface TournamentTypeAddFormProps {
  onAdd: (data: { name: string; logo: string; category: "MAJOR" | "FRIENDLY"; description: string }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function TournamentTypeAddForm({ onAdd, onCancel, loading }: TournamentTypeAddFormProps) {
  const [newName, setNewName] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [newCategory, setNewCategory] = useState<"MAJOR" | "FRIENDLY">("MAJOR");
  const [newDesc, setNewDesc] = useState("");

  const handleSubmit = async () => {
    if (!newName) return;
    await onAdd({
      name: newName,
      logo: newLogo,
      category: newCategory,
      description: newDesc
    });
  };

  return (
    <div className="p-4 bg-white/5 border border-gold/30 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
      <h3 className="text-sm font-bold text-gold">Thêm loại giải đấu mới</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase tracking-widest">Tên loại (Name)</label>
          <input
            type="text"
            placeholder="e.g. Worlds"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase tracking-widest">Phân loại</label>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as "MAJOR" | "FRIENDLY")}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
          >
            <option value="MAJOR">Chính thức (Major)</option>
            <option value="FRIENDLY">Giao hữu (Friendly)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase tracking-widest">Logo (SVG/URL)</label>
          <input
            type="text"
            placeholder="SVG code or URL"
            value={newLogo}
            onChange={(e) => setNewLogo(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase tracking-widest">Mô tả</label>
          <input
            type="text"
            placeholder="Giải vô địch thế giới"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-gold/50"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button 
          onClick={onCancel} 
          disabled={loading}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50"
        >
          Hủy
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="px-4 py-2 bg-gold text-black rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
          Lưu lại
        </button>
      </div>
    </div>
  );
}
