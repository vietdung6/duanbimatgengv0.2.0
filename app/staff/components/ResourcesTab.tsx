"use client";

import { useState } from "react";
import { Trophy, Users, Shield, Tag, UserPlus } from "lucide-react";
import TeamResourceManagement from "./resources/teams/TeamResourceManagement";
import SquadPresetManagement from "./resources/squads/SquadPresetManagement";
import PlayerManagement from "./resources/players/PlayerManagement";
import OpponentGroupManagement from "./resources/teams/OpponentGroupManagement";
import TournamentTypeManagement from "./resources/tournaments/TournamentTypeManagement";

export default function ResourcesTab() {
  const [activeSubTab, setActiveSubTab] = useState<'teams' | 'players' | 'squads' | 'groups' | 'tournament-types'>('teams');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl text-gold flex items-center gap-2">
          <Shield size={20} />
          Quản lý Tài nguyên
        </h2>
        <p className="text-xs text-gray-400 mt-1">Quản lý các thông tin dùng chung: Đội tuyển, Tuyển thủ, Đội hình, Giải đấu.</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('teams')}
          className={`px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
            activeSubTab === 'teams' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={16} />
            Đội tuyển
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('players')}
          className={`px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
            activeSubTab === 'players' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={16} />
            Tuyển thủ
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('squads')}
          className={`px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
            activeSubTab === 'squads' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <UserPlus size={16} />
            Presets Đội hình
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('groups')}
          className={`px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
            activeSubTab === 'groups' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={16} />
            Nhóm đối thủ
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('tournament-types')}
          className={`px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
            activeSubTab === 'tournament-types' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag size={16} />
            Loại giải đấu
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeSubTab === 'teams' && <TeamResourceManagement />}
        {activeSubTab === 'players' && <PlayerManagement />}
        {activeSubTab === 'squads' && <SquadPresetManagement />}
        {activeSubTab === 'groups' && <OpponentGroupManagement />}
        {activeSubTab === 'tournament-types' && <TournamentTypeManagement />}
      </div>
    </div>
  );
}
