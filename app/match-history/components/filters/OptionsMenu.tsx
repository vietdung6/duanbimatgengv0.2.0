"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface OptionsMenuProps {
  pendingSortOrder: 'newest' | 'oldest';
  setPendingSortOrder: (order: 'newest' | 'oldest') => void;
  pendingResultFilter: 'all' | 'win' | 'loss';
  setPendingResultFilter: (filter: 'all' | 'win' | 'loss') => void;
  pendingViewMode: 'full' | 'simple';
  setPendingViewMode: (mode: 'full' | 'simple') => void;
  pendingLimit: number;
  setPendingLimit: (limit: number) => void;
  handleApply: () => void;
}

export function OptionsMenu({
  pendingSortOrder,
  setPendingSortOrder,
  pendingResultFilter,
  setPendingResultFilter,
  pendingViewMode,
  setPendingViewMode,
  pendingLimit,
  setPendingLimit,
  handleApply
}: OptionsMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full left-0 mt-3 w-[220px] bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden p-4 space-y-5"
    >
      {/* Chế độ xem */}
      <div className="space-y-2">
        <label className="text-[8px] font-heading text-gray-500 uppercase tracking-widest block">Chế độ xem</label>
        <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-xl">
          {[
            { id: 'full', name: 'Đầy đủ' },
            { id: 'simple', name: 'Đơn giản' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPendingViewMode(opt.id as any)}
              className={`py-1.5 rounded-lg text-[9px] font-heading transition-all ${
                pendingViewMode === opt.id 
                  ? "bg-gold text-black shadow-lg" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sắp xếp */}
      <div className="space-y-2">
        <label className="text-[8px] font-heading text-gray-500 uppercase tracking-widest block">Sắp xếp theo</label>
        <div className="flex flex-col gap-1">
          {[
            { id: 'newest', name: 'Mới nhất' },
            { id: 'oldest', name: 'Cũ nhất' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPendingSortOrder(opt.id as any)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[9px] font-heading transition-all ${
                pendingSortOrder === opt.id 
                  ? "bg-gold/10 text-gold" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {opt.name}
              {pendingSortOrder === opt.id && <Check className="w-2.5 h-2.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Kết quả */}
      <div className="space-y-2">
        <label className="text-[8px] font-heading text-gray-500 uppercase tracking-widest block">Kết quả trận</label>
        <div className="flex flex-col gap-1">
          {[
            { id: 'all', name: 'Tất cả' },
            { id: 'win', name: 'Thắng' },
            { id: 'loss', name: 'Thua' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPendingResultFilter(opt.id as any)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[9px] font-heading transition-all ${
                pendingResultFilter === opt.id 
                  ? "bg-gold/10 text-gold" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {opt.name}
              {pendingResultFilter === opt.id && <Check className="w-2.5 h-2.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Số lượng hiển thị */}
      <div className="space-y-2">
        <label className="text-[8px] font-heading text-gray-500 uppercase tracking-widest block">Số trận hiển thị</label>
        <div className="grid grid-cols-4 gap-1 bg-black/40 p-1 rounded-xl">
          {[
            { id: 10, name: '10' },
            { id: 20, name: '20' },
            { id: 50, name: '50' },
            { id: 100, name: '100' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPendingLimit(opt.id)}
              className={`py-1 rounded-lg text-[9px] font-heading transition-all ${
                pendingLimit === opt.id 
                  ? "bg-gold text-black" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all font-heading text-[9px] uppercase tracking-widest"
      >
        Áp dụng
      </button>
    </motion.div>
  );
}
