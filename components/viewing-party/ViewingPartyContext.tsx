"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { EVENTS } from "@/lib/types/viewing-party";

interface ViewingPartyContextType {
  socket: Socket | null;
  isConnected: boolean;
  viewCount: number;
  isChatEnabled: boolean;
  slowModeDuration: number;
  hasCheckedIn: boolean;
  setHasCheckedIn: (value: boolean) => void;
  isTemporaryBlocked: boolean;
  setIsTemporaryBlocked: (value: boolean) => void;
}

const ViewingPartyContext = createContext<ViewingPartyContextType>({
  socket: null,
  isConnected: false,
  viewCount: 0,
  isChatEnabled: true,
  slowModeDuration: 0,
  hasCheckedIn: false,
  setHasCheckedIn: () => {},
  isTemporaryBlocked: false,
  setIsTemporaryBlocked: () => {},
});

export const useViewingParty = () => useContext(ViewingPartyContext);

import { UserRole } from "@/lib/types/viewing-party";

interface ViewingPartyProviderProps {
  sessionId: number;
  initialChatEnabled?: boolean;
  initialSlowModeDuration?: number;
  currentUser?: {
    id: number;
    username: string | null;
    role: UserRole;
  } | null;
  initialCheckInStatus?: boolean;
  initialIsBanned?: boolean;
  children: ReactNode;
}

export function ViewingPartyProvider({ 
  sessionId, 
  initialChatEnabled = true, 
  initialSlowModeDuration = 0, 
  currentUser,
  initialCheckInStatus = false,
  initialIsBanned = false,
  children 
}: ViewingPartyProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isChatEnabled, setIsChatEnabled] = useState(initialChatEnabled);
  const [slowModeDuration, setSlowModeDuration] = useState(initialSlowModeDuration);
  const [hasCheckedIn, setHasCheckedIn] = useState(initialCheckInStatus);
  const [isTemporaryBlocked, setIsTemporaryBlocked] = useState(initialIsBanned);

  useEffect(() => {
    let socketUserId: string;

    if (currentUser) {
      // Use authenticated user ID (prefixed to avoid collision with guest IDs)
      socketUserId = `user:${currentUser.id}`;
    } else {
      // Use guest ID from local storage
      const storedGuestId = typeof window !== 'undefined' ? localStorage.getItem('guest_id') : null;
      const guestId = storedGuestId || Math.random().toString(36).substr(2, 9);
      
      if (typeof window !== 'undefined' && !storedGuestId) {
          localStorage.setItem('guest_id', guestId);
      }
      socketUserId = `guest:${guestId}`;
    }

    // Initialize socket with userId in query for immediate identification
    const socketInstance = io({
      query: { userId: socketUserId }
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server:", socketInstance.id);
      const roomName = `session-${sessionId}`;
      console.log("Joining room:", roomName);
      
      // Still send userId in join_room for backward compatibility/redundancy
      socketInstance.emit("join_room", { room: roomName, userId: socketUserId });
      
      // Request initial count explicitly to ensure we have it
      socketInstance.emit("get_view_count", roomName);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    socketInstance.on("view_count_update", (data: { count: number }) => {
      console.log("View count updated:", data.count);
      setViewCount(data.count);
    });

    socketInstance.on(EVENTS.SESSION_UPDATE, (data: any) => {
      if (data.is_chat_enabled !== undefined) setIsChatEnabled(data.is_chat_enabled);
      if (data.slow_mode_duration !== undefined) setSlowModeDuration(data.slow_mode_duration);
    });

    socketInstance.on(EVENTS.USER_BANNED, (data: { userId: number }) => {
      if (currentUser && data.userId === currentUser.id) {
        setIsTemporaryBlocked(true);
      }
    });

    socketInstance.on(EVENTS.USER_UNBANNED, (data: { userId: number }) => {
      if (currentUser && data.userId === currentUser.id) {
        setIsTemporaryBlocked(false);
      }
    });

    setSocket(socketInstance);

    // Periodic sync for view count (every 30s)
    const syncInterval = setInterval(() => {
      if (socketInstance.connected) {
        socketInstance.emit("get_view_count", `session-${sessionId}`);
      }
    }, 30000);

    return () => {
      clearInterval(syncInterval);
      socketInstance.emit("leave_room", `session-${sessionId}`);
      socketInstance.disconnect();
    };
  }, [sessionId, currentUser?.id]);

  return (
    <ViewingPartyContext.Provider value={{ 
      socket, 
      isConnected, 
      viewCount, 
      isChatEnabled, 
      slowModeDuration, 
      hasCheckedIn, 
      setHasCheckedIn,
      isTemporaryBlocked,
      setIsTemporaryBlocked
    }}>
      {children}
    </ViewingPartyContext.Provider>
  );
}
