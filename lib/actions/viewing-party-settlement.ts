"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken, isStaff } from "@/lib/auth";
import { getAuthUserById, updateUserPoints } from "@/lib/auth/userService";
import { cookies } from "next/headers";
import { ViewingPartyEvent, EVENTS } from "@/lib/types/viewing-party";
import { socketServer } from "@/lib/realtime";
import { ViewingPartyEventStatus } from "@prisma/client";

async function checkStaffPermission() {
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth");
  if (!token) return false;

  const payload = verifyAuthToken(token.value);
  if (!payload) return false;

  const user = await getAuthUserById(payload.id);
  return isStaff(user);
}

export async function settleEventPrediction(
  eventId: number, 
  sessionId: number, 
  correctOptionIndex: number
) {
  const isStaff = await checkStaffPermission();
  if (!isStaff) return { success: false, message: "Unauthorized" };

  try {
    // 1. Get event details
    const event = await prisma.viewingPartyEvent.findUnique({
      where: { id: eventId },
    });
    
    if (!event) return { success: false, message: "Sự kiện không tồn tại" };
    
    // 2. Update event with correct option
    await prisma.viewingPartyEvent.update({
      where: { id: eventId },
      data: {
        correct_option_index: correctOptionIndex,
        status: "ended",
      },
    });

    // 3. Find winners (users who selected the correct option)
    const winners = await prisma.viewingPartyResponse.findMany({
      where: {
        event_id: eventId,
        selected_option_index: correctOptionIndex,
      },
      select: { user_id: true },
    });

    // 4. Update responses to be correct
    await prisma.viewingPartyResponse.updateMany({
      where: {
        event_id: eventId,
        selected_option_index: correctOptionIndex,
      },
      data: { is_correct: true },
    });
    
    // Update others to false
    await prisma.viewingPartyResponse.updateMany({
      where: {
        event_id: eventId,
        selected_option_index: { not: correctOptionIndex },
      },
      data: { is_correct: false },
    });

    // 5. Award points to winners
    let processedCount = 0;
    for (const winner of winners) {
      await updateUserPoints(
        winner.user_id,
        event.points ?? 0,
        `Thắng dự đoán: ${event.title}`,
        "game",
        `Event #${eventId}`
      );
      processedCount++;
    }

    revalidatePath(`/fan-zone/viewing-party/${sessionId}`);

    // Broadcast update
    const updatedEvent = { 
      id: event.id,
      session_id: event.session_id,
      type: event.type as ViewingPartyEvent["type"],
      title: event.title,
      description: event.description,
      options: event.options as string[] | null,
      correct_option_index: correctOptionIndex,
      points: event.points ?? 0,
      status: 'ended' as ViewingPartyEvent["status"],
      created_at: event.created_at,
    };
    await socketServer.trigger(`session-${sessionId}`, EVENTS.EVENT_UPDATE, updatedEvent);

    return { 
      success: true, 
      message: `Đã trả thưởng cho ${processedCount} người dự đoán đúng` 
    };

  } catch (error) {
    console.error("Settle prediction error:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}

export async function settleEventParticipationReward(
  eventId: number, 
  sessionId: number
) {
  const isStaff = await checkStaffPermission();
  if (!isStaff) return { success: false, message: "Unauthorized" };

  try {
    // 1. Get event details
    const event = await prisma.viewingPartyEvent.findUnique({
      where: { id: eventId },
    });
    
    if (!event) return { success: false, message: "Sự kiện không tồn tại" };
    
    // 2. Update event status
    await prisma.viewingPartyEvent.update({
      where: { id: eventId },
      data: { status: "ended" },
    });

    // 3. Find all participants
    const participants = await prisma.viewingPartyResponse.findMany({
      where: { event_id: eventId },
      select: { user_id: true },
    });

    // 4. Update all responses to be correct (participation reward)
    await prisma.viewingPartyResponse.updateMany({
      where: { event_id: eventId },
      data: { is_correct: true },
    });

    // 5. Award points to all participants
    let processedCount = 0;
    for (const p of participants) {
      await updateUserPoints(
        p.user_id,
        event.points ?? 0,
        `Thưởng tham gia: ${event.title}`,
        "game",
        `Event #${eventId}`
      );
      processedCount++;
    }

    revalidatePath(`/fan-zone/viewing-party/${sessionId}`);

    // Broadcast update
    const updatedEvent = { 
      id: event.id,
      session_id: event.session_id,
      type: event.type as ViewingPartyEvent["type"],
      title: event.title,
      description: event.description,
      options: event.options as string[] | null,
      correct_option_index: event.correct_option_index,
      points: event.points ?? 0,
      status: 'ended' as ViewingPartyEvent["status"],
      created_at: event.created_at,
    };
    await socketServer.trigger(`session-${sessionId}`, EVENTS.EVENT_UPDATE, updatedEvent);

    return { 
      success: true, 
      message: `Đã phát thưởng cho tất cả ${processedCount} người tham gia` 
    };

  } catch (error) {
    console.error("Settle participation error:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}
