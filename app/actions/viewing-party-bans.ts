"use server";

import { cookies } from "next/headers";
import { verifyAuthToken, isStaff } from "@/lib/auth";
import { getAuthUserById } from "@/lib/auth/userService";
import { banUser, unbanUser, getBannedUsers } from "@/lib/models/ViewingPartyBan";
import { socketServer } from "@/lib/realtime";
import { EVENTS, UserRole } from "@/lib/types/viewing-party";

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
  if (!isStaff(user)) {
    throw new Error("Unauthorized: Staff access required");
  }
  return user!;
}

export async function banUserAction(
  sessionId: number,
  userId: number
): Promise<ActionResponse> {
  try {
    const staff = await requireStaff();
    
    // Prevent banning other staff/admins
    // (Optional: Fetch user role first, but simple check for self-ban or rely on UI)
    if (staff.id === userId) {
      throw new Error("Cannot ban yourself");
    }

    // Check target user role
    const targetUser = await getAuthUserById(userId);
    if (!targetUser) {
      throw new Error("User not found");
    }
    
    if (targetUser.role === "staff" || targetUser.role === "admin") {
      throw new Error("Cannot ban staff or admin");
    }

    const success = await banUser(sessionId, userId, staff.id);
    if (!success) throw new Error("Failed to ban user");

    // Broadcast ban event
    // The specific user needs to know they are banned
    // We can broadcast to the room, and client checks if it matches their ID
    await socketServer.trigger(
      `session-${sessionId}`,
      EVENTS.USER_BANNED,
      { userId, bannedBy: staff.id }
    );

    return { success: true };
  } catch (error: any) {
    console.error("banUserAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function unbanUserAction(
  sessionId: number,
  userId: number
): Promise<ActionResponse> {
  try {
    const staff = await requireStaff();

    const success = await unbanUser(sessionId, userId);
    if (!success) throw new Error("Failed to unban user");

    await socketServer.trigger(
      `session-${sessionId}`,
      EVENTS.USER_UNBANNED,
      { userId, unbannedBy: staff.id }
    );

    return { success: true };
  } catch (error: any) {
    console.error("unbanUserAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function getBannedUsersAction(
  sessionId: number
): Promise<ActionResponse<any[]>> {
  try {
    await requireStaff();
    const users = await getBannedUsers(sessionId);
    return { success: true, data: users };
  } catch (error: any) {
    console.error("getBannedUsersAction error:", error);
    return { success: false, error: error.message };
  }
}
