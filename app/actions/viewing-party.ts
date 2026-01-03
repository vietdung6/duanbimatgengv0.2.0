"use server";

import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import {
  createViewingSession as createSessionModel,
  updateSessionStatus,
  updateSessionInfo,
  updateChatSettings,
  getViewingSessionById,
  getAllSessions,
  deleteViewingSession,
} from "@/lib/models/ViewingSession";
import { createChatMessage, getChatMessageById } from "@/lib/models/ChatMessage";
import { socketServer } from "@/lib/realtime";
import { CreateSessionInput, EVENTS } from "@/lib/types/viewing-party";
import { 
  createSessionSchema, 
  updateSessionSchema, 
  chatMessageSchema, 
  chatSettingsSchema 
} from "@/lib/validations/viewing-party";
import { handleActionError } from "@/lib/utils/error";

// Standard response type
type ActionResponse<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

// Helper to get current user
async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth")?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

// Helper to check staff permissions
async function requireStaff() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    throw new Error("Unauthorized: Staff access required");
  }
  return user;
}

// Helper to check login
async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Login required");
  }
  return user;
}

export async function createSession(
  input: CreateSessionInput
): Promise<ActionResponse<{ sessionId: number }>> {
  try {
    const user = await requireStaff();
    
    const result = createSessionSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid input" };
    }

    const session = await createSessionModel(result.data as CreateSessionInput, user.id);

    // Notify clients (optional, if we have a sessions list page)
    await socketServer.trigger("sessions", EVENTS.SESSION_UPDATE, session);

    return { success: true, data: { sessionId: session.id } };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function deleteSession(sessionId: number): Promise<ActionResponse> {
  try {
    await requireStaff();
    await deleteViewingSession(sessionId);
    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function fetchSessions(): Promise<ActionResponse<import("@/lib/types/viewing-party").IViewingSession[]>> {
  try {
    await requireStaff();
    const sessions = await getAllSessions();
    return { success: true, data: sessions };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function endSession(sessionId: number): Promise<ActionResponse> {
  try {
    await requireStaff();
    await updateSessionStatus(sessionId, "ended");

    await socketServer.trigger(
      `session-${sessionId}`,
      EVENTS.SESSION_UPDATE,
      { status: "ended" }
    );

    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function startSession(sessionId: number): Promise<ActionResponse> {
  try {
    await requireStaff();
    await updateSessionStatus(sessionId, "live");

    await socketServer.trigger(
      `session-${sessionId}`,
      EVENTS.SESSION_UPDATE,
      { status: "live" }
    );

    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function updateSession(
  sessionId: number,
  title: string,
  streamUrl: string
): Promise<ActionResponse> {
  try {
    await requireStaff();
    
    const result = updateSessionSchema.safeParse({ title, streamUrl });
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid input" };
    }

    await updateSessionInfo(sessionId, result.data.title, result.data.streamUrl || "");

    await socketServer.trigger(
      `session-${sessionId}`,
      EVENTS.SESSION_UPDATE,
      { title: result.data.title, stream_url: result.data.streamUrl }
    );

    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function updateChatSettingsAction(
  sessionId: number,
  isChatEnabled: boolean,
  slowModeDuration: number
): Promise<ActionResponse> {
  try {
    await requireStaff();
    
    const result = chatSettingsSchema.safeParse({ isChatEnabled, slowModeDuration });
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid input" };
    }

    await updateChatSettings(sessionId, result.data.isChatEnabled, result.data.slowModeDuration);

    await socketServer.trigger(
      `session-${sessionId}`,
      EVENTS.SESSION_UPDATE,
      { is_chat_enabled: result.data.isChatEnabled, slow_mode_duration: result.data.slowModeDuration }
    );

    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function sendMessage(
  sessionId: number,
  content: string
): Promise<ActionResponse> {
  try {
    const user = await requireUser();

    const result = chatMessageSchema.safeParse({ content });
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Message cannot be empty" };
    }

    const message = await createChatMessage(sessionId, user.id, result.data.content, "user");

    // Broadcast message
    await socketServer.trigger(
      `session-${sessionId}`,
      EVENTS.CHAT_MESSAGE,
      message
    );

    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function sendSystemAlert(
  sessionId: number,
  content: string
): Promise<ActionResponse> {
  try {
    await requireStaff();

    const message = await createChatMessage(sessionId, null, content, "system");

    // Broadcast as system alert
    await socketServer.trigger(
      `session-${sessionId}`,
      EVENTS.SYSTEM_ALERT,
      message
    );

    return { success: true };
  } catch (error: any) {
    console.error("sendSystemAlert error:", error);
    return { success: false, error: error.message };
  }
}
