"use client";

import { useState, useEffect } from "react";
import { updateChatSettingsAction } from "@/app/actions/viewing-party";
import { getBannedUsersAction, unbanUserAction } from "@/app/actions/viewing-party-bans";
import { useViewingParty } from "../ViewingPartyContext";
import { Clock, MessageSquare, MessageSquareOff, Loader2, UserX, RefreshCw, Ban } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";
import UserAvatar from "@/components/shared/UserAvatar";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ChatManagerTabProps {
  sessionId: number;
}

export default function ChatManagerTab({ sessionId }: ChatManagerTabProps) {
  const { isChatEnabled, slowModeDuration } = useViewingParty();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [bannedUsers, setBannedUsers] = useState<any[]>([]);
  const [loadingBans, setLoadingBans] = useState(false);
  
  // Modal state
  const [unbanModal, setUnbanModal] = useState<{ isOpen: boolean; userId: number; username: string } | null>(null);

  const loadBans = async () => {
    setLoadingBans(true);
    try {
      const res = await getBannedUsersAction(sessionId);
      if (res.success && res.data) {
        setBannedUsers(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBans(false);
    }
  };

  useEffect(() => {
    loadBans();
  }, [sessionId]);

  const handleUnbanClick = (userId: number, username: string) => {
    setUnbanModal({ isOpen: true, userId, username });
  };

  const confirmUnban = async () => {
    if (!unbanModal) return;

    const { userId, username } = unbanModal;
    setUnbanModal(null);

    try {
      const res = await unbanUserAction(sessionId, userId);
      if (res.success) {
        showToast(t.viewingParty.admin.unbanSuccess.replace("{username}", username), "success");
        loadBans(); // Refresh list
      } else {
        showToast(t.viewingParty.admin.unbanError, "error");
      }
    } catch (e) {
      showToast(t.viewingParty.admin.systemError, "error");
    }
  };

  const handleToggleChat = async () => {
    setIsLoading(true);
    try {
      await updateChatSettingsAction(sessionId, !isChatEnabled, slowModeDuration);
      showToast(isChatEnabled ? t.viewingParty.chat.chatOff : t.viewingParty.chat.chatOn, "success");
    } catch (error) {
      console.error("Failed to toggle chat:", error);
      showToast(t.viewingParty.admin.toggleChatError, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlowModeChange = async (duration: number) => {
    setIsLoading(true);
    try {
      await updateChatSettingsAction(sessionId, isChatEnabled, duration);
      showToast(t.viewingParty.admin.slowModeSuccess.replace("{duration}", duration.toString()), "success");
    } catch (error) {
      console.error("Failed to set slow mode:", error);
      showToast(t.viewingParty.admin.slowModeError, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={!!unbanModal?.isOpen}
        title={t.viewingParty.admin.confirmUnbanTitle}
        message={t.viewingParty.admin.confirmUnbanMessage.replace("{username}", unbanModal?.username || "")}
        confirmText={t.viewingParty.admin.confirmUnbanButton}
        cancelText={t.viewingParty.admin.cancel}
        onConfirm={confirmUnban}
        onCancel={() => setUnbanModal(null)}
      />

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t.viewingParty.admin.chatModes}</h4>
        
        {/* Toggle Chat */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isChatEnabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {isChatEnabled ? <MessageSquare className="w-5 h-5" /> : <MessageSquareOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-medium text-white text-sm">Chat Status</div>
              <div className="text-xs text-gray-500">{isChatEnabled ? t.viewingParty.chat.chatOn : t.viewingParty.chat.chatOff}</div>
            </div>
          </div>
          <button
            onClick={handleToggleChat}
            disabled={isLoading}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isChatEnabled
                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30"
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isChatEnabled ? t.viewingParty.admin.disableChat : t.viewingParty.admin.enableChat}
          </button>
        </div>

        {/* Slow Mode */}
        <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-white text-sm">{t.viewingParty.admin.slowMode}</div>
              <div className="text-xs text-gray-500">{t.viewingParty.admin.slowModeDesc.replace("{seconds}", slowModeDuration.toString())}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {[0, 5, 15, 30, 60].map((seconds) => (
              <button
                key={seconds}
                onClick={() => handleSlowModeChange(seconds)}
                disabled={isLoading}
                className={`px-2 py-1.5 rounded text-xs font-bold border transition-all ${
                  slowModeDuration === seconds
                    ? "bg-gold text-black border-gold"
                    : "bg-zinc-800 text-gray-400 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {seconds === 0 ? "Off" : `${seconds}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Banned Users */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t.viewingParty.admin.mutedUsers}</h4>
            <button 
              onClick={loadBans} 
              disabled={loadingBans}
              className="text-xs text-gold hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={12} className={loadingBans ? "animate-spin" : ""} />
              {t.viewingParty.admin.refresh}
            </button>
          </div>

          {bannedUsers.length === 0 ? (
            <div className="text-center py-6 bg-white/5 rounded-lg border border-white/5 border-dashed">
              <UserX className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t.viewingParty.admin.noMutedUsers}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {bannedUsers.map((ban) => (
                <div key={ban.user_id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <UserAvatar 
                      src={ban.user?.avatar_url} 
                      alt={ban.user?.username || 'User'} 
                      size={32} 
                      className="rounded-full ring-1 ring-white/10"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{ban.user?.display_name || ban.user?.username}</div>
                      <div className="text-[10px] text-gray-500">
                        Muted at {new Date(ban.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnbanClick(ban.user_id, ban.user?.username)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 transition-colors flex items-center gap-2"
                  >
                    <Ban size={12} />
                    {t.viewingParty.admin.unmute}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
