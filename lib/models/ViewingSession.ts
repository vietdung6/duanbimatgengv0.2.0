import { prisma } from "@/lib/prisma";
import { IViewingSession, CreateSessionInput } from "../types/viewing-party";
import type { ViewingSessionType, ViewingSessionStatus, ViewingSession } from "@prisma/client";

function mapToIViewingSession(session: ViewingSession): IViewingSession {
  return {
    id: session.id,
    title: session.title,
    stream_url: session.stream_url,
    status: (session.status as "scheduled" | "live" | "ended") || "scheduled",
    start_time: session.start_time,
    created_at: session.created_at || new Date(),
    updated_at: session.updated_at || new Date(),
    created_by: session.created_by,
    is_chat_enabled: session.is_chat_enabled ?? true,
    slow_mode_duration: session.slow_mode_duration ?? 0,
  };
}

export async function createViewingSession(
  input: CreateSessionInput,
  userId: number
): Promise<IViewingSession> {
  const session = await prisma.viewingSession.create({
    data: {
      title: input.title,
      stream_url: input.stream_url ?? "",
      type: (input.type as ViewingSessionType) ?? "online",
      location: input.location ?? null,
      map_url: input.map_url ?? null,
      start_time: input.start_time,
      created_by: userId,
      status: "scheduled",
      is_chat_enabled: true,
      slow_mode_duration: 0,
    },
  });

  return mapToIViewingSession(session);
}

export async function deleteViewingSession(id: number): Promise<boolean> {
  try {
    // Cascade delete is handled by database foreign keys usually, 
    // but Prisma also supports it if configured. 
    // The schema has onDelete: Cascade for chat_messages, so we can just delete the session.
    await prisma.viewingSession.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function getViewingSessionById(id: number): Promise<IViewingSession | null> {
  const session = await prisma.viewingSession.findUnique({
    where: { id },
  });
  return session ? mapToIViewingSession(session) : null;
}

export async function getActiveSessions(): Promise<IViewingSession[]> {
  const sessions = await prisma.viewingSession.findMany({
    where: {
      status: {
        in: ["scheduled", "live"],
      },
    },
    orderBy: {
      start_time: "asc",
    },
  });
  return sessions.map(mapToIViewingSession);
}

export async function getAllSessions(): Promise<IViewingSession[]> {
  const sessions = await prisma.viewingSession.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
  return sessions.map(mapToIViewingSession);
}

export async function updateSessionStatus(
  id: number,
  status: "scheduled" | "live" | "ended"
): Promise<void> {
  await prisma.viewingSession.update({
    where: { id },
    data: { status: status as ViewingSessionStatus },
  });
}

export async function updateSessionInfo(
  id: number,
  title: string,
  stream_url: string
): Promise<void> {
  await prisma.viewingSession.update({
    where: { id },
    data: { title, stream_url },
  });
}

export async function updateChatSettings(
  id: number,
  isChatEnabled: boolean,
  slowModeDuration: number
): Promise<void> {
  await prisma.viewingSession.update({
    where: { id },
    data: {
      is_chat_enabled: isChatEnabled,
      slow_mode_duration: slowModeDuration,
    },
  });
}
