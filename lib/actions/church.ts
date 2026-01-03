"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { verifyAuthToken } from "@/lib/auth";
import { getAuthUserById, updateLastDailyPray, updateUserPoints } from "@/lib/auth/userService";

export interface PrayResult {
  success: boolean;
  message: string;
  pointsAdded?: number;
  newTotalPoints?: number;
  nextReset?: string;
}

export async function prayAction(): Promise<PrayResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth")?.value;

  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return { success: false, message: "Unauthorized" };
  }

  const user = await getAuthUserById(payload.id);
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const now = new Date();
  
  // Calculate the last reset time (00:01 VN Time)
  // VN is UTC+7
  const vnOffset = 7 * 60 * 60 * 1000;
  const vnTime = new Date(now.getTime() + vnOffset);
  
  const vnYear = vnTime.getUTCFullYear();
  const vnMonth = vnTime.getUTCMonth();
  const vnDay = vnTime.getUTCDate();
  const vnHour = vnTime.getUTCHours();
  const vnMinute = vnTime.getUTCMinutes();
  
  // Construct 00:01 for "Today" in VN terms (treated as UTC for calculation)
  let resetTimeVN = new Date(Date.UTC(vnYear, vnMonth, vnDay, 0, 1, 0, 0));
  
  // If current VN time is before 00:01, then the last reset was yesterday
  if (vnHour === 0 && vnMinute < 1) {
     resetTimeVN = new Date(Date.UTC(vnYear, vnMonth, vnDay - 1, 0, 1, 0, 0));
  }
  
  // Convert back to real UTC timestamp
  const lastReset = new Date(resetTimeVN.getTime() - vnOffset);

  // Check if user has prayed since the last reset
  if (user.lastDailyPray) {
    const lastPrayDate = new Date(user.lastDailyPray);
    if (lastPrayDate >= lastReset) {
      return { 
        success: false, 
        message: "Bạn đã cầu nguyện hôm nay rồi. Hãy quay lại sau 00:01 nhé!",
      };
    }
  }

  // Eligible
  try {
    await updateUserPoints(
      user.id,
      100,
      "Điểm danh Church of Chovy",
      "game",
      "Church of Chovy"
    );
    await updateLastDailyPray(user.id, now);
    
    revalidatePath("/fan-zone/church");
    revalidatePath("/me"); // Update points in header/profile
    revalidatePath("/", "layout"); // Update global header

    return {
      success: true,
      message: "Cầu nguyện thành công! +100 điểm Gen.G",
      pointsAdded: 100,
      newTotalPoints: user.points + 100
    };
  } catch (error) {
    console.error("Pray action error:", error);
    return { success: false, message: "Có lỗi xảy ra, vui lòng thử lại." };
  }
}
