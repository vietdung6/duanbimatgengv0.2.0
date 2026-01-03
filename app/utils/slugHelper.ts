import { getHomeTeamIdentity } from "@/lib/utils/teamIdentity";

export function generateMatchSlug(
    homeIdentity: string,
    opponentName: string,
    opponentShortName: string | undefined, // New param
    tournamentSlug: string,
    date: string
): string {
    // 1. Home Identity Mapping
    let homeIden = "gen";
    const identityLower = homeIdentity.toLowerCase();

    if (identityLower.includes("ozone")) homeIden = "sso";
    else if (identityLower.includes("white")) homeIden = "ssw";
    else if (identityLower.includes("blue")) homeIden = "ssb";
    else if (identityLower.includes("galaxy")) homeIden = "ssg";
    else if (identityLower.includes("ksv")) homeIden = "ksv";

    // 2. Opponent (3 chars)
    let opp = "";
    if (opponentShortName && opponentShortName.length > 0) {
        opp = opponentShortName.toLowerCase();
    } else {
        // Take first 3 chars of name if no shortname
        opp = opponentName.substring(0, 3).toLowerCase();
    }
    // Remove special chars just in case
    opp = opp.replace(/[^a-z0-9]/g, "");

    // 3. Tournament
    // Ensure tournament slug is clean
    const tour = tournamentSlug.toLowerCase()
        .replace(/[^a-z0-9-]/g, "-") // Replace special chars with hyphen
        .replace(/-+/g, "-")         // Collapse multiple hyphens
        .replace(/^-|-$/g, "");      // Trim hyphens

    // 4. Date is already YYYY-MM-DD usually, assuming input is valid or needs simple formatting
    // If input is full ISO string, take the date part
    const datePart = date.split("T")[0];

    return `${homeIden}-vs-${opp}-${tour}-${datePart}`;
}

import { encodeId } from "@/lib/utils/hashid";

export function getNestedMatchUrl(match: {
    id: number;
    home_team_name?: string | null;
    opponent_name?: string | null;
    opponent_short_name?: string | null;
    tournament?: string;
    tournament_slug?: string; // Optional if stored
    match_date: string | Date;
    slug?: string | null;
}): string {
    // If we have a custom slug that does NOT look auto-generated (flat), use it? 
    // Actually, user wants nested format for ALL matches.
    // So we should reconstruct it.

    // 1. Get Matchup Segment
    const dateObj = new Date(match.match_date);
    // Use helper to get identity code (gen, ssv, etc)
    const { identity } = getHomeTeamIdentity(dateObj.toISOString());

    // Opponent short name logic
    let opp = "";
    if (match.opponent_short_name) {
        opp = match.opponent_short_name.toLowerCase();
    } else if (match.opponent_name) {
        opp = match.opponent_name.substring(0, 3).toLowerCase();
    } else {
        opp = "unk";
    }
    opp = opp.replace(/[^a-z0-9]/g, "");

    const matchup = `${identity}-vs-${opp}`;

    // 2. Tournament Segment
    // If we don't have tournament_slug stored, we slugify the name
    let tour = "unknown-tournament";
    if (match.tournament) {
        tour = match.tournament.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    // 3. Date Segment
    const datePart = dateObj.toISOString().split("T")[0];

    // 4. HashID
    const hashId = encodeId(match.id);

    // 5. Try to extract Tournament Slug from stored match.slug if available
    // Format: {homeIden}-vs-{opp}-{tour}-{YYYY}-{MM}-{DD}-{hash}
    // We want {tour}.
    // We assume {homeIden} and {opp} do NOT contain hyphens (guaranteed by generateMatchSlug).
    // Date is YYYY-MM-DD (3 parts).
    // Hash is 1 part.
    if (match.slug) {
        const parts = match.slug.split('-');
        // Min length: home(1) + vs(1) + opp(1) + tour(1) + date(3) + hash(1) = 8
        if (parts.length >= 8 && parts[1] === 'vs') {
            // Extract tour parts: from index 3 to (length - 4)
            const tourParts = parts.slice(3, -4);
            if (tourParts.length > 0) {
                tour = tourParts.join('-');
            }
        }
    }

    return `/match/${matchup}/${tour}/${datePart}/${hashId}`;
}
