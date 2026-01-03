import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenCookies, verifyAuthToken, isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        // Security Check
        const token = await getAuthTokenCookies();
        const user = token ? verifyAuthToken(token) : null;

        if (!user || !isAdmin(user)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logs = await prisma.systemLog.findMany({
            orderBy: { created_at: "desc" },
            take: 100,
            include: {
                user: {
                    select: { username: true, email: true }
                }
            }
        });

        return NextResponse.json(logs);
    } catch (e) {
        console.error("Failed to fetch logs", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
