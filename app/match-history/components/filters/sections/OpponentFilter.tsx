"use client";

import { useState } from "react";
import { Check, Search, Users } from "lucide-react";
import { FilterSection } from "../FilterSection";

interface OpponentFilterProps {
  pendingOpponents: string[];
  togglePendingOpponent: (id: string) => void;
  allOpponents: { id: string, name: string }[];
  isOpponentOpen: boolean;
  setIsOpponentOpen: (val: boolean) => void;
}

export function OpponentFilter({
  pendingOpponents,
  togglePendingOpponent,
  allOpponents,
  isOpponentOpen,
  setIsOpponentOpen
}: OpponentFilterProps) {
  const [opponentSearch, setOpponentSearch] = useState("");
  
  const filteredOpponents = allOpponents.filter(opp => 
    opp.name.toLowerCase().includes(opponentSearch.toLowerCase())
  );

  return (
    <FilterSection
      label="Đối thủ"
      icon={<Users className="w-3 h-3" />}
      isOpen={isOpponentOpen}
      onToggle={() => setIsOpponentOpen(!isOpponentOpen)}
      badgeCount={pendingOpponents.length}
    >
      <div className="space-y-3 mt-3">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-2.5 h-2.5 group-focus-within:text-gold transition-colors" />
          <input 
            type="text"
            placeholder="Tìm tên đội..."
            value={opponentSearch}
            onChange={(e) => setOpponentSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 pl-8 pr-2 text-[9px] text-white outline-none focus:border-gold/30 transition-all"
          />
        </div>

        <div className="space-y-1.5 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
          <button
            onClick={() => togglePendingOpponent('all')}
            className={`w-full flex items-center justify-between py-1 px-2 rounded text-[8px] font-heading transition-all ${
              pendingOpponents.length === 0 
                ? "bg-gold/10 text-gold" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>Tất cả đối thủ</span>
            {pendingOpponents.length === 0 && <Check className="w-2 h-2" />}
          </button>
          
          {filteredOpponents.length > 0 ? (
            filteredOpponents.map(opp => (
              <button
                key={opp.id}
                onClick={() => togglePendingOpponent(opp.id)}
                className={`w-full flex items-center justify-between py-1 px-2 rounded text-[8px] font-heading transition-all ${
                  pendingOpponents.includes(opp.id) 
                    ? "bg-gold/10 text-gold" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{opp.name}</span>
                {pendingOpponents.includes(opp.id) && <Check className="w-2 h-2" />}
              </button>
            ))
          ) : (
            <div className="py-2 text-center text-[8px] text-gray-600 italic">
              Không tìm thấy đội nào
            </div>
          )}
        </div>
      </div>
    </FilterSection>
  );
}
