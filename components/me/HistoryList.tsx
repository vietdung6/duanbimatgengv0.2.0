"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Shield, Mail, Calendar, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { UserHistory } from "@/lib/history/historyService";

interface HistoryListProps {
  history: UserHistory[];
}

export default function HistoryList({ history }: HistoryListProps) {
  // Group history by date
  const groupedHistory = useMemo(() => {
    const groups: Record<string, UserHistory[]> = {};
    
    history.forEach(item => {
      const date = new Date(item.createdAt);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey = date.toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      if (date.toDateString() === today.toDateString()) {
        dateKey = "Hôm nay";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Hôm qua";
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey]!.push(item);
    });
    
    return groups;
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center opacity-50">
        <div className="bg-gray-800/50 p-6 rounded-full mb-4">
          <Clock size={48} className="text-gray-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-300">Chưa có hoạt động</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-[200px]">
          Các hoạt động nhận điểm và thông báo sẽ xuất hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      <div className="space-y-8 pb-4">
        {Object.entries(groupedHistory).map(([date, items], groupIndex) => (
          <motion.div 
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-md py-3 mb-4 border-b border-white/5 flex items-center gap-2">
              <Calendar size={14} className="text-gold" />
              <h3 className="text-sm font-bold text-gold uppercase tracking-wider">{date}</h3>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-gold/30 transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-gold/50 transition-all duration-500" />
                  
                  <div className="flex items-start gap-4 p-4">
                    {/* Icon Box */}
                    <div className={`
                      relative shrink-0 p-3 rounded-xl border border-white/5
                      ${item.type === 'point' ? 'bg-gold/5 text-gold' : 
                        item.type === 'admin' ? 'bg-red-500/5 text-red-500' : 'bg-blue-500/5 text-blue-500'}
                    `}>
                      {item.type === 'point' ? <Trophy size={20} /> :
                       item.type === 'admin' ? <Shield size={20} /> : <Mail size={20} />}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-gray-200 group-hover:text-gold transition-colors truncate pr-2">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(item.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {item.pointsChange !== 0 && (
                          <div className={`
                            shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono border
                            ${item.pointsChange > 0 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : 'bg-red-500/10 text-red-400 border-red-500/20'}
                          `}>
                            {item.pointsChange > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {item.pointsChange > 0 ? '+' : ''}{item.pointsChange}
                          </div>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed border-t border-white/5 pt-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
