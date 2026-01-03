import { NextResponse } from "next/server";
import { listMatches } from "@/lib/data/scheduleService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allMatches = await listMatches();

    const upcomingMatches = allMatches
      .filter((m) => m.match_status === "scheduled")
      .map((m) => ({
        id: m.id.toString(),
        opponent: m.opponent_short_name || m.opponent_name,
        opponentFull: m.opponent_name,
        opponentLogo: m.opponent_logo,
        date: m.match_date, // Client will handle Date object or ISO string
        time: new Date(m.match_date).toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' }),
        timezone: m.timezone,
        tournament: m.tournament,
        venue: "LoL Park", // Default or add to DB if needed
        status: "upcoming",
        lineup: m.lineup || [],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ascending for upcoming

    const recentResults = allMatches
      .filter((m) => m.match_status === "finished")
      .map((m) => ({
        ...m,
        id: m.id.toString(),
        // Keep original names for MatchCard compatibility
      })); // Already sorted DESC by listMatches

    // Infer current tournament from the latest match (upcoming or recent)
    const latestMatch = upcomingMatches[0] || recentResults[0];
    const currentTournament = latestMatch ? (latestMatch as any).tournament : "LCK Spring 2025";

    return NextResponse.json({
      currentTournament,
      upcomingMatches,
      recentResults,
    });
  } catch (error) {
    console.error("Error reading schedule:", error);
    return NextResponse.json(
      { error: "Failed to read schedule data" },
      { status: 500 }
    );
  }
}
