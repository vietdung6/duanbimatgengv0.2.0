import { useState } from "react";
import { Megaphone } from "lucide-react";
import { sendSystemAlert } from "@/app/actions/viewing-party";
import { useToast } from "@/components/ui/ToastContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AnnouncementTabProps {
  sessionId: number;
}

export default function AnnouncementTab({ sessionId }: AnnouncementTabProps) {
  const [alertMessage, setAlertMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;
    setIsProcessing(true);
    try {
      const result = await sendSystemAlert(sessionId, alertMessage);
      if (result.success) {
        setAlertMessage("");
        showToast(t.viewingParty.admin.announcement.success, "success");
      } else {
        showToast(t.viewingParty.admin.error.replace("{message}", result.error || "Unknown error"), "error");
      }
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
          <Megaphone className="w-4 h-4 text-gold" />
          {t.viewingParty.admin.announcement.title}
        </h4>
        
        <div className="space-y-2">
          <label className="block text-xs text-gray-500 mb-1">{t.viewingParty.admin.announcement.label}</label>
          <textarea
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
            placeholder={t.viewingParty.admin.announcement.placeholder}
            className="w-full h-32 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold text-sm resize-none"
          />
        </div>

        <button
          onClick={handleSendAlert}
          disabled={!alertMessage.trim() || isProcessing}
          className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Megaphone className="w-4 h-4" />
          {t.viewingParty.admin.announcement.broadcast}
        </button>
      </div>
    </div>
  );
}
