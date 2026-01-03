import { prisma } from "@/lib/prisma";
import { MatchStatus, MatchResult, Match, Game } from "@prisma/client";

// Local type definition for npm (matches Prisma schema)
interface GamePlayerStatType {
  id: number;
  ganme_id: number;
  player_name: string | null;
  role: string;
  team: string;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  summoner1: string | null;
  summoner2: string | null;
  damage_dealt: number | null;
  damage_taken: number | null;
}

export interface LineupPlayer {
  role: string;
  player: string;
  note?: string;
}

// Player stats for each game
export interface PlayerStatRow {
  id: number;
  player_name: string | null;
  role: string;
  team: string;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  summoner1: string | null;
  summoner2: string | null;
  damage_dealt: number | null;
  damage_taken: number | null;
}

export interface MatchRow {
  id: number;
  home_team_name?: string | null;
  home_team_logo?: string | null;
  opponent_id: number | null;
  opponent_name: string;
  opponent_short_name: string | null;
  opponent_logo: string | null;
  match_date: Date;
  timezone: string;
  tournament: string;
  tournament_logo?: string | null;
  match_status: "scheduled" | "finished";
  score_gen: number;
  score_opp: number;
  match_result: "win" | "loss" | "draw" | null;
  stage: string | null;
  round_name: string | null;
  match_type: string | null;
  is_featured: boolean;
  mvp: string | null;
  vod_url: string | null;
  tournament_resource_id: number | null;
  patch: string | null;
  lineup: LineupPlayer[] | null;
  roster: string[] | null;
  slug: string | null; // Added slug field
  games: {
    id?: number;
    game_number?: number;
    result: string;
    side: "blue" | "red";
    duration?: string | null;
    vod_url?: string | null;
    patch?: string | null;
    player_stats?: PlayerStatRow[];
  }[] | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMatchInput {
  opponent_id?: number;
  opponent_name?: string;
  opponent_short_name?: string;
  opponent_logo?: string;
  match_date: string | Date; // ISO string or Date object
  timezone?: string;
  tournament: string;
  match_status: "scheduled" | "finished";
  score_gen?: number;
  score_opp?: number;
  match_result?: "win" | "loss" | "draw" | "" | null;
  patch?: string | null;
  stage?: string;
  round_name?: string;
  match_type?: string;
  is_featured?: boolean;
  mvp?: string;
  vod_url?: string;
  lineup?: LineupPlayer[];
  roster?: string[];
  games?: { result: "win" | "loss"; side: "blue" | "red"; patch?: string }[];
}

type MatchWithGames = Match & {
  games: (Game & { player_stats?: GamePlayerStatType[] })[];
  opponent?: { id: number; name: string; short_name: string | null; logo_url: string | null } | null;
  tournament_resource?: { id: number; name: string; type?: { logo: string | null } | null } | null;
};

function mapPrismaToMatchRow(row: MatchWithGames): MatchRow {
  return {
    id: row.id,
    home_team_name: row.home_team_name,
    home_team_logo: row.home_team_logo,
    opponent_id: row.opponent_id,
    opponent_name: row.opponent?.name || row.opponent_name || "",
    opponent_short_name: row.opponent?.short_name || row.opponent_short_name || null,
    opponent_logo: row.opponent?.logo_url || row.opponent_logo || null,
    match_date: row.match_date,
    timezone: row.timezone || "KST",
    tournament: row.tournament,
    tournament_logo: row.tournament_resource?.type?.logo || null,
    match_status: row.match_status as "scheduled" | "finished",
    score_gen: row.score_gen ?? 0,
    score_opp: row.score_opp ?? 0,
    match_result: row.match_result as "win" | "loss" | "draw" | null,
    stage: row.stage,
    round_name: row.round_name,
    match_type: row.match_type,
    is_featured: row.is_featured,
    mvp: row.mvp,
    vod_url: row.vod_url,
    tournament_resource_id: row.tournament_resource_id,
    patch: row.patch,
    lineup: row.lineup ? (typeof row.lineup === 'string' ? JSON.parse(row.lineup) : row.lineup) : null,
    roster: (row as any).roster ? (typeof (row as any).roster === 'string' ? JSON.parse((row as any).roster) : (row as any).roster) : null,
    slug: row.slug || null, // Map slug
    games: row.games ? row.games.map((g) => ({
      id: g.id,
      game_number: g.game_number,
      result: g.result || "",
      side: (g.side?.toLowerCase() as "blue" | "red") || "blue",
      duration: g.duration || null,
      vod_url: g.vod_url || null,
      patch: g.patch || null,
      player_stats: g.player_stats?.map(ps => ({
        id: ps.id,
        player_name: ps.player_name,
        role: ps.role,
        team: ps.team,
        champion: ps.champion,
        kills: ps.kills,
        deaths: ps.deaths,
        assists: ps.assists,
        cs: ps.cs,
        gold: ps.gold,
        summoner1: ps.summoner1,
        summoner2: ps.summoner2,
        damage_dealt: ps.damage_dealt,
        damage_taken: ps.damage_taken,
      })) || [],
    })) : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listMatches() {
  const matches = await prisma.match.findMany({
    orderBy: { match_date: "desc" },
    include: {
      games: true,
      opponent: {
        select: {
          id: true,
          name: true,
          short_name: true,
          logo_url: true,
        }
      },
      tournament_resource: {
        select: {
          id: true,
          name: true,
          type: {
            select: {
              logo: true
            }
          }
        }
      }
    }
  });
  return matches.map(mapPrismaToMatchRow);
}

export async function getMatchById(id: number) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      games: {
        include: {
          player_stats: true  // Include detailed player stats
        } as any,
        orderBy: { game_number: 'asc' }
      },
      opponent: {
        select: {
          id: true,
          name: true,
          short_name: true,
          logo_url: true,
        }
      }
    }
  });
  return match ? mapPrismaToMatchRow(match as any) : null;
}

