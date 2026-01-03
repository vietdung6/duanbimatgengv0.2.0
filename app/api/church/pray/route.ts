import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { getAuthUserById, updateLastDailyPray, updateUserPoints } from "@/lib/auth/userService";

export async function POST(req: NextRequest) {
  try {
    const token = getAuthTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthUserById(payload.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
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
        return NextResponse.json({
          success: false,
          message: "Bạn đã cầu nguyện hôm nay rồi. Hãy quay lại sau 00:01 nhé!",
        }, { status: 200 });
      }
    }

    // Calculate Streak
    const yesterdayReset = new Date(lastReset.getTime() - 24 * 60 * 60 * 1000);
    let streak = 1;

    if (user.lastDailyPray) {
      const lastPrayDate = new Date(user.lastDailyPray);
      // If last pray was within the previous cycle (yesterday)
      if (lastPrayDate >= yesterdayReset && lastPrayDate < lastReset) {
        streak = (user.dailyStreak || 0) + 1;
      }
    }

    // Eligible
    await updateUserPoints(
      user.id,
      100,
      "Điểm danh Church of Chovy",
      "game",
      "Church of Chovy"
    );
    await updateLastDailyPray(user.id, now, streak);

    revalidatePath("/fan-zone/church");
    revalidatePath("/me"); // Update points in header/profile
    revalidatePath("/", "layout"); // Update global header

    return NextResponse.json({
      success: true,
      message: `Cầu nguyện thành công! +100 điểm Gen.G. Chuỗi: ${streak} ngày 🔥`,
      pointsAdded: 100,
      newTotalPoints: user.points + 100,
      streak
    }, { status: 200 });

  } catch (error) {
    console.error("Pray API error:", error);
    return NextResponse.json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại." }, { status: 500 });
  }
}
