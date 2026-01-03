import type { AuthUser } from "@/lib/auth";
import type { 
  UsersResponse, 
  InviteToken, 
  InvitesResponse, 
  Match, 
  MatchesResponse 
} from "@/app/staff/types";

// ==========================================
// USER API
// ==========================================

export async function getUsers(): Promise<AuthUser[]> {
  const res = await fetch("/api/staff/users");
  if (!res.ok) throw new Error("Không thể tải danh sách tài khoản");
  const data = (await res.json()) as UsersResponse;
  return data.users;
}

export interface CreateUserInput {
  email: string;
  username?: string | null;
  password?: string;
  role: "fan" | "staff";
  displayName?: string | null;
  proof?: string | null;
  points: number;
}

export async function createUser(userData: CreateUserInput): Promise<AuthUser> {
  const res = await fetch("/api/staff/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Không thể tạo tài khoản");
  }
  return data.user;
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`/api/staff/users/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Không thể xoá tài khoản");
  }
}

export async function resetMonthlyPoints(): Promise<void> {
  const res = await fetch("/api/staff/points/reset", {
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Không thể reset điểm");
  }
}

// ==========================================
// INVITE API
// ==========================================

export async function getInvites(): Promise<InviteToken[]> {
  const res = await fetch("/api/staff/invites");
  if (res.ok) {
    const data = (await res.json()) as InvitesResponse;
    return data.invites || [];
  }
  return [];
}

export async function createInvite(role: "fan" | "staff" = "fan"): Promise<InviteToken> {
  const res = await fetch("/api/staff/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Không thể tạo invite link");
  }
  return data.invite as InviteToken;
}

export async function deleteInvite(id: number): Promise<void> {
  const res = await fetch(`/api/staff/invites?id=${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete invite");
  }
}

// ==========================================
// SCHEDULE API
// ==========================================

export async function getMatches(): Promise<Match[]> {
  const res = await fetch("/api/staff/schedule");
  if (res.ok) {
    const data = (await res.json()) as MatchesResponse;
    return data.matches || [];
  }
  return [];
}

export interface SaveMatchInput {
  id?: number;
  opponent_name: string;
  opponent_logo?: string | null;
  match_date: string;
  timezone?: string;
  tournament: string;
  stage?: string | null;
  round_name?: string | null;
  match_type?: string | null;
  match_status: "scheduled" | "finished";
  score_gen: number;
  score_opp: number;
  match_result?: "win" | "loss" | "draw" | null | "";
  patch?: string | null;
  is_featured?: boolean;
  mvp?: string | null;
  vod_url?: string | null;
  roster?: string[] | null;
  games?: { result: "win" | "loss"; side: "blue" | "red" }[] | null;
}

export async function saveMatch(matchData: SaveMatchInput): Promise<void> {
  const method = matchData.id ? "PUT" : "POST";
  const url = matchData.id 
    ? `/api/staff/schedule/${matchData.id}` 
    : "/api/staff/schedule";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...matchData,
      timezone: matchData.timezone || "KST"
    }),
  });

  if (!res.ok) throw new Error("Không thể lưu trận đấu");
}

export async function deleteMatch(id: number): Promise<void> {
  const res = await fetch(`/api/staff/schedule/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}
