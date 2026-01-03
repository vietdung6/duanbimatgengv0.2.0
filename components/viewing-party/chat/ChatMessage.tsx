import { IChatMessage, UserRole } from "@/lib/types/viewing-party";
import Image from "next/image";
import UserAvatar from "@/components/shared/UserAvatar";
import { Ban } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ChatMessageProps {
  message: IChatMessage;
  isGrouped: boolean;
  currentUserId?: number | undefined;
  canModerate?: boolean | undefined;
  onBanUser?: ((userId: number, username: string) => void) | undefined;
}

export default function ChatMessage({ message: msg, isGrouped, currentUserId, canModerate, onBanUser }: ChatMessageProps) {
  const { t, language } = useLanguage();
  const isSystem = msg.type === "system";
  const isStaff = msg.user?.role === "staff";
  const isAdmin = msg.user?.role === "admin";
  const isMe = currentUserId === msg.user_id;

  if (isSystem) {
    return (
      <div className="py-1 px-4 my-1 text-center">
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
          {msg.content}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-2 px-4 hover:bg-white/5 transition-all duration-200 group border-l-2 border-transparent hover:border-gold/30">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 pt-1">
        {!isGrouped && (
          <UserAvatar
             src={msg.user?.avatar_url || null}
             alt={msg.user?.username || 'User'}
             fallback={(msg.user?.display_name || msg.user?.username)?.charAt(0).toUpperCase() || "?"}
             size={32}
             className={`rounded-full transition-transform group-hover:scale-105 ${(isStaff || isAdmin) ? 'ring-2 ring-gold/50 shadow-lg shadow-gold/10' : 'ring-1 ring-white/10'}`}
           />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {!isGrouped && (
          <div className="flex items-center flex-wrap gap-x-2 mb-0.5">
            <span
              className={`font-bold text-sm ${
                (isStaff || isAdmin)
                  ? "text-gold"
                  : isMe ? "text-white" : "text-gray-300"
              }`}
            >
              {msg.user?.display_name || msg.user?.username}
            </span>
            
            {/* Role Badge - Only for Staff/Admin */}
            {(isStaff || isAdmin) && (
              <span className="px-1.5 py-[1px] rounded bg-gold text-black text-[10px] font-bold uppercase tracking-wide border border-yellow-600 shadow-[0_0_5px_rgba(170,128,24,0.3)]">
                {isStaff ? t.viewingParty.chat.staff : t.viewingParty.chat.admin}
              </span>
            )}

            <span className="text-[10px] text-gray-500 group-hover:text-gray-300 ml-auto transition-colors">
              {new Date(msg.created_at).toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {canModerate && !isMe && !isStaff && !isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBanUser?.(msg.user_id!, msg.user?.username || "User");
                }}
                className="ml-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                title={t.viewingParty.chat.muteUser}
              >
                <Ban size={14} />
              </button>
            )}
          </div>
        )}
        
        <div className={`text-[13px] leading-relaxed break-words ${(isStaff || isAdmin) ? 'text-white' : 'text-gray-300'}`}>
          {msg.content}
        </div>
      </div>
    </div>
  );
}
