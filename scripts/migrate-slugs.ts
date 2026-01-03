
import { PrismaClient } from "@prisma/client";
import Hashids from "hashids";

// --- INLINED UTILS ---

// HashID setup
const SALT = process.env.HASH_SALT || "gen-g-fandom-secret-salt-2024";
const PADDING = 6;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz1234567890";

const hashids = new Hashids(SALT, PADDING, ALPHABET);

function encodeId(id: number): string {
    return hashids.encode(id);
}

function generateSlugBase(home: string, opponent: string, shortName: string | undefined, tournament: string, date: string | Date): string {
    let hIdentity = "gen";
    if (home.toLowerCase().includes("ozone")) hIdentity = "sso";
    else if (home.toLowerCase().includes("white")) hIdentity = "ssw";
    else if (home.toLowerCase().includes("blue")) hIdentity = "ssb";
    else if (home.toLowerCase().includes("samsung")) hIdentity = "ssg";
    else if (home.toLowerCase().includes("ksv")) hIdentity = "ksv";

    const op = (shortName || opponent || "opp").toLowerCase().replace(/[^a-z0-9]+/g, "");
    const tSlug = (tournament || "tour").toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const dateObj = new Date(date);
    const dateStr = dateObj.toISOString().split('T')[0];

    return `${hIdentity}-vs-${op}-${tSlug}-${dateStr}`;
}

// --- MAIN SCRIPT ---

const prisma = new PrismaClient();

async function main() {
    console.log("Starting slug migration...");

    const matches = await prisma.match.findMany({
        where: {
            OR: [
                { slug: null },
                { slug: "" }
            ]
        },
        include: {
            opponent: true
        }
    });

    console.log(`Found ${matches.length} matches to update.`);

    for (const match of matches) {
        try {
            const hashId = encodeId(match.id);

            let oppShort = "";
            if (match.opponent && match.opponent.short_name) {
                oppShort = match.opponent.short_name;
            } else if (match.opponent_name) {
                oppShort = match.opponent_name.substring(0, 3);
            } else {
                oppShort = "opp";
            }

            const baseSlug = generateSlugBase(
                match.home_team_name || "Gen.G",
                match.opponent_name || "Opponent",
                oppShort,
                match.tournament || "tournament",
                match.match_date
            );

            const fullSlug = `${baseSlug}-${hashId}`;

            await prisma.match.update({
                where: { id: match.id },
                data: { slug: fullSlug } as any
            });

            console.log(`Updated Match ${match.id}: ${fullSlug}`);
        } catch (e) {
            console.error(`Failed to update Match ${match.id}:`, e);
        }
    }

    console.log("Migration complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
