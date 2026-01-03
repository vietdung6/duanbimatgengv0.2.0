import { useState } from "react";
import { Save, Radio } from "lucide-react";
import { IViewingSession } from "@/lib/types/viewing-party";
import { updateSession, startSession, endSession } from "@/app/actions/viewing-party";
import { useToast } from "@/components/ui/ToastContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface StreamControlTabProps {
  sessionId: number;
  status: IViewingSession["status"];
  initialTitle: string;
  initialUrl: string;
}

export default function StreamControlTab({ sessionId, status, initialTitle, initialUrl }: StreamControlTabProps) {
  const [editTitle, setEditTitle] = useState(initialTitle);
  const [editUrl, setEditUrl] = useState(initialUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editUrl.trim()) return;
    setIsProcessing(true);
    try {
      const result = await updateSession(sessionId, editTitle, editUrl);
      if (result.success) showToast(t.viewingParty.admin.stream.updateSuccess, "success");
      else showToast(t.viewingParty.admin.error.replace("{message}", result.error || "Unknown error"), "error");
    } catch (err) {
      console.error(err);
      showToast(t.viewingParty.admin.stream.error, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartSession = async () => {
    if (!confirm(t.viewingParty.admin.stream.confirmStart)) return;
    setIsProcessing(true);
    try {
      const result = await startSession(sessionId);
      if (result.success) showToast(t.viewingParty.admin.stream.startSuccess, "success");
      else showToast(t.viewingParty.admin.error.replace("{message}", result.error || "Unknown error"), "error");
    } catch (err) {
      console.error(err);
      showToast(t.viewingParty.admin.stream.error, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndSession = async () => {
    if (!confirm(t.viewingParty.admin.stream.confirmEnd)) return;
    setIsProcessing(true);
    try {
      const result = await endSession(sessionId);
      if (result.success) showToast(t.viewingParty.admin.stream.endSuccess, "success");
      else showToast(t.viewingParty.admin.error.replace("{message}", result.error || "Unknown error"), "error");
    } catch (err) {
      console.error(err);
      showToast(t.viewingParty.admin.stream.error, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-gold" />
          {t.viewingParty.admin.stream.title}
        </h4>
        <form onSubmit={handleUpdateSession} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t.viewingParty.admin.stream.sessionTitle}</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t.viewingParty.admin.stream.streamUrl}</label>
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold text-sm font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            {t.viewingParty.admin.stream.save}
          </button>
        </form>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t.viewingParty.admin.stream.status}</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleStartSession}
            disabled={status === 'live' || isProcessing}
            className={`py-3 px-4 rounded-lg font-bold border transition-colors flex flex-col items-center gap-1 ${
              status === 'live'
                ? 'bg-green-500/10 border-green-500 text-green-500 cursor-default'
                : 'bg-green-600 text-white border-transparent hover:bg-green-500'
            }`}
          >
            <span>{t.viewingParty.admin.stream.goLive}</span>
            <span className="text-[10px] font-normal opacity-80">{t.viewingParty.admin.stream.startBroadcasting}</span>
          </button>
          <button
            onClick={handleEndSession}
            disabled={status === 'ended' || isProcessing}
            className={`py-3 px-4 rounded-lg font-bold border transition-colors flex flex-col items-center gap-1 ${
              status === 'ended'
                ? 'bg-red-500/10 border-red-500 text-red-500 cursor-default'
                : 'bg-red-600 text-white border-transparent hover:bg-red-500'
            }`}
          >
            <span>{t.viewingParty.admin.stream.endStream}</span>
            <span className="text-[10px] font-normal opacity-80">{t.viewingParty.admin.stream.stopBroadcasting}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
