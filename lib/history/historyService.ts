import { prisma } from "@/lib/prisma";
import type { UserHistory as PrismaUserHistory } from "@prisma/client";
import { UserHistoryType } from "@prisma/client";

export interface UserHistory {
  id: number;
  userId: number;
  type: "point" | "admin" | "notification";
  title: string;
  description: string | null;
  pointsChange: number;
  createdAt: Date;
}

function mapRowToUserHistory(row: PrismaUserHistory): UserHistory {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as "point" | "admin" | "notification",
    title: row.title,
    description: row.description,
    pointsChange: row.points_change ?? 0,
    createdAt: row.created_at,
  };
}

export async function getUserHistory(userId: number): Promise<UserHistory[]> {
  const rows = await prisma.userHistory.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });

  return rows.map(mapRowToUserHistory);
}

export async function logUserActivity(
  userId: number,
  type: "point" | "admin" | "notification",
  title: string,
  description: string | null,
  pointsChange: number = 0
): Promise<void> {
  await prisma.userHistory.create({
    data: {
      user_id: userId,
      type: type as UserHistoryType,
      title,
      description,
      points_change: pointsChange,
    },
  });
}
