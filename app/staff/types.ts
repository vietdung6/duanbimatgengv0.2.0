import type { AuthUser } from "@/lib/auth";

export interface UsersResponse {
  users: AuthUser[];
}

export interface GameResult {
  result: "win" | "loss";
  side: "blue" | "red";
}

export interface Match {
  id: number;
  opponent_name: string;
  opponent_logo: string | null;
  match_date: string;
  timezone: string;
  tournament: string;
  stage?: string | null;
  round_name?: string | null;
  match_type?: string | null;
  score_gen: number;
  score_opp: number;
  match_result: "win" | "loss" | "draw" | null;
  patch?: string | null;
  is_featured?: boolean;
  mvp: string | null;
  roster?: string[] | null;
  games?: GameResult[] | null;
  vod_url: string | null;
  match_status: "scheduled" | "finished";
  tournament_resource_id?: number | null;
  home_team_name?: string | null;
  home_team_logo?: string | null;
}

export interface MatchesResponse {
  matches: Match[];
}

export interface InviteToken {
  id: number;
  token: string;
  createdByStaffId: number;
  expiresAt: string;
  used: boolean;
  usedByUserId: number | null;
  createdAt: string;
  inviteUrl?: string;
  role: "fan" | "staff";
}

export interface InvitesResponse {
  invites: InviteToken[];
}
