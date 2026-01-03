"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, MessageSquare, MessageSquareOff } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import ChatRoom from "./ChatRoom";
import AdminControls from "./AdminControls";
import ViewingPartyLayout from "./ViewingPartyLayout";
import ViewCounter from "./ViewCounter";
import { IViewingSession, IChatMessage, ViewingPartyEvent, EVENTS } from "@/lib/types/viewing-party";
import { useWatchTimeReward, REWARD_INTERVAL } from "@/lib/hooks/useWatchTimeReward";
import { useViewingParty } from "./ViewingPartyContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ViewingPartyContainerProps {
  session: IViewingSession;
  messages: IChatMessage[];
  user: any; // Using any for simplicity as User type isn't readily available in imports
  isStaff: boolean;
  sessionId: number;
  initialEvents: ViewingPartyEvent[];
}

export default function ViewingPartyContainer({
  session,
  messages,
  user,
  isStaff,
  sessionId,
  initialEvents,
}: ViewingPartyContainerProps) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [events, setEvents] = useState<ViewingPartyEvent[]>(initialEvents);
  const { socket } = useViewingParty();
  const { t } = useLanguage();

  const { timeLeft, canClaim, isClaiming, claimReward } = useWatchTimeReward(sessionId, !!user, session.status);

  // Listen for event updates
  useEffect(() => {
    if (!socket) return;

    socket.on(EVENTS.EVENT_UPDATE, (event: any) => {
      setEvents(prev => {
        if (event._deleted) {
          return prev.filter(e => e.id !== event.id);
        }

        const exists = prev.find(e => e.id === event.id);
        if (exists) {
          // Update existing event
          return prev.map(e => e.id === event.id ? event : e);
        }
        // Add new event
        return [event, ...prev];
      });
    });

    return () => {
      socket.off(EVENTS.EVENT_UPDATE);
    };
  }, [socket]);

  // Format time for display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isFullscreen = !isHeaderVisible && !isChatOpen;
  const toggleFullscreen = () => {
    if (isFullscreen) {
      setIsHeaderVisible(true);
      setIsChatOpen(true);
    } else {
      setIsHeaderVisible(false);
      setIsChatOpen(false);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative">
      {/* Header */}
      <div
        className={`
          border-b border-white/10 bg-[#111] shrink-0 relative z-50 transition-all duration-300 ease-in-out overflow-hidden
          ${isHeaderVisible ? 'max-h-[80px] p-3 md:p-4 opacity-100' : 'max-h-0 p-0 opacity-0 border-none'}
        `}
      >
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/fan-zone/viewing-party"
              className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors shrink-0"
            >
              <span className="text-xl">←</span>
              <span className="hidden sm:inline text-sm md:text-base">{t.viewingParty.controls.back}</span>
            </Link>
            <h1 className="font-bold text-base md:text-lg text-gold truncate px-3 md:px-4 border-l border-white/10 min-w-0 max-w-[200px] md:max-w-none">
              {session.title || "Viewing Party"}
            </h1>
            <ViewCounter />
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Watch Time Reward Button */}
            {session.status === 'live' && user && (
              <button
                onClick={claimReward}
                disabled={!canClaim || isClaiming}
                className={`
                  relative overflow-hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${canClaim
                    ? 'bg-gold text-black hover:bg-white hover:scale-105 shadow-[0_0_15px_rgba(170,128,24,0.5)] animate-pulse'
                    : 'bg-white/5 text-gray-400 cursor-not-allowed border border-white/5'
                  }
                `}
              >
                {!canClaim ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
                    <span>{formatTime(timeLeft)}</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">🎁</span>
                    <span>{isClaiming ? t.viewingParty.controls.claiming : t.viewingParty.controls.checkInReward}</span>
                  </>
                )}

                {/* Progress bar background for timer */}
                {!canClaim && (
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-gold/50 transition-all duration-1000 ease-linear"
                    style={{ width: `${((REWARD_INTERVAL - timeLeft) / REWARD_INTERVAL) * 100}%` }}
                  />
                )}
              </button>
            )}

            {/* Toggle Chat Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              suppressHydrationWarning
              className={`
                h-9 px-4 rounded-full transition-all flex items-center gap-2 border
                ${isChatOpen
                  ? 'border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 shadow-[0_0_10px_rgba(170,128,24,0.1)]'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
              title={isChatOpen ? t.viewingParty.controls.hideChat : t.viewingParty.controls.showChat}
            >
              {isChatOpen ? <MessageSquareOff size={16} /> : <MessageSquare size={16} />}
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">{isChatOpen ? t.viewingParty.chat.chatOn : t.viewingParty.chat.chatOff}</span>
            </button>

            {/* Admin Controls Button */}
            {isStaff && (
              <AdminControls
                sessionId={sessionId}
                status={session.status}
                initialTitle={session.title}
                initialUrl={session.stream_url || ""}
                events={events}
              />
            )}

            {/* Collapse Header Button */}
            <button
              onClick={() => setIsHeaderVisible(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              title={t.viewingParty.controls.hideHeader}
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Restore Header Button */}
      {!isHeaderVisible && (
        <button
          onClick={() => setIsHeaderVisible(true)}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-[60] bg-black/50 hover:bg-black/80 text-white rounded-b-lg px-6 py-1 backdrop-blur-sm border-b border-x border-white/10 transition-all shadow-lg hover:shadow-gold/20 group"
          title={t.viewingParty.controls.showHeader}
        >
          <ChevronDown size={16} className="text-gray-400 group-hover:text-gold transition-colors" />
        </button>
      )}

      <ViewingPartyLayout
        isHeaderVisible={isHeaderVisible}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        video={
          <VideoPlayer
            url={session.stream_url || ""}
            status={session.status}
            title={session.title}
            sessionId={sessionId}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            isHeaderVisible={isHeaderVisible}
          />
        }
        chat={
          <ChatRoom
            sessionId={sessionId}
            initialMessages={messages}
            initialStatus={session.status}
            events={events}
            currentUser={
              user
                ? {
                  id: user.id,
                  username: user.username,
                  avatarUrl: user.avatarUrl,
                  role: user.role,
                }
                : null
            }
          />
        }
      />
    </div>
  );
}
