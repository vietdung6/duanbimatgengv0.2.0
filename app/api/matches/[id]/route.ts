import { NextRequest, NextResponse } from "next/server";
import { getMatchById } from "@/lib/data/scheduleService";
import { decodeId } from "@/lib/utils/hashid";
import { prisma } from "@/lib/prisma"; // Direct prisma access for slug lookup

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: identifier } = await params;

    let match = null;

    // 1. Try as numeric ID
    const numericId = parseInt(identifier);
    if (!isNaN(numericId)) {
      match = await getMatchById(numericId);
    }

    // 2. Try as exact Slug
    if (!match) {
      // Need to use prisma directly or add getMatchBySlug to service. 
      // For now, let's use prisma directly to keep it simple or expand service later.
      // Actually scheduleService maps data, so better reuse it if possible. 
      // But getMatchById uses ID.
      // Let's first try to resolve the ID from the credential.

      const matchBySlug = await prisma.match.findUnique({
        where: { slug: identifier },
        include: { games: { include: { player_stats: true } } } // Mimic getMatchById include
      });

      if (matchBySlug) {
        // We need to map it using the same service logic if we want consistent return shape
        // Or we just verify we found it and retrieve by ID to reuse the service logic
        match = await getMatchById(matchBySlug.id);
      }
    }

    // 3. Try as HashID (or Slug ending in HashID)
    if (!match) {
      const parts = identifier.split('-');
      const potentialHash = parts[parts.length - 1]; // Can be undefined in strict mode

      if (potentialHash) {
        const decodedId = decodeId(potentialHash);
        if (decodedId) {
          match = await getMatchById(decodedId);
        }
      }
    }

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error fetching match details:", error);
    return NextResponse.json(
      { error: "Failed to fetch match details" },
      { status: 500 }
    );
  }
}
