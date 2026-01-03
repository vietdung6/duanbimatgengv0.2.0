"use client";

import { useState, useEffect } from "react";
import { Trophy, CheckCircle, Clock, BarChart2, HelpCircle, Gift } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";
import { useViewingParty } from "../ViewingPartyContext";
import { ViewingPartyEvent } from "@/lib/types/viewing-party";
import { getUserParticipation, UserParticipation } from "@/lib/actions/viewing-party-participation";
import ActiveEventItem from "./ActiveEventItem";
import { useCheckIn } from "../hooks/useCheckIn";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface EventsTabProps {
  sessionId: number;
  events: ViewingPartyEvent[];
}

export default function EventsTab({ sessionId, events }: EventsTabProps) {
  const { showToast } = useToast();
  const { hasCheckedIn, setHasCheckedIn } = useViewingParty();
  const { t } = useLanguage();
  const [participations, setParticipations] = useState<UserParticipation[]>([]);

  // Fetch participations on mount
  useEffect(() => {
    getUserParticipation(sessionId).then(setParticipations);
  }, [sessionId]);

  const handleParticipated = (newParticipation: UserParticipation) => {
    setParticipations(prev => [...prev, newParticipation]);
  };

  const { handleCheckIn, isLoading } = useCheckIn({
    sessionId,
    hasCheckedIn,
    setHasCheckedIn,
    onParticipated: handleParticipated,
    participations
  });

  const activeEvents = events.filter(e => {
    if (e.status !== 'active') return false;
    // Hide check-in events if user already participated
    if (e.type === 'check_in') {
      const hasParticipated = participations.some(p => p.event_id === e.id);
      if (hasParticipated) return false;
    }
    return true;
  });
  const pendingEvents = events.filter(e => e.status === 'pending');
  
  const hasActiveCheckIn = activeEvents.some(e => e.type === 'check_in');
  const showDefaultCheckIn = !hasActiveCheckIn && !hasCheckedIn;
  const showEmptyState = activeEvents.length === 0 && !showDefaultCheckIn;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'check_in': return <CheckCircle className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      case 'prediction': return <Trophy className="w-4 h-4" />;
      case 'poll': return <BarChart2 className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'check_in': return t.viewingParty.events.checkIn;
      case 'quiz': return t.viewingParty.events.quiz;
      case 'prediction': return t.viewingParty.events.prediction;
      case 'poll': return t.viewingParty.events.poll;
      default: return t.viewingParty.events.event;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'check_in': return 'text-green-500 bg-green-500/20';
      case 'quiz': return 'text-gold bg-gold/20';
      case 'prediction': return 'text-blue-400 bg-blue-400/20';
      case 'poll': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-white bg-white/20';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      
      {/* Active Events Section */}
      <section>
        <h3 className="text-gold font-bold text-sm uppercase mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {t.viewingParty.events.activeEvents}
        </h3>
        
        {/* Recurring Reward Notification (Info Only) */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/10 mb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded text-gold bg-gold/20">
                {t.viewingParty.events.dailyMission}
              </span>
              <span className="text-xs text-gray-400">{t.viewingParty.events.dailyMissionTitle}</span>
            </div>
            <div className="text-gray-500">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-white mb-1">{t.viewingParty.events.watch30Min}</h4>
          <p className="text-xs text-gray-400">
            {t.viewingParty.events.watch30MinDesc} 
            <br />
            <span className="text-gold/70 text-[10px] italic">
              {t.viewingParty.events.watchGuide}
            </span>
          </p>
        </div>

        {/* Default Check-in Card (Injected) */}
        {showDefaultCheckIn && (
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/10 hover:border-gold/30 transition-colors group mb-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-green-500 bg-green-500/20">
                  {t.viewingParty.events.checkIn}
                </span>
                <span className="text-xs text-gray-400">{t.viewingParty.events.checkInTitle}</span>
              </div>
              <div className="text-gray-500 group-hover:text-gold transition-colors">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-white mb-1">{t.viewingParty.events.firstCheckIn}</h4>
            <p className="text-xs text-gray-400">{t.viewingParty.events.firstCheckInDesc}</p>
            
            <button 
              onClick={() => handleCheckIn()}
              disabled={isLoading}
              className="w-full mt-3 text-xs font-bold py-2 rounded transition-all bg-white/10 hover:bg-white/20 text-white"
            >
              {isLoading ? t.viewingParty.events.checkingIn : t.viewingParty.events.checkInButton.replace("{points}", "100")}
            </button>
          </div>
        )}

        {showEmptyState ? (
          <div className="text-center py-8 text-gray-500 text-xs italic">
            {t.viewingParty.events.noActiveEvents}
          </div>
        ) : (
          <div className="space-y-3">
            {activeEvents.map(event => (
              <div 
                key={event.id}
                className="bg-[#1a1a1a] rounded-lg p-4 border border-white/10 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getEventColor(event.type)}`}>
                      {getEventLabel(event.type)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {event.type === 'check_in' ? t.viewingParty.events.checkInTitle : t.viewingParty.events.happeningNow}
                    </span>
                  </div>
                  <div className={`transition-colors ${event.type === 'check_in' && hasCheckedIn ? "text-green-500" : "text-gray-500 group-hover:text-gold"}`}>
                    {getEventIcon(event.type)}
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-white mb-1">{event.title}</h4>
                {event.description && (
                  <p className="text-xs text-gray-400">{event.description}</p>
                )}

                {event.type === 'check_in' ? (
                  <button 
                    onClick={() => handleCheckIn(event)}
                    disabled={isLoading || !!participations.find(p => p.event_id === event.id)}
                    className={`
                      w-full mt-3 text-xs font-bold py-2 rounded transition-all
                      ${!!participations.find(p => p.event_id === event.id)
                        ? "bg-green-500/20 text-green-500 cursor-default" 
                        : "bg-white/10 hover:bg-white/20 text-white"
                      }
                    `}
                  >
                    {isLoading ? t.viewingParty.events.checkingIn : (!!participations.find(p => p.event_id === event.id)) ? t.viewingParty.events.checkedIn : t.viewingParty.events.checkInButton.replace("{points}", event.points.toString())}
                  </button>
                ) : (
                  <ActiveEventItem 
                    event={event} 
                    sessionId={sessionId}
                    participation={participations.find(p => p.event_id === event.id) || undefined}
                    onParticipated={handleParticipated}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      {pendingEvents.length > 0 && (
        <section>
          <h3 className="text-gray-500 font-bold text-xs uppercase mb-3">{t.viewingParty.events.upcomingEvents}</h3>
          <div className="space-y-2 opacity-60">
            {pendingEvents.map(event => (
              <div key={event.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <h4 className="text-sm text-gray-300">{event.title}</h4>
                  <p className="text-[10px] text-gray-500">{getEventLabel(event.type)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