export async function createMatch(input: CreateMatchInput) {
  const {
    opponent_id,
    opponent_name,
    opponent_logo = null,
    match_date,
    timezone = "KST",
    tournament,
    match_status,
    score_gen = 0,
    score_opp = 0,
    match_result = null,
    patch = null,
    stage = null,
    round_name = null,
    match_type = "BO3",
    is_featured = false,
    mvp = null,
    vod_url = null,
    lineup = null,
    roster = null,
    games = null,
  } = input;


  const match = await prisma.match.create({
    data: {
      // Use opponent_id relation if available, otherwise fallback to direct fields
      ...(opponent_id ? { opponent_id } : {
        opponent_name: opponent_name || "",
        opponent_logo
      }),
      match_date: new Date(match_date),
      timezone,
      tournament,
      match_status: match_status as MatchStatus,
      score_gen,
      score_opp,
      match_result: match_result ? (match_result as MatchResult) : null,
      stage,
      round_name,
      match_type,
      is_featured,
      mvp,
      vod_url,
      patch,
      lineup: roster ? JSON.stringify(roster) : (lineup ? JSON.stringify(lineup) : null),
      ...(games
        ? {
          games: {
            create: games.map((g, i) => ({
              game_number: i + 1,
              result: g.result,
              side: g.side,
              patch: g.patch || null,
            })),
          },
        }
        : {}),
    },
    include: {
      games: true,
      opponent: {
        select: {
          id: true,
          name: true,
          short_name: true,
          logo_url: true,
        }
      }
    }
  });

  return mapPrismaToMatchRow(match as any);
}

export async function updateMatch(id: number, input: Partial<CreateMatchInput>) {
  const data: any = {};

  if (input.opponent_id !== undefined) data.opponent_id = input.opponent_id;
  if (input.opponent_name !== undefined) data.opponent_name = input.opponent_name;
  if (input.opponent_logo !== undefined) data.opponent_logo = input.opponent_logo;
  if (input.match_date !== undefined) data.match_date = new Date(input.match_date);
  if (input.timezone !== undefined) data.timezone = input.timezone;
  if (input.tournament !== undefined) data.tournament = input.tournament;
  if (input.match_status !== undefined) data.match_status = input.match_status as MatchStatus;
  if (input.score_gen !== undefined) data.score_gen = input.score_gen;
  if (input.score_opp !== undefined) data.score_opp = input.score_opp;
  if (input.match_result !== undefined) {
    data.match_result = input.match_result ? (input.match_result as MatchResult) : null;
  }
  if (input.stage !== undefined) data.stage = input.stage;
  if (input.round_name !== undefined) data.round_name = input.round_name;
  if (input.match_type !== undefined) data.match_type = input.match_type;
  if (input.is_featured !== undefined) data.is_featured = input.is_featured;
  if (input.mvp !== undefined) data.mvp = input.mvp;
  if (input.vod_url !== undefined) data.vod_url = input.vod_url;
  if (input.patch !== undefined) data.patch = input.patch;
  if (input.roster !== undefined) {
    data.lineup = input.roster ? JSON.stringify(input.roster) : null;
  } else if (input.lineup !== undefined) {
    data.lineup = input.lineup ? JSON.stringify(input.lineup) : null;
  }

  if (input.games !== undefined) {
    // For updates, we'll replace all games for simplicity
    data.games = {
      deleteMany: {},
      create: input.games?.map((g, i) => ({
        game_number: i + 1,
        result: g.result,
        side: g.side,
        patch: g.patch || null,
      }))
    };
  }

  if (Object.keys(data).length === 0) return null;

  const updatedMatch = await prisma.match.update({
    where: { id },
    data,
    include: {
      games: true,
    }
  });

  return mapPrismaToMatchRow(updatedMatch);
}

export async function deleteMatch(id: number) {
  await prisma.match.delete({
    where: { id },
  });
  return true;
}
