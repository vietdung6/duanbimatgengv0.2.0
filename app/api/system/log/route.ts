import { NextRequest, NextResponse } from "next/server";
import { createLog } from "@/lib/logger";
import { SystemLogLevel, SystemLogType } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { level, type, message, metadata } = body;

        // Basic rate limiting or validation could go here

        // Get IP
        const ip = req.headers.get("x-forwarded-for") || (req as any).ip || "Unknown";

        await createLog(
            (level as SystemLogLevel) || SystemLogLevel.INFO,
            (type as SystemLogType) || SystemLogType.SYSTEM,
            message,
            metadata,
            undefined, // No user ID for public logs usually
            ip,
            req.nextUrl.pathname
        );

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to log" }, { status: 500 });
    }
}
