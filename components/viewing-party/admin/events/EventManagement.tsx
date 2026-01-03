"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ViewingPartyEvent } from "@/lib/types/viewing-party";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CreateEventForm from "./CreateEventForm";
import EventItem from "./EventItem";

interface EventManagementProps {
  sessionId: number;
  events: ViewingPartyEvent[];
}

export default function EventManagement({ sessionId, events }: EventManagementProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase">
          {t.viewingParty.admin.eventManagement.title}
        </h3>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 bg-gold hover:bg-white text-black text-xs font-bold px-3 py-1.5 rounded transition-colors"
          >
            <Plus size={14} />
            <span>{t.viewingParty.admin.eventManagement.addNew}</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1">
        {isCreating && (
          <div className="mb-4">
            <CreateEventForm 
              sessionId={sessionId} 
              onSuccess={() => setIsCreating(false)}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}

        {events.length === 0 ? (
          !isCreating && (
            <div className="text-center py-8 text-gray-500 text-xs">
              {t.viewingParty.admin.eventManagement.noEvents}
            </div>
          )
        ) : (
          events.map(event => (
            <EventItem key={event.id} event={event} sessionId={sessionId} />
          ))
        )}
      </div>
    </div>
  );
}
