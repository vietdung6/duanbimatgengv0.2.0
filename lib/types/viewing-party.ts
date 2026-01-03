export type UserRole = "fan" | "staff" | "admin";

export interface IViewingSession {
  id: number;
  title: string;
  stream_url?: string;
  status: "scheduled" | "live" | "ended";
  start_time: Date;
  created_at: Date;
  updated_at: Date;
  created_by: number; // user_id of staff
  is_chat_enabled: boolean;
  slow_mode_duration: number;
}

export interface IChatMessage {
  id: number;
  session_id: number;
  user_id: number | null; // null for system messages
  content: string;
  type: "user" | "system";
  created_at: Date;
  user?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    role: UserRole;
  };
}

export interface CreateSessionInput {
  title: string;
  stream_url?: string;
  start_time: Date;
  type?: "online" | "offline";
  location?: string;
  map_url?: string;
}

export interface SendMessageInput {
  session_id: number;
  content: string;
}

export const EVENTS = {
  CHAT_MESSAGE: "chat:message",
  SESSION_UPDATE: "session:update",
  SYSTEM_ALERT: "system:alert",
  EVENT_UPDATE: "event:update",
  USER_BANNED: "user:banned",
  USER_UNBANNED: "user:unbanned",
};

export interface ViewingPartyEvent {
  id: number;
  session_id: number;
  type: "quiz" | "prediction" | "check_in" | "poll";
  title: string;
  description: string | null;
  options: string[] | null; // JSON array of strings
  correct_option_index: number | null;
  points: number;
  status: "pending" | "active" | "ended";
  created_at: Date;
}

