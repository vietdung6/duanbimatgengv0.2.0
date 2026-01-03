"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ViewingPartyEvent, EVENTS } from "@/lib/types/viewing-party";
import { verifyAuthToken } from "@/lib/auth";
import { getAuthUserById } from "@/lib/auth/userService";
import { cookies } from "next/headers";
import { socketServer } from "@/lib/realtime";
import type { ViewingPartyEventType, ViewingPartyEventStatus } from "@prisma/client";

async function checkStaffPermission() {
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth");
  if (!token) return false;

  const payload = verifyAuthToken(token.value);
  if (!payload) return false;

  const user = await getAuthUserById(payload.id);
  return user?.role === "staff" || user?.role === "admin"; // Check both just in case
}

export async function getEventsBySessionId(sessionId: number): Promise<ViewingPartyEvent[]> {
  const rows = await prisma.viewingPartyEvent.findMany({
    where: { session_id: sessionId },
    orderBy: { created_at: "desc" },
  });

  return rows.map((row: typeof rows[0]) => ({
    id: row.id,
    session_id: row.session_id,
    type: row.type as ViewingPartyEvent["type"],
    title: row.title,
    description: row.description,
    options: row.options as string[] | null,
    correct_option_index: row.correct_option_index,
    points: row.points ?? 0,
    status: row.status as ViewingPartyEvent["status"],
    created_at: row.created_at,
  }));
}

export async function createEvent(sessionId: number, data: {
  type: ViewingPartyEvent["type"];
  title: string;
  description?: string;
  options?: string[];
  correct_option_index?: number;
  points: number;
}) {
  const isStaff = await checkStaffPermission();
  if (!isStaff) return { success: false, message: "Unauthorized" };

  try {
    const event = await prisma.viewingPartyEvent.create({
      data: {
        session_id: sessionId,
        type: data.type as ViewingPartyEventType,
        title: data.title,
        description: data.description ?? null,
        options: (data.options as any) ?? null,
        correct_option_index: data.correct_option_index ?? null,
        points: data.points,
        status: "pending",
      },
    });

    revalidatePath(`/fan-zone/viewing-party/${sessionId}`);

    // Broadcast new event
    const newEvent = { 
      id: event.id,
      session_id: event.session_id,
      type: event.type as ViewingPartyEvent["type"],
      title: event.title,
      description: event.description,
      options: event.options as string[] | null,
      correct_option_index: event.correct_option_index,
      points: event.points ?? 0,
      status: event.status as ViewingPartyEvent["status"],
      created_at: event.created_at,
    };
    await socketServer.trigger(`session-${sessionId}`, EVENTS.EVENT_UPDATE, newEvent);

    return { success: true, eventId: event.id };
  } catch (error) {
    console.error("Create event error:", error);
    return { success: false, message: "Failed to create event" };
  }
}

export async function updateEventStatus(eventId: number, status: ViewingPartyEvent["status"], sessionId: number) {
  const isStaff = await checkStaffPermission();
  if (!isStaff) return { success: false, message: "Unauthorized" };

  try {
    const updatedEventRaw = await prisma.viewingPartyEvent.update({
      where: { id: eventId },
      data: { status: status as ViewingPartyEventStatus },
    });

    revalidatePath(`/fan-zone/viewing-party/${sessionId}`);

    // Broadcast update
    const updatedEvent = { 
      id: updatedEventRaw.id,
      session_id: updatedEventRaw.session_id,
      type: updatedEventRaw.type as ViewingPartyEvent["type"],
      title: updatedEventRaw.title,
      description: updatedEventRaw.description,
      options: updatedEventRaw.options ? (typeof updatedEventRaw.options === 'string' ? JSON.parse(updatedEventRaw.options) : updatedEventRaw.options) : null,
      correct_option_index: updatedEventRaw.correct_option_index,
      points: updatedEventRaw.points ?? 0,
      status: updatedEventRaw.status as ViewingPartyEvent["status"],
      created_at: updatedEventRaw.created_at,
    };
    await socketServer.trigger(`session-${sessionId}`, EVENTS.EVENT_UPDATE, updatedEvent);

    return { success: true };
  } catch (error) {
    console.error("Update event status error:", error);
    return { success: false, message: "Failed to update status" };
  }
}

export async function deleteEvent(eventId: number, sessionId: number) {
  const isStaff = await checkStaffPermission();
  if (!isStaff) return { success: false, message: "Unauthorized" };

  try {
    await prisma.viewingPartyEvent.delete({
      where: { id: eventId },
    });
    revalidatePath(`/fan-zone/viewing-party/${sessionId}`);

    // Broadcast delete
    await socketServer.trigger(`session-${sessionId}`, EVENTS.EVENT_UPDATE, { id: eventId, _deleted: true });
    
    return { success: true };
  } catch (error) {
    console.error("Delete event error:", error);
    return { success: false, message: "Failed to delete event" };
  }
}
