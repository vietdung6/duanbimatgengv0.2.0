import { useState } from "react";
import { ChevronDown, ChevronUp, Tag, Edit2, Trash2, Check, X } from "lucide-react";
import TournamentTypeExpandedRow from "./TournamentTypeExpandedRow";
import { TournamentType, TournamentResource, OpponentGroup } from "./types";

interface TournamentTypeRowProps {
  type: TournamentType;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (id: number, data: Partial<TournamentType>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  
  // For Expanded Row
  tournaments: TournamentResource[];
  groups: OpponentGroup[];
  onAddTournament: (type: TournamentType, data: { name: string; year: number; patch: string; groupId: number | null }) => Promise<void>;
  onUpdateTournament: (id: number, data: Partial<TournamentResource>) => Promise<void>;
  onDeleteTournament: (id: number) => Promise<void>;
}

export default function TournamentTypeRow({
  type,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  tournaments,
  groups,
  onAddTournament,
  onUpdateTournament,
  onDeleteTournament
}: TournamentTypeRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(type.name);
  const [editLogo, setEditLogo] = useState(type.logo || "");
  const [editCategory, setEditCategory] = useState<"MAJOR" | "FRIENDLY">(type.category);
  const [editDesc, setEditDesc] = useState(type.description || "");
  const [loading, setLoading] = useState(false);

  const handleStartEdit = () => {
    setEditName(type.name);
    setEditLogo(type.logo || "");
    setEditCategory(type.category);
    setEditDesc(type.description || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(type.id, {
        name: editName,
        logo: editLogo,
        category: editCategory,
        description: editDesc
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(type.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <tr className={`group hover:bg-white/[0.02] transition-colors ${isExpanded ? 'bg-white/[0.02]' : ''}`}>
        <td className="px-2 md:px-6 py-4">
          <button onClick={onToggleExpand} className="text-gray-500 hover:text-gold transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
        <td className="px-2 md:px-6 py-4">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-3 text-sm outline-none focus:border-gold/50"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex w-8 h-8 rounded-lg bg-gold/10 items-center justify-center text-gold overflow-hidden">
                 {type.logo ? (
                   type.logo.startsWith('<svg') ? (
                  <div className="w-5 h-5 [&>svg]:!w-full [&>svg]:!h-full [&>svg]:!fill-current" dangerouslySetInnerHTML={{ __html: type.logo }} />
                ) : (
                     <img src={type.logo} alt={type.name} className="w-full h-full object-cover" />
                   )
                 ) : (
                   <Tag size={16} />
                 )}
              </div>
              <span className="font-bold text-gray-200">{type.name}</span>
            </div>
          )}
        </td>
        <td className="px-2 md:px-6 py-4">
          {isEditing ? (
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as "MAJOR" | "FRIENDLY")}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-3 text-sm outline-none focus:border-gold/50"
            >
              <option value="MAJOR">Major</option>
              <option value="FRIENDLY">Friendly</option>
            </select>
          ) : (
            <span className={`text-xs px-2 py-1 rounded-md ${
              type.category === 'MAJOR' 
                ? 'bg-gold/20 text-gold border border-gold/30' 
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {type.category}
            </span>
          )}
        </td>
        <td className="hidden md:table-cell px-6 py-4">
          {isEditing ? (
            <input
              type="text"
              value={editLogo}
              onChange={(e) => setEditLogo(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-3 text-sm outline-none focus:border-gold/50"
            />
          ) : (
            <div className="max-w-[150px] truncate text-gray-500 text-xs" title={type.logo || undefined}>
              {type.logo || '-'}
            </div>
          )}
        </td>
        <td className="hidden md:table-cell px-6 py-4 text-gray-400">
          {isEditing ? (
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-3 text-sm outline-none focus:border-gold/50"
            />
          ) : (
            type.description || "—"
          )}
        </td>
        <td className="px-2 md:px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancelEdit} 
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <X size={16} />
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="p-2 text-gold hover:text-white transition-colors disabled:opacity-50"
                >
                  <Check size={16} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleStartEdit} 
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-gold transition-colors disabled:opacity-50"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={handleDelete} 
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <TournamentTypeExpandedRow 
          type={type}
          tournaments={tournaments}
          groups={groups}
          onAdd={onAddTournament}
          onUpdate={onUpdateTournament}
          onDelete={onDeleteTournament}
        />
      )}
    </>
  );
}
