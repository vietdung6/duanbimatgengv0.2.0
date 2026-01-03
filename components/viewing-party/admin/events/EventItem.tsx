"use client";

import { useState } from "react";
import { ViewingPartyEvent } from "@/lib/types/viewing-party";
import { updateEventStatus, deleteEvent } from "@/lib/actions/viewing-party-events";
import { settleEventPrediction, settleEventParticipationReward } from "@/lib/actions/viewing-party-settlement";
import { Play, Square, Trash2, CheckCircle, HelpCircle, BarChart2, Award, Gift } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface EventItemProps {
  event: ViewingPartyEvent;
  sessionId: number;
}

export default function EventItem({ event, sessionId }: EventItemProps) {
  const { showToast } = useToast();
  const { language, t } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const handleStatusChange = async (newStatus: ViewingPartyEvent["status"]) => {
    setIsUpdating(true);
    try {
      const result = await updateEventStatus(event.id, newStatus, sessionId);
      if (result.success) {
        showToast((t.viewingParty.admin.eventManagement.updateStatusSuccess || "Status updated: {status}").replace('{status}', newStatus), "success");
      } else {
        showToast(t.viewingParty.admin.eventManagement.updateStatusError || "Update failed", "error");
      }
    } catch (error) {
      showToast(t.viewingParty.events.systemError || "System error", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // Reset after 3s
      return;
    }
    
    setIsUpdating(true);
    try {
      const result = await deleteEvent(event.id, sessionId);
      if (result.success) {
        showToast(t.viewingParty.admin.eventManagement.deleteSuccess || "Event deleted", "success");
      } else {
        showToast(t.viewingParty.admin.eventManagement.deleteError || "Delete failed", "error");
      }
    } catch (error) {
      showToast(t.viewingParty.events.systemError || "System error", "error");
    } finally {
      setIsUpdating(false);
      setConfirmDelete(false);
    }
  };

  const [confirmSettle, setConfirmSettle] = useState<number | null>(null);

  const handleSettle = async (optionIndex: number) => {
    if (confirmSettle !== optionIndex) {
      setConfirmSettle(optionIndex);
      setTimeout(() => setConfirmSettle(null), 3000);
      return;
    }
    
    setIsSettling(true);
    try {
      const result = await settleEventPrediction(event.id, sessionId, optionIndex);
      if (result.success) {
        showToast(result.message || (t.viewingParty.admin.eventManagement.settleSuccess || "Rewards distributed successfully"), "success");
      } else {
        showToast(result.message || (t.viewingParty.admin.eventManagement.settleError || "Reward distribution failed"), "error");
      }
    } catch (error) {
      showToast(t.viewingParty.events.systemError || "System error", "error");
    } finally {
      setIsSettling(false);
      setConfirmSettle(null);
    }
  };

  const [confirmAwardAll, setConfirmAwardAll] = useState(false);

  const handleAwardAll = async () => {
    if (!confirmAwardAll) {
      setConfirmAwardAll(true);
      setTimeout(() => setConfirmAwardAll(false), 3000);
      return;
    }

    setIsSettling(true);
    try {
      const result = await settleEventParticipationReward(event.id, sessionId);
      if (result.success) {
        showToast(result.message || (t.viewingParty.admin.eventManagement.awardAllSuccess || "Rewards distributed to all!"), "success");
      } else {
        showToast(result.message || (t.viewingParty.admin.eventManagement.awardAllError || "Failed to distribute rewards"), "error");
      }
    } catch (error) {
      showToast(t.viewingParty.events.systemError || "System error", "error");
    } finally {
      setIsSettling(false);
      setConfirmAwardAll(false);
    }
  };

  const getIcon = () => {
    switch (event.type) {
      case "quiz": return <HelpCircle className="text-gold" size={18} />;
      case "check_in": return <CheckCircle className="text-green-500" size={18} />;
      case "prediction": return <BarChart2 className="text-blue-500" size={18} />;
      default: return <HelpCircle className="text-gray-400" size={18} />;
    }
  };

  return (
    <div className={`
      bg-[#1a1a1a] border rounded-lg p-3 transition-colors
      ${event.status === "active" ? "border-gold/50 bg-gold/5" : "border-white/10"}
      ${event.status === "ended" ? "opacity-60" : ""}
    `}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-1 shrink-0">{getIcon()}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-white truncate">{event.title}</h4>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase
                ${event.status === "active" ? "bg-green-500/20 text-green-500" : 
                  event.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-500/20 text-gray-500"}
              `}>
                {event.status}
              </span>
              <span className="text-[10px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded">
                +{event.points} pts
              </span>
            </div>
            {event.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{event.description}</p>
            )}
            {event.type === "quiz" && event.options && (
              <div className="mt-2 space-y-1">
                {event.options.map((opt, idx) => (
                  <div key={idx} className={`text-xs px-2 py-1 rounded flex items-center justify-between gap-2 ${idx === event.correct_option_index ? "bg-green-500/10 text-green-400" : "bg-white/5 text-gray-500"}`}>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[8px] shrink-0">{idx + 1}</span>
                      <span className="truncate">{opt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Prediction Options */}
            {event.type === "prediction" && event.options && (
              <div className="mt-2 space-y-1">
                {event.options.map((opt, idx) => (
                  <div key={idx} className={`text-xs px-2 py-1 rounded flex items-center justify-between gap-2 ${idx === event.correct_option_index ? "bg-green-500/10 text-green-400" : "bg-white/5 text-gray-500"}`}>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[8px] shrink-0">{idx + 1}</span>
                      <span className="truncate">{opt}</span>
                    </div>
                    {/* Prediction Settle Button */}
                    {event.status !== 'pending' && event.correct_option_index === null && (
                      <button
                        onClick={() => handleSettle(idx)}
                        disabled={isSettling || isUpdating}
                        className={`p-1 rounded transition-colors ml-2 ${confirmSettle === idx ? "bg-green-600 text-white" : "hover:bg-gold hover:text-black text-gold"}`}
                        title={confirmSettle === idx 
                          ? (t.viewingParty.admin.eventManagement.confirmSettle || "Confirm this result?") 
                          : (t.viewingParty.admin.eventManagement.selectCorrect || "Select as correct answer")}
                      >
                        <Award size={14} />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Award All Button */}
                {event.status !== 'pending' && event.correct_option_index === null && (
                  <button
                    onClick={handleAwardAll}
                    disabled={isSettling || isUpdating}
                    className={`
                      w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold transition-all
                      ${confirmAwardAll 
                        ? "bg-green-600 text-white" 
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      }
                    `}
                    title={t.viewingParty.admin.eventManagement.awardAllTooltip || "Award points to all participants (regardless of answer)"}
                  >
                    <Gift size={14} />
                    <span>{confirmAwardAll 
                      ? (t.viewingParty.admin.eventManagement.confirmAwardAll || "Confirm awarding all participants?") 
                      : (t.viewingParty.admin.eventManagement.awardAll || "Award All")}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          {event.status === "pending" && (
            <button 
              onClick={() => handleStatusChange("active")}
              disabled={isUpdating}
              className="p-2 bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white rounded transition-colors"
              title={t.viewingParty.admin.eventManagement.startEvent || "Start Event"}
            >
              <Play size={16} />
            </button>
          )}
          {event.status === "active" && (
            <button 
              onClick={() => handleStatusChange("ended")}
              disabled={isUpdating}
              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded transition-colors"
              title={t.viewingParty.admin.eventManagement.endEvent || "End Event"}
            >
              <Square size={16} />
            </button>
          )}
          <button 
            onClick={handleDelete}
            disabled={isUpdating}
            className={`p-2 rounded transition-colors ${confirmDelete ? "bg-red-600 text-white" : "bg-gray-600/20 hover:bg-gray-600 text-gray-400 hover:text-white"}`}
            title={confirmDelete 
              ? (t.viewingParty.admin.eventManagement.confirmDelete || "Click to confirm delete") 
              : (t.viewingParty.admin.eventManagement.deleteEvent || "Delete Event")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
