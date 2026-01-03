import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { User, UserRole } from "@prisma/client";
import { logUserActivity } from "@/lib/history/historyService";
import type { AuthUser } from "./index";

function mapRowToAuthUser(row: User): AuthUser {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    avatarUrl: row.avatar_url ?? null,
    displayName: row.display_name ?? null,
    proof: row.proof ?? null,
    points: row.points ?? 0,
    totalPoints: row.total_points ?? 0,
    lastDailyPray: row.last_daily_pray ?? null,
    dailyStreak: row.daily_streak ?? 0,
    lastDisplayNameChange: row.last_display_name_change ?? null,
    role: (row.role as "fan" | "staff" | "admin") ?? "fan",
    twoFactorEnabled: row.two_factor_enabled ?? false,
  };
}

export async function findUserByEmailOrUsername(
  emailOrUsername: string
): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    },
  });

  return user;
}

export async function validateUserCredentials(
  emailOrUsername: string,
  password: string
): Promise<AuthUser | null> {
  const userRow = await findUserByEmailOrUsername(emailOrUsername);
  if (!userRow) return null;

  const ok = await bcrypt.compare(password, userRow.password_hash);
  if (!ok) return null;

  return mapRowToAuthUser(userRow);
}

export async function getAuthUserById(id: number): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return null;
  }

  return mapRowToAuthUser(user);
}

export async function updateLastDailyPray(userId: number, date: Date, streak?: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      last_daily_pray: date,
      ...(streak !== undefined && { daily_streak: streak })
    },
  });
}

export async function updateUserAvatar(
  userId: number,
  avatarUrl: string | null
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { avatar_url: avatarUrl },
  });
}

export async function updateUserDisplayName(
  userId: number,
  displayName: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      display_name: displayName,
      last_display_name_change: new Date()
    },
  });

  await logUserActivity(
    userId,
    "notification",
    "Cập nhật hồ sơ",
    `Bạn đã đổi tên hiển thị thành "${displayName}".`,
    0
  );
}

export async function listUsers(): Promise<AuthUser[]> {
  const users = await prisma.user.findMany({
    orderBy: { created_at: "desc" },
  });

  return users.map(mapRowToAuthUser);
}

export interface CreateUserInput {
  email: string;
  username?: string | null;
  password: string;
  displayName?: string | null;
  proof?: string | null;
  points?: number;
  role?: "fan" | "staff" | "admin";
}

export async function createUser(input: CreateUserInput): Promise<AuthUser> {
  const email = input.email.trim();
  const username = input.username?.trim() || null;
  const role = input.role ?? "fan";
  const displayName =
    input.displayName?.trim() || username || email.split("@")[0];
  const proof = input.proof?.trim() || null;
  const points = input.points ?? 0;

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: username },
      ],
    },
  });

  if (existing) {
    throw new Error("EMAIL_OR_USERNAME_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      avatar_url: null,
      display_name: displayName ?? null,
      proof,
      points,
      total_points: 0,
      password_hash: passwordHash,
      role: role as UserRole,
      two_factor_enabled: false,
    },
  });

  return mapRowToAuthUser(newUser);
}

export async function deleteUserById(id: number): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function resetAllPoints(): Promise<number> {
  // Get users who will be affected
  const usersToReset = await prisma.user.findMany({
    where: { points: { gt: 0 } },
    select: { id: true, points: true },
  });

  if (usersToReset.length === 0) return 0;

  // Use executeRaw for bulk update with arithmetic
  // UPDATE users SET total_points = total_points + points, points = 0 WHERE points > 0
  const affected = await prisma.$executeRaw`UPDATE users SET total_points = total_points + points, points = 0 WHERE points > 0`;

  // Log history for each user
  for (const user of usersToReset) {
    if (user.points && user.points > 0) {
      await logUserActivity(
        user.id,
        "point",
        "Reset Điểm Mùa Giải",
        `Đã chuyển ${user.points} điểm sang tổng điểm tích lũy.`,
        -user.points
      );
    }
  }

  return Number(affected);
}

