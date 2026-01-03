import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromRequest, verifyAuthToken, isStaff } from "@/lib/auth";
import { encodeId } from "@/lib/utils/hashid";
import { generateMatchSlug } from "@/app/utils/slugHelper";
import { validateMatchBody, fetchOpponentAndTournament, mapGamesData } from "./helpers";

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
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    try {
      await validateMatchBody(body);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const {
      date, time, tournamentId, tournament, stage, round_name, matchType, patch,
      homeTeamIdentity, homeTeamLogo, opponentId, games, squad, opponentShortName
    } = body;

    const { opponent, tournamentName } = await fetchOpponentAndTournament(opponentId, tournamentId, tournament);
    const { gamesData, scoreGen, scoreOpp } = mapGamesData(games);

    const matchResult = scoreGen > scoreOpp ? 'win' : 'loss';
    const matchDateTime = new Date(`${date}T${time || "00:00"}:00`);

    const newMatch = await prisma.match.create({
      data: {
        match_date: matchDateTime,
        opponent_id: Number(opponentId),
        opponent_name: opponent.name,
        opponent_logo: opponent.logo_url,
        home_team_name: homeTeamIdentity || "Gen.G",
        home_team_logo: homeTeamLogo || null,
        tournament: tournamentName,
        tournament_resource_id: tournamentId ? Number(tournamentId) : null,
        stage, round_name, match_type: matchType || "BO3", patch: patch || null,
        match_status: "finished",
        score_gen: scoreGen, score_opp: scoreOpp, match_result: matchResult,
        lineup: squad ? JSON.stringify(squad) : null,
        games: { create: gamesData }
      },
      include: { games: true }
    });

    const hashId = encodeId(newMatch.id);
    const tournamentSlugPart = (body.tournamentSlug || tournamentName.toLowerCase().replace(/[^a-z0-9]+/g, "-"));

    const slugBase = generateMatchSlug(
      homeTeamIdentity || "Gen.G",
      opponent.name,
      opponentShortName,
      tournamentSlugPart,
      date
    );
    const fullSlug = `${slugBase}-${hashId}`;

    const updatedMatch = await prisma.match.update({
      where: { id: newMatch.id },
      data: { slug: fullSlug },
      include: { games: true }
    });

    return NextResponse.json(updatedMatch);

  } catch (error: any) {
    console.error("Create Match Error:", error);
    return NextResponse.json({ error: "Failed to create match", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "Match ID is required" }, { status: 400 });

    const {
      id, date, time, tournamentId, tournament, stage, round_name, matchType, patch,
      homeTeamIdentity, homeTeamLogo, opponentId, games, squad, opponentShortName
    } = body;

    const { opponent, tournamentName } = await fetchOpponentAndTournament(opponentId, tournamentId, tournament);
    const { gamesData, scoreGen, scoreOpp } = mapGamesData(games);

    const matchResult = scoreGen > scoreOpp ? 'win' : 'loss';
    const matchDateTime = new Date(`${date}T${time || "00:00"}:00`);

    const updatedMatch = await prisma.$transaction(async (tx) => {
      await tx.game.deleteMany({ where: { match_id: Number(id) } });

      const hashId = encodeId(Number(id));
      const tournamentSlugPart = (body.tournamentSlug || tournamentName.toLowerCase().replace(/[^a-z0-9]+/g, "-"));

      const slugBase = generateMatchSlug(
        homeTeamIdentity || "Gen.G",
        opponent.name,
        opponentShortName,
        tournamentSlugPart,
        date
      );
      const fullSlug = `${slugBase}-${hashId}`;

      return await tx.match.update({
        where: { id: Number(id) },
        data: {
          match_date: matchDateTime,
          opponent_id: Number(opponentId),
          opponent_name: opponent.name,
          opponent_logo: opponent.logo_url,
          home_team_name: homeTeamIdentity || "Gen.G",
          home_team_logo: homeTeamLogo || null,
          tournament: tournamentName,
          tournament_resource_id: tournamentId ? Number(tournamentId) : null,
          stage, round_name, match_type: matchType || "BO3", patch: patch || null,
          score_gen: scoreGen, score_opp: scoreOpp, match_result: matchResult,
          lineup: squad ? JSON.stringify(squad) : null,
          slug: fullSlug,
          games: { create: gamesData }
        },
        include: { games: true }
      });
    });

    return NextResponse.json(updatedMatch);

  } catch (error: any) {
    console.error("Update Match Error:", error);
    return NextResponse.json({ error: "Failed to update match", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }

    await prisma.match.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Match deleted successfully" });

  } catch (error: any) {
    console.error("Delete Match Error:", error);
    return NextResponse.json({ error: "Failed to delete match", details: error.message }, { status: 500 });
  }
}
