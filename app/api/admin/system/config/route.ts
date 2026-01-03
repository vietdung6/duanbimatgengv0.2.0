import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromRequest, verifyAuthToken, isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        // Auth Check
        const token = getAuthTokenFromRequest(req);
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const user = verifyAuthToken(token);
        if (!isAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const configs = await prisma.systemConfig.findMany();
        // Convert array to object for easier frontend consumption
        const configMap = configs.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(configMap);
    } catch (error) {
        console.error("Fetch Config Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Auth Check
        const token = getAuthTokenFromRequest(req);
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const user = verifyAuthToken(token);
        if (!isAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await req.json();
        const { key, value } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: "Key and Value are required" }, { status: 400 });
        }

        const updated = await prisma.systemConfig.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error("Update Config Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
