import { useState } from "react";
import { ViewingPartyEvent } from "@/lib/types/viewing-party";
import { UserParticipation } from "@/lib/actions/viewing-party-participation";
import { claimCheckInReward } from "@/lib/actions/viewing-party-rewards";
import { useToast } from "@/components/ui/ToastContext";

interface UseCheckInProps {
  sessionId: number;
  hasCheckedIn: boolean;
  setHasCheckedIn: (value: boolean) => void;
  onParticipated: (participation: UserParticipation) => void;
  participations: UserParticipation[];
}

export function useCheckIn({ 
  sessionId, 
  hasCheckedIn, 
  setHasCheckedIn, 
  onParticipated,
  participations 
}: UseCheckInProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async (event?: ViewingPartyEvent) => {
    if (isLoading) return;
    if (!event && hasCheckedIn) return; // Only check hasCheckedIn for default check-in
    if (event && participations.find(p => p.event_id === event.id)) return;
    
    setIsLoading(true);
    try {
      // If event is provided, use submitEventResponse to track participation properly
      if (event) {
        // Dynamic import to avoid circular dependencies if any
        const { submitEventResponse } = await import("@/lib/actions/viewing-party-participation");
        const result = await submitEventResponse(event.id, sessionId);
        
        if (result.success) {
          // Do not set global hasCheckedIn for specific event check-ins
          showToast(result.message || "Điểm danh thành công!", "success");
          onParticipated({
            id: Date.now(),
            event_id: event.id,
            user_id: 0, 
            selected_option_index: null,
            is_correct: null,
            created_at: new Date()
          });
        } else {
          showToast(result.message || "Lỗi điểm danh", "error");
        }
      } else {
        // Fallback to old method if no event object (legacy support)
        const result = await claimCheckInReward(sessionId);
        if (result.success) {
          setHasCheckedIn(true);
          showToast(result.message || "Điểm danh thành công!", "success");
        } else {
          showToast(result.message || "Lỗi điểm danh", "error");
          if (result.message?.includes("đã điểm danh")) {
             setHasCheckedIn(true);
          }
        }
      }
    } catch (error) {
      showToast("Lỗi hệ thống", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCheckIn,
    isLoading
  };
}
