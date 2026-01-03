"use client";

import { Calendar, RotateCcw } from "lucide-react";
import { FilterSection } from "../FilterSection";

interface TimeFilterProps {
  pendingStartDate: string;
  setPendingStartDate: (val: string) => void;
  pendingEndDate: string;
  setPendingEndDate: (val: string) => void;
  pendingYears: string[];
  togglePendingYear: (year: string) => void;
  years: string[];
  isYearOpen: boolean;
  setIsYearOpen: (val: boolean) => void;
}

export function TimeFilter({
  pendingStartDate,
  setPendingStartDate,
  pendingEndDate,
  setPendingEndDate,
  pendingYears,
  togglePendingYear,
  years,
  isYearOpen,
  setIsYearOpen
}: TimeFilterProps) {
  
  const handleToggleYear = (year: string) => {
    if (pendingStartDate || pendingEndDate) {
      setPendingStartDate("");
      setPendingEndDate("");
    }
    togglePendingYear(year);
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (value && pendingYears.length > 0) {
      togglePendingYear('all');
    }
    if (type === 'start') setPendingStartDate(value);
    else setPendingEndDate(value);
  };

  const clearDateRange = () => {
    setPendingStartDate("");
    setPendingEndDate("");
  };

  return (
    <FilterSection
      label="Thời gian & Năm"
      icon={<Calendar className="w-3 h-3" />}
      isOpen={isYearOpen}
      onToggle={() => setIsYearOpen(!isYearOpen)}
      badgeCount={pendingYears.length > 0 ? pendingYears.length : (pendingStartDate || pendingEndDate ? 1 : 0)}
    >
      <div className="space-y-4 mt-3">
        {/* Khoảng thời gian cụ thể */}
        <div className="space-y-2">
          <label className="text-[8px] font-heading text-gray-500 uppercase tracking-widest block">Khoảng thời gian cụ thể</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <input 
                type="date"
                value={pendingStartDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 px-2 text-[9px] text-white outline-none focus:border-gold/30 transition-all [color-scheme:dark]"
              />
              <span className="text-[7px] text-gray-600 uppercase">Từ ngày</span>
            </div>
            <div className="space-y-1">
              <input 
                type="date"
                value={pendingEndDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 px-2 text-[9px] text-white outline-none focus:border-gold/30 transition-all [color-scheme:dark]"
              />
              <span className="text-[7px] text-gray-600 uppercase">Đến ngày</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-px flex-grow bg-white/5"></div>
          <span className="text-[7px] text-gray-600 uppercase font-bold">Hoặc chọn theo năm</span>
          <div className="h-px flex-grow bg-white/5"></div>
        </div>

        {/* Năm thi đấu */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[8px] font-heading text-gray-500 uppercase tracking-widest block">Theo năm</label>
            <button
              onClick={() => handleToggleYear('all')}
              className={`text-[8px] font-heading transition-colors ${
                pendingYears.length === 0 ? "text-gold" : "text-gray-500 hover:text-white"
              }`}
            >
              Tất cả năm
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => handleToggleYear(year)}
                className={`py-1.5 rounded-lg text-[9px] font-heading transition-all border ${
                  pendingYears.includes(year) 
                    ? "bg-gold/10 text-gold border-gold/50 shadow-[0_0_10px_rgba(212,175,55,0.1)]" 
                    : "text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {(pendingStartDate || pendingEndDate || pendingYears.length > 0) && (
          <button
            onClick={() => {
              clearDateRange();
              togglePendingYear('all');
            }}
            className="w-full py-2 mt-2 border border-white/5 rounded-xl text-[8px] text-gray-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-heading uppercase tracking-widest"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Xóa tất cả thời gian
          </button>
        )}
      </div>
    </FilterSection>
  );
}
