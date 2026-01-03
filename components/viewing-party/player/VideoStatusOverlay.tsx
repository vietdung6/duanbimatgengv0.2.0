import { Radio } from "lucide-react";
import { IViewingSession } from "@/lib/types/viewing-party";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface VideoStatusOverlayProps {
  status: IViewingSession["status"];
}

export default function VideoStatusOverlay({ status }: VideoStatusOverlayProps) {
  const { t } = useLanguage();

  if (status === "scheduled") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 border-b border-white/5">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Radio className="w-10 h-10 text-gold" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{t.viewingParty.video.startingSoon}</h3>
            <p className="text-gray-400">{t.viewingParty.video.waiting}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 border-b border-white/5">
        <h3 className="text-2xl font-bold text-white mb-2">{t.viewingParty.video.ended}</h3>
        <p className="text-gold">{t.viewingParty.video.thanks}</p>
      </div>
    );
  }

  return null;
}
