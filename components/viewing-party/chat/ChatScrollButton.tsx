import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ChatScrollButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export default function ChatScrollButton({ unreadCount, onClick }: ChatScrollButtonProps) {
  const { t } = useLanguage();
  
  return (
    <button
      onClick={onClick}
      className={`
        absolute bottom-20 left-1/2 -translate-x-1/2 
        flex items-center gap-2 px-4 py-2 rounded-full 
        bg-gold text-black shadow-lg shadow-black/50
        text-xs font-bold hover:bg-white transition-all
        z-20 animate-in fade-in slide-in-from-bottom-4 duration-300
      `}
    >
      <ArrowDown size={14} />
      {unreadCount > 0 ? (
        <>
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          {t.viewingParty.chat.newMessages.replace("{count}", unreadCount.toString())}
        </>
      ) : (
        t.viewingParty.chat.viewLatest
      )}
    </button>
  );
}
