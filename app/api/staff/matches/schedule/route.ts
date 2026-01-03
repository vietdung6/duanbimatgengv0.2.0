import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromRequest, verifyAuthToken, isStaff } from "@/lib/auth";

async function checkAuth(req: NextRequest) {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  const user = verifyAuthToken(token);
  if (!isStaff(user)) return null;
  return user;
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      date,
      time,
      tournamentId,
      stage,
      matchType,
      patch,
      homeTeamIdentity,
      opponentId,
      squad,
      round_name
    } = body;

    // 1. Basic Validation
    if (!date || !opponentId) {
      return NextResponse.json({ error: "Missing required fields (date, opponent)" }, { status: 400 });
    }

    // 2. Fetch Opponent Info
    const opponent = await prisma.teamResource.findUnique({
      where: { id: Number(opponentId) }
    });

    if (!opponent) {
      return NextResponse.json({ error: "Opponent not found" }, { status: 404 });
    }

    // 3. Fetch Tournament Info (Optional)
    let tournamentName = "Unknown Tournament";
    if (tournamentId) {
      const tourney = await prisma.tournamentResource.findUnique({
        where: { id: Number(tournamentId) }
      });
      if (tourney) tournamentName = tourney.name;
    }

    // 4. Create Match (Scheduled)
    const matchDateTime = new Date(`${date}T${time || "00:00"}:00`);

    const newMatch = await prisma.match.create({
      data: {
        match_date: matchDateTime,
        opponent_name: opponent.name,
        opponent_logo: opponent.logo_url,
        home_team_name: homeTeamIdentity || "Gen.G",
        tournament: tournamentName,
        tournament_resource_id: tournamentId ? Number(tournamentId) : null,
        stage: stage,
        round_name: round_name,
        match_type: matchType || "BO3",
        patch: patch || null,
        match_status: "scheduled",
        score_gen: 0,
        score_opp: 0,
        match_result: null,
        lineup: squad ? JSON.stringify(squad) : null,
        // No games created for scheduled match
      }
    });

    return NextResponse.json(newMatch);
  } catch (error: any) {
    console.error("Create Scheduled Match Error:", error);
    return NextResponse.json({
      error: "Failed to create scheduled match",
      details: error.message
    }, { status: 500 });
  }
}
