"use client";

import { X, Calendar } from "lucide-react";
import ScheduleMatchForm from "../match-forms/schedule/ScheduleMatchForm";

interface CreateScheduledMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateScheduledMatchModal({ isOpen, onClose, onSuccess }: CreateScheduledMatchModalProps) {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0A0A0A] border border-gold/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="font-heading text-lg text-gold flex items-center gap-2">
            <Calendar size={18} />
            Thêm Trận Đấu Mới
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto p-2">
           <ScheduleMatchForm onSuccess={handleSuccess} hideHeader />
        </div>
      </div>
    </div>
  );
}
