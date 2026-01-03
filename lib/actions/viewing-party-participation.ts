"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth";
import { getAuthUserById, updateUserPoints } from "@/lib/auth/userService";
import { cookies } from "next/headers";
import { ViewingPartyEvent } from "@/lib/types/viewing-party";

// Helper to get current user
async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth")?.value;
  if (!token) return null;
  const payload = verifyAuthToken(token);
  if (!payload) return null;
  return getAuthUserById(payload.id);
}

export interface UserParticipation {
  id: number;
  event_id: number;
  user_id: number;
  selected_option_index: number | null;
  is_correct: boolean | null;
  created_at: Date;
}

export async function getUserParticipation(sessionId: number): Promise<UserParticipation[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const rows = await prisma.viewingPartyResponse.findMany({
    where: {
      user_id: user.id,
      viewingPartyEvent: {
        session_id: sessionId,
      },
    },
  });
  
  return rows;
}

export async function submitEventResponse(eventId: number, sessionId: number, optionIndex?: number) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Vui lòng đăng nhập" };

  try {
    // 1. Get event details
    const eventRaw = await prisma.viewingPartyEvent.findUnique({
      where: { id: eventId },
    });
    
    if (!eventRaw) return { success: false, message: "Sự kiện không tồn tại" };
    
    // Map to ViewingPartyEvent to access type-safe properties if needed, 
    // or just use raw Prisma type which is similar enough for logic.
    // However, options is string in Prisma, but string[] in ViewingPartyEvent.
    // We only need basic fields here.
    
    if (eventRaw.status !== "active") {
      return { success: false, message: "Sự kiện đã kết thúc hoặc chưa bắt đầu" };
    }

    // 2. Check if already responded
    const existing = await prisma.viewingPartyResponse.findUnique({
      where: {
        user_id_event_id: {
          user_id: user.id,
          event_id: eventId,
        },
      },
    });
    
    if (existing) {
      return { success: false, message: "Bạn đã tham gia sự kiện này rồi" };
    }

    // 3. Process response
    let isCorrect = null;
    let pointsAwarded = 0;

    // Prisma enum types
    const eventType = eventRaw.type;

    if (eventType === "quiz" || eventType === "prediction") {
      if (optionIndex === undefined) return { success: false, message: "Vui lòng chọn đáp án" };
      
      if (eventType === "quiz") {
        isCorrect = optionIndex === eventRaw.correct_option_index;
        if (isCorrect) {
          pointsAwarded = eventRaw.points ?? 0;
        }
      }
      // For prediction, points are awarded later via settlement
    } else if (eventType === "check_in") {
      // Check-in events award points immediately
      pointsAwarded = eventRaw.points ?? 0;
      isCorrect = true; // Mark as "correct" or successful completion
    }

    // 4. Record response
    await prisma.viewingPartyResponse.create({
      data: {
        event_id: eventId,
        user_id: user.id,
        selected_option_index: optionIndex ?? null,
        is_correct: isCorrect,
      },
    });

    // 5. Award points if applicable
    if (pointsAwarded > 0) {
      await updateUserPoints(
        user.id,
        pointsAwarded,
        `Thưởng sự kiện: ${eventRaw.title}`,
        "game",
        `Event #${eventId}`
      );
    }

    revalidatePath(`/fan-zone/viewing-party/${sessionId}`);
    
    return { 
      success: true, 
      message: isCorrect === false 
        ? "Rất tiếc, câu trả lời chưa chính xác" 
        : `Tham gia thành công! ${pointsAwarded > 0 ? `(+${pointsAwarded} điểm)` : ""}`,
      isCorrect,
      pointsAwarded
    };

  } catch (error) {
    console.error("Submit response error:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}
