"use client";

import { Filter, RotateCcw, Save } from "lucide-react";

interface FilterHeaderProps {
  handleReset: () => void;
  handleApply: () => void;
}

export function FilterHeader({ handleReset, handleApply }: FilterHeaderProps) {
  return (
    <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-gold" />
        <span className="font-heading text-[10px] uppercase tracking-widest text-white">Bộ lọc</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[8px] text-gray-500 hover:text-white transition-colors uppercase font-heading tracking-widest"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          Đặt lại
        </button>
        <button
          onClick={handleApply}
          className="flex items-center gap-1.5 text-[8px] text-gold hover:text-white transition-colors uppercase font-heading tracking-widest"
        >
          <Save className="w-2.5 h-2.5" />
          Lưu
        </button>
      </div>
    </div>
  );
}
