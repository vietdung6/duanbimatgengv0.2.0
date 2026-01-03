"use client";

import { useState } from "react";
import { ViewingPartyEvent } from "@/lib/types/viewing-party";
import { UserParticipation, submitEventResponse } from "@/lib/actions/viewing-party-participation";
import { useToast } from "@/components/ui/ToastContext";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ActiveEventItemProps {
  event: ViewingPartyEvent;
  sessionId: number;
  participation?: UserParticipation | undefined;
  onParticipated: (participation: UserParticipation) => void;
}

export default function ActiveEventItem({ event, sessionId, participation, onParticipated }: ActiveEventItemProps) {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitEventResponse(event.id, sessionId, selectedOption);
      
      if (result.success) {
        showToast(result.message || t.viewingParty.events.success, result.isCorrect === false ? "error" : "success");
        onParticipated({
          id: Date.now(), // Temporary ID until refresh
          event_id: event.id,
          user_id: 0, // Placeholder
          selected_option_index: selectedOption,
          is_correct: result.isCorrect ?? null,
          created_at: new Date()
        });
      } else {
        showToast(result.message || t.viewingParty.events.error, "error");
      }
    } catch (error) {
      showToast(t.viewingParty.events.systemError, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isParticipated = !!participation;
  const isQuiz = event.type === "quiz";
  
  // Calculate correctness dynamically based on event state + participation
  // This allows real-time update when admin settles prediction without re-fetching participation
  const isEventSettled = event.status === 'ended' && event.correct_option_index !== null;
  
  const isCorrect = participation?.is_correct === true || 
    (isEventSettled && participation?.selected_option_index === event.correct_option_index);
    
  const isWrong = participation?.is_correct === false || 
    (isEventSettled && participation?.selected_option_index !== event.correct_option_index);

  return (
    <div className="mt-3">
      {/* Options */}
      {event.options && event.options.length > 0 && (
        <div className="space-y-2 mb-3">
          {event.options.map((option, idx) => {
            // Determine styling based on state
            let optionClass = "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300";
            let icon = null;

            if (isParticipated) {
              // Show results if participated
              if (idx === participation.selected_option_index) {
                 if (isQuiz || isEventSettled) {
                   if (isCorrect) {
                     optionClass = "bg-green-500/20 border-green-500/50 text-green-500 font-bold";
                     icon = <CheckCircle size={14} />;
                   } else if (isWrong) {
                     optionClass = "bg-red-500/20 border-red-500/50 text-red-500 font-bold";
                     icon = <XCircle size={14} />;
                   }
                 } else {
                   // Just selected (pending prediction/poll)
                   optionClass = "bg-gold/20 border-gold/50 text-gold font-bold";
                   icon = <CheckCircle size={14} />;
                 }
              } else if ((isQuiz || isEventSettled) && isWrong && idx === event.correct_option_index) {
                // Show correct answer if user was wrong
                 optionClass = "bg-green-500/10 border-green-500/30 text-green-500/70";
              }
            } else {
              // Selection mode
              if (selectedOption === idx) {
                optionClass = "bg-gold/20 border-gold text-white";
              }
            }

            return (
              <button
                key={idx}
                disabled={isParticipated || isSubmitting}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-2.5 rounded text-xs border transition-all flex items-center justify-between ${optionClass}`}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      )}

      {/* Submit Button */}
      {!isParticipated && (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || isSubmitting}
          className={`
            w-full py-2 rounded text-xs font-bold transition-all
            ${selectedOption !== null && !isSubmitting
              ? "bg-gold hover:bg-white text-black"
              : "bg-white/5 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {isSubmitting ? t.viewingParty.events.submitting : t.viewingParty.events.submit}
        </button>
      )}
      
      {/* Result Message */}
      {isParticipated && (
        <div className={`text-center text-xs font-bold mt-2 ${isCorrect ? "text-green-500" : isWrong ? "text-red-500" : "text-gray-400"}`}>
          {isCorrect 
            ? t.viewingParty.events.correct.replace("{points}", event.points.toString()) 
            : isWrong 
              ? t.viewingParty.events.wrong 
              : t.viewingParty.events.recorded
          }
        </div>
      )}
    </div>
  );
}
