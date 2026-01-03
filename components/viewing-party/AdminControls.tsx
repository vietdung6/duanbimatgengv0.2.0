"use client";

import { useState } from "react";
import { IViewingSession, ViewingPartyEvent } from "@/lib/types/viewing-party";
import { Settings, X, MessageSquare, Radio, Megaphone, Trophy } from "lucide-react";
import StreamControlTab from "./admin/StreamControlTab";
import ChatManagerTab from "./admin/ChatManagerTab";
import AnnouncementTab from "./admin/AnnouncementTab";
import EventManagement from "./admin/events/EventManagement";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AdminControlsProps {
  sessionId: number;
  status: IViewingSession["status"];
  initialTitle: string;
  initialUrl: string;
  events: ViewingPartyEvent[];
}

export default function AdminControlPanel({ sessionId, status, initialTitle, initialUrl, events }: AdminControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stream' | 'chat' | 'announce' | 'events'>('stream');
  const { t } = useLanguage();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        suppressHydrationWarning
        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium shrink-0"
        title={t.viewingParty.controls.manageStream}
      >
        <Settings className="w-5 h-5 md:w-4 md:h-4" />
        <span className="hidden md:inline">{t.viewingParty.controls.manageStream}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1f1f1f] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#2a2a2a] shrink-0">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-gold" />
                {t.viewingParty.controls.adminTitle}
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 shrink-0 overflow-x-auto">
              {[
                { id: 'stream', label: t.viewingParty.controls.tabs.stream, icon: Radio },
                { id: 'events', label: t.viewingParty.controls.tabs.events, icon: Trophy },
                { id: 'chat', label: t.viewingParty.controls.tabs.chat, icon: MessageSquare },
                { id: 'announce', label: t.viewingParty.controls.tabs.alerts, icon: Megaphone }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-[80px] ${activeTab === tab.id
                      ? 'text-gold border-b-2 border-gold bg-white/5'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'stream' && (
                <StreamControlTab
                  sessionId={sessionId}
                  status={status}
                  initialTitle={initialTitle}
                  initialUrl={initialUrl}
                />
              )}

              {activeTab === 'events' && (
                <EventManagement sessionId={sessionId} events={events} />
              )}

              {activeTab === 'chat' && (
                <ChatManagerTab sessionId={sessionId} />
              )}

              {activeTab === 'announce' && (
                <AnnouncementTab sessionId={sessionId} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
