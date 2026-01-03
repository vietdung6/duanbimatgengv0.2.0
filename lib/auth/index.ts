import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";
import { AuthUser, UserRole } from "./types";

export * from "./types";

const AUTH_COOKIE_NAME = "geng_auth";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("WARNING: Missing JWT_SECRET environment variable. Auth functions will fail.");
}


interface JwtPayloadShape {
  sub: number;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  displayName: string | null;
  proof: string | null;
  points: number;
  totalPoints: number;
  lastDailyPray: string | Date | null;
  dailyStreak: number;
  role: UserRole | string;
  twoFactorEnabled: boolean;
}

export function signAuthToken(user: AuthUser): string {
  const payload: JwtPayloadShape = {
    sub: user.id,
    email: user.email,
    username: user.username,
    avatarUrl: user.avatarUrl,
    displayName: user.displayName,
    proof: user.proof,
    points: user.points,
    totalPoints: user.totalPoints,
    lastDailyPray: user.lastDailyPray ?? null,
    dailyStreak: user.dailyStreak ?? 0,
    role: user.role,
    twoFactorEnabled: user.twoFactorEnabled,
  };

  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export function verifyAuthToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as JwtPayloadShape;
    return {
      id: decoded.sub,
      email: decoded.email,
      username: decoded.username,
      avatarUrl: decoded.avatarUrl,
      displayName: decoded.displayName,
      proof: decoded.proof,
      points: decoded.points,
      totalPoints: decoded.totalPoints,
      lastDailyPray: decoded.lastDailyPray,
      dailyStreak: decoded.dailyStreak || 0,
      role: decoded.role,
      twoFactorEnabled: decoded.twoFactorEnabled,
    };
  } catch {
    return null;
  }
}

export function getAuthTokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  return cookie?.value ?? null;
}

export function setAuthCookie(res: NextResponse, token: string): void {
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// ==========================================
// PERMISSION HELPERS
// ==========================================

/**
 * Checks if the user has Admin privileges.
 */
export function isAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "admin";
}

/**
 * Checks if the user has Staff privileges (includes Admin).
 * Use this for protecting Staff-only routes/features.
 */
export function isStaff(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "staff" || user.role === "admin";
}

/**
 * Checks strictly if the user is a Staff member (excluding Admin).
 * Useful for UI distinctions (e.g., showing different badges).
 */
export function isStrictStaff(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "staff";
}
/**
 * Retrieves the auth token from cookies in a Server Component.
 */
export async function getAuthTokenCookies(): Promise<string | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}
