export type UserRole = "fan" | "staff" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  displayName: string | null;
  proof: string | null;
  points: number;
  totalPoints: number;
  lastDailyPray?: string | Date | null;
  dailyStreak?: number;
  lastDisplayNameChange?: string | Date | null;
  role: UserRole | string;
  twoFactorEnabled: boolean;
}
