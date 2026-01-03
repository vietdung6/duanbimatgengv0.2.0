import { prisma } from "@/lib/prisma";

export interface IBannedUser {
  session_id: number;
  user_id: number;
  banned_by: number;
  created_at: Date;
  user?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export async function banUser(sessionId: number, userId: number, bannedBy: number): Promise<boolean> {
  try {
    await prisma.viewingSessionBan.create({
      data: {
        session_id: sessionId,
        user_id: userId,
        banned_by: bannedBy,
      },
    });
    return true;
  } catch (error) {
    console.error("banUser error:", error);
    return false;
  }
}

export async function unbanUser(sessionId: number, userId: number): Promise<boolean> {
  try {
    await prisma.viewingSessionBan.delete({
      where: {
        session_id_user_id: {
          session_id: sessionId,
          user_id: userId,
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function getBannedUsers(sessionId: number): Promise<IBannedUser[]> {
  const bans = await prisma.viewingSessionBan.findMany({
    where: { session_id: sessionId },
    include: { user: true },
    orderBy: { created_at: "desc" },
  });
  
  return bans.map((ban: typeof bans[0]) => ({
    session_id: ban.session_id,
    user_id: ban.user_id,
    banned_by: ban.banned_by,
    created_at: ban.created_at,
    user: {
      username: ban.user.username ?? "",
      display_name: ban.user.display_name ?? "",
      avatar_url: ban.user.avatar_url
    }
  }));
}

export async function isUserBanned(sessionId: number, userId: number): Promise<boolean> {
  const ban = await prisma.viewingSessionBan.findUnique({
    where: {
      session_id_user_id: {
        session_id: sessionId,
        user_id: userId,
      },
    },
  });
  return !!ban;
}