export async function updateUserPoints(
  userId: number,
  pointsDelta: number,
  reason: string,
  source: "admin" | "system" | "game" = "system",
  customTitle?: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      points: {
        increment: pointsDelta,
      },
    },
  });

  const defaultTitle = pointsDelta > 0 ? "Nhận Điểm" : "Trừ Điểm";

  await logUserActivity(
    userId,
    source === "admin" ? "admin" : "point",
    customTitle || defaultTitle,
    reason,
    pointsDelta
  );
}

export async function updateUserPassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  // Get user with password hash
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { success: false, error: "USER_NOT_FOUND" };
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isValid) {
    return { success: false, error: "INVALID_CURRENT_PASSWORD" };
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password_hash: newPasswordHash },
  });

  // Log activity
  await logUserActivity(
    userId,
    "notification",
    "Đổi Mật Khẩu",
    "Bạn đã thay đổi mật khẩu thành công.",
    0
  );

  return { success: true };
}

// ==========================================
// TWO FACTOR AUTHENTICATION (2FA)
// ==========================================

import { authenticator } from "otplib";

// Config otplib: window=2 (cho phép lệch ±60s), step=30 (mặc định)
authenticator.options = {
  window: 2,
  step: 30
};

/**
 * Generates a new 2FA secret for the user (but doesn't enable it yet).
 * Returns the secret and the otpauth URL for QR code generation.
 */
export async function setup2FA(userId: number): Promise<{ secret: string; otpauth: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, two_factor_secret: true }
  });
  if (!user) throw new Error("USER_NOT_FOUND");

  // Re-use secret if exists, or generate new
  const secret = user.two_factor_secret || authenticator.generateSecret();
  const otpauth = authenticator.keyuri(user.email, "Gen.G Fandom", secret);

  if (!user.two_factor_secret) {
    await prisma.user.update({
      where: { id: userId },
      data: { two_factor_secret: secret },
    });
    console.log(`[2FA] Generated new secret for user ${userId}`);
  }

  return { secret, otpauth };
}

/**
 * Verifies a 2FA token against the user's stored secret.
 */
export async function verify2FAToken(userId: number, token: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { two_factor_secret: true },
  });

  if (!user?.two_factor_secret) {
    console.log(`[2FA] Verify failed: No secret for user ${userId}`);
    return false;
  }

  const cleanToken = String(token).replace(/\D/g, "");
  if (cleanToken.length !== 6) return false;

  const isValid = authenticator.verify({
    token: cleanToken,
    secret: user.two_factor_secret,
  });

  console.log(`[2FA] Verify user ${userId}: token=${cleanToken}, isValid=${isValid}`);
  return isValid;
}

/**
 * Enables 2FA for the user after successful verification of the first token.
 */
export async function enable2FA(userId: number, token: string): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { two_factor_enabled: true }
  });

  // Nếu đã bật rồi (vừa click xong chẳng hạn) thì return success luôn
  if (user?.two_factor_enabled) return { success: true };

  const isValid = await verify2FAToken(userId, token);
  if (!isValid) {
    return { success: false, error: "INVALID_TOKEN" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { two_factor_enabled: true },
  });

  await logUserActivity(
    userId,
    "notification",
    "Bật 2FA",
    "Bạn đã kích hoạt bảo mật 2 lớp thành công.",
    0
  );

  return { success: true };
}

/**
 * Disables 2FA for the user. Requires a valid token.
 */
export async function disable2FA(userId: number, token: string): Promise<{ success: boolean; error?: string }> {
  const isValid = await verify2FAToken(userId, token);
  if (!isValid) {
    return { success: false, error: "INVALID_TOKEN" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      two_factor_enabled: false,
      two_factor_secret: null,
    },
  });

  await logUserActivity(
    userId,
    "notification",
    "Tắt 2FA",
    "Bạn đã hủy kích hoạt bảo mật 2 lớp.",
    0
  );

  return { success: true };
}

