"use server";

import { revalidatePath } from "next/cache";
import { verifyAuthToken } from "@/lib/auth";
import { updateUserPoints, getAuthUserById } from "@/lib/auth/userService";
import { cookies } from "next/headers";

import { getUserHistory } from "@/lib/history/historyService";

export async function getNextRecurringClaimTime(sessionId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("geng_auth");
    if (!token) return null;

    const payload = verifyAuthToken(token.value);
    if (!payload) return null;

    const history = await getUserHistory(payload.id);
    // Find the latest claim for this session or generally? 
    // User asked "checking diem danh moi 30 phut". Usually per session or global?
    // Let's assume global "Bonus 30p Viewing Party" logic for simplicity, or per session if we include session ID in title.
    // The previous implementation used generic title. Let's stick to generic "Bonus 30p Viewing Party" for now.
    const lastClaim = history.find(h => h.title === "Bonus 30p Viewing Party");

    if (!lastClaim) return new Date().toISOString(); // Available now

    const lastTime = new Date(lastClaim.createdAt).getTime();
    const nextTime = lastTime + 30 * 60 * 1000;
    
    return new Date(nextTime).toISOString();
  } catch (error) {
    return null;
  }
}

export async function claimRecurringReward(sessionId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("geng_auth");
    if (!token) return { success: false, message: "Unauthorized" };

    const payload = verifyAuthToken(token.value);
    if (!payload) return { success: false, message: "Invalid token" };

    const user = await getAuthUserById(payload.id);
    if (!user) return { success: false, message: "User not found" };

    const history = await getUserHistory(user.id);
    const lastClaim = history.find(h => h.title === "Bonus 30p Viewing Party");

    if (lastClaim) {
      const diff = Date.now() - new Date(lastClaim.createdAt).getTime();
      if (diff < 30 * 60 * 1000) {
        const minutesLeft = Math.ceil((30 * 60 * 1000 - diff) / 60000);
        return { success: false, message: `Vui lòng đợi ${minutesLeft} phút nữa!` };
      }
    }

    await updateUserPoints(
      user.id,
      50,
      "Thưởng xem live 30 phút",
      "game",
      "Bonus 30p Viewing Party"
    );

    revalidatePath("/me");
    return { success: true, message: "Đã nhận thưởng 30 phút! (+100 điểm)" };

  } catch (error) {
    console.error("Recurring reward error:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}

export async function rewardWatchTime(sessionId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("geng_auth");
    
    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload = verifyAuthToken(token.value);
    if (!payload) {
      return { success: false, message: "Invalid token" };
    }

    const user = await getAuthUserById(payload.id);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Update points (+100)
    await updateUserPoints(
      user.id,
      100,
      "Xem Viewing Party (30 phút)",
      "system",
      "Thưởng Xem Live"
    );

    revalidatePath("/me");
    
    return { 
      success: true, 
      message: "Đã nhận 50 điểm GenG Points!",
      newPoints: user.points + 50
    };
  } catch (error) {
    console.error("Reward watch time error:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}

export async function claimCheckInReward(sessionId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("geng_auth");
    
    if (!token) return { success: false, message: "Chưa đăng nhập" };

    const payload = verifyAuthToken(token.value);
    if (!payload) return { success: false, message: "Token không hợp lệ" };

    const user = await getAuthUserById(payload.id);
    if (!user) return { success: false, message: "User not found" };

    // Check if already checked in
    // We check user_history for a title containing "Check-in Viewing Party #{sessionId}"
    // But since title might not contain sessionId, we'll use a specific format: "Check-in VP #{sessionId}"
    // For now, let's use a simpler check: look for "Check-in Viewing Party" created within the last 12 hours?
    // Or better: Use a unique title format "Check-in VP #{sessionId}" and search for it.
    
    const checkInTitle = `Check-in VP #${sessionId}`;
    
    // We need a way to check history. 
    // Since we don't have a direct method to check history by title/user in userService,
    // we might need to rely on the fact that if we insert, we can't easily check duplication without a query.
    // Let's assume we can query via a raw query here or add a helper.
    // For speed, I'll use a direct query if possible, or add a helper in historyService.
    
    // Re-using updateUserPoints but we need to check existence first.
    // Let's add a helper in historyService.ts first or do a quick check here if we can import getPool.
    
    // For now, I will assume we can allow it and rely on client state? No, that's insecure.
    // I will add a check using `getUserHistory` and filtering.
    
    const history = await import("@/lib/history/historyService").then(m => m.getUserHistory(user.id));
    const alreadyCheckedIn = history.some(h => h.title === checkInTitle);

    if (alreadyCheckedIn) {
      return { success: false, message: "Bạn đã điểm danh phiên này rồi!" };
    }

    await updateUserPoints(
      user.id,
      100,
      "Check-in Viewing Party",
      "game", 
      checkInTitle
    );

    revalidatePath("/me");
    return { success: true, message: "Điểm danh thành công! (+100 điểm)" };

  } catch (error) {
    console.error("Check-in error:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}
