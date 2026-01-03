import { ReactNode } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ChatHeaderProps {
  unreadCount: number;
  isConnected: boolean;
  title?: string | undefined;
  adminControls?: ReactNode | undefined;
  isChatEnabled?: boolean | undefined;
  activeTab: "chat" | "events";
  onTabChange: (tab: "chat" | "events") => void;
}

export default function ChatHeader({
  unreadCount,
  isConnected,
  title,
  adminControls,
  isChatEnabled = true,
  activeTab,
  onTabChange
}: ChatHeaderProps) {
  const { t } = useLanguage();
  const displayTitle = title || t.viewingParty.chat.title;
  const isOnline = isConnected && isChatEnabled;

  return (
    <div className="flex flex-col border-b border-white/5 bg-[#111] shrink-0 z-10 shadow-sm">
      {/* Top Bar with Status */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider truncate pr-2 drop-shadow-sm">{displayTitle}</h3>
          {unreadCount > 0 && activeTab === 'chat' && (
            <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full animate-pulse shrink-0 shadow-red-500/20 shadow-lg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {adminControls}

          <div className="w-px h-3 bg-white/10 mx-1" />

          <div className="flex items-center gap-1.5" title={isOnline ? "Chat Active" : "Chat Offline"}>
            <span className={`relative flex h-2 w-2`}>
              {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? "bg-green-500" : "bg-red-500"}`}></span>
            </span>
            {isOnline ? (
              <span className="text-[10px] font-medium text-green-500 hidden sm:inline uppercase tracking-wide">{t.viewingParty.chat.online}</span>
            ) : (
              <span className="text-[10px] font-medium text-red-500 hidden sm:inline uppercase tracking-wide">{t.viewingParty.chat.offline}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex px-4 pb-3 gap-3">
        <button
          onClick={() => onTabChange("chat")}
          suppressHydrationWarning
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative border ${activeTab === "chat"
              ? "bg-white/10 text-white border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
              : "text-gray-500 hover:text-gray-300 border-transparent hover:bg-white/5"
            }`}
        >
          {t.viewingParty.chat.chatTab}
          {unreadCount > 0 && activeTab !== 'chat' && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#111] rounded-full" />
          )}
        </button>
        <button
          onClick={() => onTabChange("events")}
          suppressHydrationWarning
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${activeTab === "events"
              ? "bg-gold/10 text-gold border-gold/20 shadow-[0_0_15px_rgba(170,128,24,0.1)]"
              : "text-gray-500 hover:text-gray-300 border-transparent hover:bg-white/5"
            }`}
        >
          {t.viewingParty.chat.eventsTab}
        </button>
      </div>
    </div>
  );
}
