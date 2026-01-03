"use client";

import { useEffect, useState } from "react";
import { MessageSquare, MessageSquareOff } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ViewingPartyLayoutProps {
  video: React.ReactNode;
  chat: React.ReactNode;
  isHeaderVisible?: boolean;
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
}

export default function ViewingPartyLayout({
  video,
  chat,
  isHeaderVisible = true,
  isChatOpen,
  setIsChatOpen,
}: ViewingPartyLayoutProps) {
  const { t } = useLanguage();
  const [layoutHeight, setLayoutHeight] = useState<string | undefined>(undefined);

  useEffect(() => {
    const updateHeight = () => {
      if (!window.visualViewport) return;
      
      const vh = window.visualViewport.height;
      // Header height estimation:
      // Mobile: ~54px (p-3)
      // Desktop: ~61px (p-4)
      // Using values close to existing CSS classes
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const headerHeight = isHeaderVisible ? (isDesktop ? 64 : 54) : 0;
      
      setLayoutHeight(`${vh - headerHeight}px`);
    };

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);
      updateHeight();
    }

    return () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', updateHeight);
      }
    };
  }, [isHeaderVisible]);

  return (
    <div 
      className={`flex flex-col landscape:flex-row lg:flex-row overflow-hidden bg-neutral-950 relative ${
        isHeaderVisible 
          ? 'h-[calc(100dvh-60px)] lg:h-[calc(100vh-64px)]' 
          : 'h-[100dvh] lg:h-screen'
      }`}
      style={{ height: layoutHeight }}
    >
      {/* Video Section */}
      <div className={`
        relative z-20 flex flex-col bg-black transition-all duration-300 ease-in-out
        ${isChatOpen 
          ? 'w-full landscape:w-2/3 lg:w-auto lg:flex-1 h-auto landscape:h-full' 
          : 'w-full h-full'}
      `}>
        <div className="w-full h-full relative group">
          {video}
          
          {/* Toggle Chat Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-gold/20 text-gold p-2 rounded-lg backdrop-blur-sm border border-gold/20 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100"
            title={isChatOpen ? (t.viewingParty.controls.hideChat || "Hide Chat") : (t.viewingParty.controls.showChat || "Show Chat")}
          >
            {isChatOpen ? (
              <MessageSquareOff className="w-5 h-5 text-gold hover:text-white" />
            ) : (
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold" />
                <span className="text-xs font-bold text-gold shadow-black drop-shadow-md">{t.viewingParty.chat.chat || "Chat"}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <div className={`
        bg-[#0f0f0f] z-10 relative overflow-hidden transition-all duration-300 ease-in-out
        ${isChatOpen 
          ? 'flex-1 min-h-0 landscape:w-1/3 landscape:flex-none lg:w-[350px] xl:w-[400px] lg:flex-none landscape:h-full lg:h-full border-t landscape:border-t-0 landscape:border-l lg:border-l border-white/10 opacity-100' 
          : 'w-0 h-0 opacity-0 border-none'}
      `}>
        {/* Wrapper to prevent content squishing during transition */}
        <div className="w-full h-full min-w-[300px] lg:min-w-[350px]">
            {chat}
        </div>
      </div>
    </div>
  );
}
