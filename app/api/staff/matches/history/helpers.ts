import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Define input types based on what the API expects
interface PlayerStatInput {
    player_name?: string | null;
    role: string;
    team: string;
    champion: string;
    kills?: number;
    deaths?: number;
    assists?: number;
    cs?: number;
    gold?: number;
    summoner1?: string | null;
    summoner2?: string | null;
    damage_dealt?: number;
    damage_taken?: number;
}

interface GameInput {
    result: string;
    side: "blue" | "red";
    duration?: string;
    vodUrl?: string;
    playerStats?: PlayerStatInput[];
}

interface MatchBody {
    id?: number;
    date: string;
    time?: string;
    tournamentId?: number | string | null;
    tournament?: string;
    stage?: string;
    round_name?: string;
    matchType?: string;
    patch?: string;
    homeTeamIdentity?: string;
    homeTeamLogo?: string;
    opponentId: number | string;
    opponentShortName?: string;
    games?: GameInput[];
    squad?: any;
    tournamentSlug?: string;
}

export async function validateMatchBody(body: MatchBody) {
    const { date, opponentId } = body;
    if (!date || !opponentId) {
        throw new Error("Missing required fields (date, opponent)");
    }
}

export async function fetchOpponentAndTournament(opponentId: number | string, tournamentId: number | string | null | undefined, tournamentNameFromBody: string | undefined) {
    const opponent = await prisma.teamResource.findUnique({
        where: { id: Number(opponentId) }
    });

    if (!opponent) {
        throw new Error("Opponent not found");
    }

    let tournamentName = tournamentNameFromBody || "Unknown Tournament";
    if (tournamentId) {
        const tourney = await prisma.tournamentResource.findUnique({
            where: { id: Number(tournamentId) }
        });
        if (tourney) tournamentName = tourney.name;
    }

    return { opponent, tournamentName };
}

export function mapGamesData(games: GameInput[] | undefined) {
    let scoreGen = 0;
    let scoreOpp = 0;

    // Use Prisma.GameCreateWithoutMatchInput as the base for the return type items 
    // to match what Prisma expects, but we need to account for dynamic creation array.

    const gamesData = (games || []).map((g, index) => {
        if (g.result === 'win') scoreGen++;
        else if (g.result === 'loss') scoreOpp++;

        const gameCreateInput: Prisma.GameCreateWithoutMatchInput = {
            game_number: index + 1,
            result: g.result,
            side: g.side,
            duration: g.duration || null,
            vod_url: g.vodUrl || null,
        };

        if (g.playerStats && g.playerStats.length > 0) {
            gameCreateInput.player_stats = {
                create: g.playerStats
                    .filter((ps) => ps.champion)
                    .map((ps) => ({
                        player_name: ps.player_name || null,
                        role: ps.role,
                        team: ps.team,
                        champion: ps.champion,
                        kills: ps.kills || 0,
                        deaths: ps.deaths || 0,
                        assists: ps.assists || 0,
                        cs: ps.cs || 0,
                        gold: ps.gold || 0,
                        summoner1: ps.summoner1 || null,
                        summoner2: ps.summoner2 || null,
                        damage_dealt: ps.damage_dealt || 0,
                        damage_taken: ps.damage_taken || 0,
                    }))
            };
        }

        return gameCreateInput;
    });

    return { gamesData, scoreGen, scoreOpp };
}
