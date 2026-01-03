import { Swords, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  onReset?: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-[#0A0A0A] border border-white/5 rounded-2xl">
      <Swords className="w-16 h-16 text-gray-800 mx-auto mb-4" />
      <h3 className="text-white font-heading text-xl mb-2">Không tìm thấy trận đấu nào</h3>
      <p className="text-gray-500 mb-6">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-full transition-all text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  );
}
