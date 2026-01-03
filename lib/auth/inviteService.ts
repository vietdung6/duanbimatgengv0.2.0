import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { InviteTokenRole } from "@prisma/client";

export interface InviteToken {
  id: number;
  token: string;
  createdByStaffId: number;
  expiresAt: Date;
  used: boolean;
  usedByUserId: number | null;
  createdAt: Date;
  role: "fan" | "staff";
}

function mapPrismaToInviteToken(row: any): InviteToken {
  return {
    id: row.id,
    token: row.token,
    createdByStaffId: row.created_by_staff_id,
    expiresAt: row.expires_at,
    used: row.used,
    usedByUserId: row.used_by_user_id,
    createdAt: row.created_at,
    role: row.role as "fan" | "staff",
  };
}

export async function createInviteToken(
  staffId: number,
  role: "fan" | "staff" = "fan",
  expiresInHours: number = 24
): Promise<InviteToken> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const createdToken = await prisma.inviteToken.create({
    data: {
      token,
      created_by_staff_id: staffId,
      expires_at: expiresAt,
      used: false,
      role: role as InviteTokenRole,
    },
  });

  return mapPrismaToInviteToken(createdToken);
}

export async function validateInviteToken(
  token: string
): Promise<InviteToken | null> {
  const invite = await prisma.inviteToken.findFirst({
    where: { token },
  });

  if (!invite) {
    return null;
  }

  const mappedInvite = mapPrismaToInviteToken(invite);

  if (mappedInvite.used) {
    return null;
  }

  if (new Date() > mappedInvite.expiresAt) {
    return null;
  }

  return mappedInvite;
}

export async function markInviteTokenAsUsed(
  token: string,
  userId: number
): Promise<void> {
  // We use updateMany because token might not be marked as unique in Prisma schema
  // although conceptually it is.
  await prisma.inviteToken.updateMany({
    where: { token },
    data: {
      used: true,
      used_by_user_id: userId,
    },
  });
}

export async function listInviteTokens(): Promise<InviteToken[]> {
  const tokens = await prisma.inviteToken.findMany({
    orderBy: { created_at: "desc" },
    take: 50,
  });

  return tokens.map(mapPrismaToInviteToken);
}

export async function getInviteTokenById(id: number): Promise<InviteToken | null> {
  const invite = await prisma.inviteToken.findUnique({
    where: { id },
  });

  if (!invite) return null;
  return mapPrismaToInviteToken(invite);
}

export async function deleteInviteToken(id: number): Promise<void> {
  await prisma.inviteToken.delete({
    where: { id },
  });
}
