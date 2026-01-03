"use client";

import { useState } from "react";
import { Check, Search, User } from "lucide-react";
import { FilterSection } from "../FilterSection";

interface PlayerFilterProps {
  pendingPlayers: string[];
  togglePendingPlayer: (id: string) => void;
  allPlayers: { id: string, name: string }[];
  isPlayerOpen: boolean;
  setIsPlayerOpen: (val: boolean) => void;
}

export function PlayerFilter({
  pendingPlayers,
  togglePendingPlayer,
  allPlayers,
  isPlayerOpen,
  setIsPlayerOpen
}: PlayerFilterProps) {
  const [playerSearch, setPlayerSearch] = useState("");
  
  const filteredPlayers = allPlayers.filter(p => 
    p.name.toLowerCase().includes(playerSearch.toLowerCase())
  );

  return (
    <FilterSection
      label="Tuyển thủ"
      icon={<User className="w-3 h-3" />}
      isOpen={isPlayerOpen}
      onToggle={() => setIsPlayerOpen(!isPlayerOpen)}
      badgeCount={pendingPlayers.length}
    >
      <div className="space-y-3 mt-3">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-2.5 h-2.5 group-focus-within:text-gold transition-colors" />
          <input 
            type="text"
            placeholder="Tìm tên tuyển thủ..."
            value={playerSearch}
            onChange={(e) => setPlayerSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 pl-8 pr-2 text-[9px] text-white outline-none focus:border-gold/30 transition-all"
          />
        </div>

        <div className="space-y-1.5 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
          <button
            onClick={() => togglePendingPlayer('all')}
            className={`w-full flex items-center justify-between py-1 px-2 rounded text-[8px] font-heading transition-all ${
              pendingPlayers.length === 0 
                ? "bg-gold/10 text-gold" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>Tất cả tuyển thủ</span>
            {pendingPlayers.length === 0 && <Check className="w-2 h-2" />}
          </button>
          
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(p => (
              <button
                key={p.id}
                onClick={() => togglePendingPlayer(p.id)}
                className={`w-full flex items-center justify-between py-1 px-2 rounded text-[8px] font-heading transition-all ${
                  pendingPlayers.includes(p.id) 
                    ? "bg-gold/10 text-gold" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{p.name}</span>
                {pendingPlayers.includes(p.id) && <Check className="w-2 h-2" />}
              </button>
            ))
          ) : (
            <div className="py-2 text-center text-[8px] text-gray-600 italic">
              Không tìm thấy tuyển thủ nào
            </div>
          )}
        </div>
      </div>
    </FilterSection>
  );
}
