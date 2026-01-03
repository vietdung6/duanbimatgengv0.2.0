"use client";

import { useEffect, useRef, useState, useMemo, ReactNode } from "react";
import { IChatMessage, UserRole, EVENTS, ViewingPartyEvent } from "@/lib/types/viewing-party";
import { sendMessage } from "@/app/actions/viewing-party";
import { useViewingParty } from "./ViewingPartyContext";
import ChatHeader from "./chat/ChatHeader";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import ChatScrollButton from "./chat/ChatScrollButton";
import EventsTab from "./chat/EventsTab";

interface ChatRoomProps {
  sessionId: number;
  initialMessages: IChatMessage[];
  currentUser: {
    id: number;
    username: string;
    avatarUrl: string | null;
    role: UserRole;
  } | null;
  adminControls?: ReactNode;
  title?: string;
  initialStatus?: "scheduled" | "live" | "ended";
  events: ViewingPartyEvent[];
}

import { banUserAction } from "@/app/actions/viewing-party-bans";
import { useToast } from "@/components/ui/ToastContext";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ChatRoom({
  sessionId,
  initialMessages,
  currentUser,
  adminControls,
  title,
  initialStatus = "live",
  events
}: ChatRoomProps) {
  const { socket, isConnected, isChatEnabled, slowModeDuration, isTemporaryBlocked } = useViewingParty();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<IChatMessage[]>(initialMessages);
  const [sessionStatus, setSessionStatus] = useState(initialStatus);
  const [activeTab, setActiveTab] = useState<"chat" | "events">("chat");
  
  // Modal state
  const [banModal, setBanModal] = useState<{ isOpen: boolean; userId: number; username: string } | null>(null);

  const isStaff = currentUser?.role === "staff" || currentUser?.role === "admin";
  
  // Scroll management
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Group messages logic
  const groupedMessages = useMemo(() => {
    const groups: { message: IChatMessage; isGrouped: boolean }[] = [];
    
    for (let i = 0; i < messages.length; i++) {
      const current = messages[i];
      if (!current) continue;
      const prev = messages[i - 1];
      
      let isGrouped = false;
      if (
        prev && 
        prev.user_id === current.user_id && 
        prev.type !== 'system' && 
        current.type !== 'system'
      ) {
        const timeDiff = new Date(current.created_at).getTime() - new Date(prev.created_at).getTime();
        // Group if same user and within 2 minutes
        if (timeDiff < 120000) { 
          isGrouped = true;
        }
      }
      groups.push({ message: current, isGrouped });
    }
    return groups;
  }, [messages]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    setUnreadCount(0);
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Consider "at bottom" if within 100px of the bottom
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsAtBottom(atBottom);
    if (atBottom) {
      setUnreadCount(0);
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  // Initial scroll
  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: IChatMessage) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some(m => m.id === message.id)) return prev;
        
        // Use ref to check current scroll status without re-running effect
        if (!isAtBottomRef.current) {
          setUnreadCount(c => c + 1);
        }
        return [...prev, message];
      });
    };

    const handleSystemAlert = (data: any) => {
      // Handle both full message object (from server) and legacy format
      const content = data.content || data.message;
      const id = data.id || Date.now();
      const created_at = data.created_at || new Date();

      const systemMsg: IChatMessage = {
        id,
        session_id: sessionId,
        user_id: null,
        content,
        type: 'system',
        created_at,
      };

      setMessages((prev) => {
        if (prev.some(m => m.id === systemMsg.id)) return prev;
        if (!isAtBottomRef.current) {
          setUnreadCount(c => c + 1);
        }
        return [...prev, systemMsg];
      });
    };

    const onSessionUpdate = (data: any) => {
      // Assuming data contains the full session object or partial update
      if (data && data.status) {
        setSessionStatus(data.status);
      }
    };

    socket.on(EVENTS.CHAT_MESSAGE, handleNewMessage);
    socket.on(EVENTS.SYSTEM_ALERT, handleSystemAlert);
    socket.on(EVENTS.SESSION_UPDATE, onSessionUpdate);

    return () => {
      socket.off(EVENTS.CHAT_MESSAGE, handleNewMessage);
      socket.off(EVENTS.SYSTEM_ALERT, handleSystemAlert);
      socket.off(EVENTS.SESSION_UPDATE, onSessionUpdate);
    };
  }, [socket, sessionId]);

  // Auto-scroll on new messages if already at bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  // Use ref to track scroll status for socket callback without re-binding
  const isAtBottomRef = useRef(isAtBottom);
  useEffect(() => { isAtBottomRef.current = isAtBottom; }, [isAtBottom]);

  // Maintain scroll position on resize (e.g. keyboard open)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (isAtBottomRef.current) {
        scrollToBottom("auto");
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!currentUser) return;
    
    const result = await sendMessage(sessionId, message);
    if (result.success) {
      scrollToBottom(); // Always scroll to bottom when sending
    } else {
      console.error("Failed to send message:", result.error);
      throw new Error(result.error);
    }
  };

  const handleBanUser = (userId: number, username: string) => {
    setBanModal({ isOpen: true, userId, username });
  };

  const confirmBan = async () => {
    if (!banModal) return;
    
    const { userId, username } = banModal;
    setBanModal(null); // Close modal immediately

    const result = await banUserAction(sessionId, userId);
    if (result.success) {
      showToast(t.viewingParty.admin.banSuccess.replace("{username}", username), "success");
    } else {
      showToast(t.viewingParty.admin.error.replace("{message}", result.error || ""), "error");
    }
  };

  const isChatDisabled = !isConnected || sessionStatus === "ended" || (!isChatEnabled && !isStaff);

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] relative">
      <ConfirmModal
        isOpen={!!banModal?.isOpen}
        title={t.viewingParty.admin.confirmBanTitle}
        message={t.viewingParty.admin.confirmBanMessage.replace("{username}", banModal?.username || "")}
        confirmText={t.viewingParty.admin.confirmBanButton}
        cancelText={t.viewingParty.admin.cancel}
        isDestructive={true}
        onConfirm={confirmBan}
        onCancel={() => setBanModal(null)}
      />

      <ChatHeader 
        unreadCount={unreadCount} 
        isConnected={isConnected} 
        adminControls={adminControls}
        title={title}
        isChatEnabled={isChatEnabled}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "chat" ? (
        <>
          {/* Messages Area */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            {groupedMessages.map(({ message: msg, isGrouped }) => (
              <ChatMessage 
                key={`${msg.id}-${msg.created_at}`}
                message={msg}
                isGrouped={isGrouped}
                currentUserId={currentUser?.id}
                canModerate={isStaff}
                onBanUser={handleBanUser}
              />
            ))}
            
            {sessionStatus === "ended" && (
              <div className="my-4 text-center">
                <span className="inline-block px-4 py-2 bg-red-500/10 text-red-500 text-sm font-medium rounded-full border border-red-500/20">
                  {t.viewingParty.chat.sessionEnded}
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {showScrollButton && (
            <ChatScrollButton unreadCount={unreadCount} onClick={() => scrollToBottom()} />
          )}

          <ChatInput 
            onSend={handleSendMessage} 
            currentUser={currentUser} 
            disabled={isChatDisabled}
            isBanned={isTemporaryBlocked}
            slowModeDuration={slowModeDuration}
          />
        </>
      ) : (
        <EventsTab sessionId={sessionId} events={events} />
      )}
    </div>
  );
}
