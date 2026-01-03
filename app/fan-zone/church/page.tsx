import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyAuthToken } from "@/lib/auth";
import { getAuthUserById } from "@/lib/auth/userService";
import ChurchClient from "./ChurchClient";

export default async function ChurchPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth")?.value || null;
  const authUser = token ? verifyAuthToken(token) : null;

  if (!authUser) {
    redirect("/login?redirect=/fan-zone/church");
  }

  const user = await getAuthUserById(authUser.id);

  if (!user) {
    redirect("/login");
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

  const hasPrayedToday = !!(user.lastDailyPray && new Date(user.lastDailyPray) >= lastReset);

  return <ChurchClient initialHasPrayed={hasPrayedToday} initialStreak={user.dailyStreak || 0} user={user} />;
}
