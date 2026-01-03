"use client";

import { useState, useEffect } from "react";
import { FormSection } from "./FormSection";
import { Search, Check } from "lucide-react";

interface Team {
  id: number;
  name: string;
  short_name?: string | null;
  logo_url: string | null;
  region: string | null;
  regionRef?: { name: string } | null;
  groups?: { group_id: number }[];
}

interface Group {
  id: number;
  name: string;
}

interface OpponentSectionProps {
  opponentId: number | null;
  initialOpponentName?: string | undefined;
  onChange: (id: number | null, name: string, shortName?: string) => void;
  autoSelectedGroupId?: number | null;
}

export function OpponentSection({ opponentId, initialOpponentName, onChange, autoSelectedGroupId }: OpponentSectionProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (autoSelectedGroupId) {
      setSelectedGroupId(String(autoSelectedGroupId));
    }
  }, [autoSelectedGroupId]);

  useEffect(() => {
    Promise.all([
      fetch("/api/staff/resources/groups").then(res => res.json()),
      fetch("/api/staff/resources/teams").then(res => res.json())
    ]).then(([groupsData, teamsData]) => {
      if (Array.isArray(groupsData)) setGroups(groupsData);
      let loadedTeams: Team[] = [];
      if (Array.isArray(teamsData)) {
        setTeams(teamsData);
        loadedTeams = teamsData;
      }
      setLoading(false);

      // Attempt to auto-select based on name if ID is missing
      if (!opponentId && initialOpponentName && loadedTeams.length > 0) {
        const found = loadedTeams.find(t => t.name.toLowerCase() === initialOpponentName.toLowerCase());
        if (found) {
          onChange(found.id, found.name, found.short_name || undefined);
        }
      }
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredTeams = teams.filter(team => {
    const searchLower = searchTerm.toLowerCase();
    const matchesName = team.name.toLowerCase().includes(searchLower);
    const matchesShortName = team.short_name?.toLowerCase().includes(searchLower);
    const matchesSearch = matchesName || matchesShortName;
    const matchesGroup = selectedGroupId
      ? team.groups?.some(g => g.group_id === Number(selectedGroupId))
      : true;
    return matchesSearch && matchesGroup;
  });

  const selectedTeam = teams.find(t => t.id === opponentId);

  return (
    <FormSection title="Đối thủ" className="h-full" required>
      <div className="space-y-4">
        {/* Nhóm đối thủ (Filter) */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Nhóm đối thủ (Lọc)</label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
          >
            <option value="">-- Tất cả --</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Searchable Select */}
        <div className="space-y-2 relative">
          <label className="text-sm text-gray-400">Chọn đối thủ</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc viết tắt (VD: T1, HLE)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-gold outline-none pl-9"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          </div>

          {/* Dropdown Results */}
          {isDropdownOpen && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredTeams.length > 0 ? (
                filteredTeams.map(team => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      onChange(team.id, team.name, team.short_name || undefined);
                      setSearchTerm("");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center gap-3 transition-colors"
                  >
                    {team.logo_url ? (
                      <img src={team.logo_url} alt={team.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-[10px]">{team.name[0]}</div>
                    )}
                    <div className="flex-1">
                      <span className="text-gray-200">{team.name}</span>
                      {team.short_name && (
                        <span className="text-xs text-gold ml-2 font-mono">({team.short_name})</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{team.regionRef?.name || team.region}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  Không tìm thấy kết quả.<br />
                  <span className="text-xs text-gray-600">Vui lòng thêm đội trong tab Resources.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preview Đối thủ đã chọn */}
        <div className={`flex items-center gap-3 p-3 rounded border transition-colors ${selectedTeam ? 'bg-gray-800/80 border-gold/50' : 'bg-gray-800/30 border-gray-700'}`}>
          {selectedTeam ? (
            <>
              {selectedTeam.logo_url ? (
                <img src={selectedTeam.logo_url} alt={selectedTeam.name} className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">{selectedTeam.name[0]}</div>
              )}
              <div>
                <div>
                  <span className="font-bold text-gold">{selectedTeam.name}</span>
                  {selectedTeam.short_name && (
                    <span className="text-sm text-gold/60 ml-2 font-mono">({selectedTeam.short_name})</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{selectedTeam.regionRef?.name || selectedTeam.region || "Unknown Region"}</div>
              </div>
              <div className="ml-auto text-green-400">
                <Check size={20} />
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
              <div>
                <div className="font-bold text-gray-400">Chưa chọn đối thủ</div>
                <div className="text-xs text-gray-500">Vui lòng tìm kiếm bên trên</div>
              </div>
            </>
          )}
        </div>
      </div>
    </FormSection>
  );
}
