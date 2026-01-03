import { NextRequest, NextResponse } from "next/server";
import { logSecurity } from "@/lib/logger";

export async function GET(req: NextRequest) {
    // 1. Security Check (Simulation of forgotten internal endpoint)
    const securityHeader = req.headers.get("X-Security-Clearance");
    const ip = req.headers.get("x-forwarded-for") || (req as any).ip || "Unknown";

    if (!securityHeader || securityHeader !== "TOP_SECRET") {
        return NextResponse.json(
            {
                error: "ACCESS_DENIED",
                code: "SEC_403",
                message: "Internal Backup. Access Restricted to DevOps Team.",
                timestamp: new Date().toISOString()
            },
            { status: 403 }
        );
    }

    // Log Successful Breach (It's a "Hacker" finding it)
    await logSecurity("CRITICAL_DATA_LEAK", { file: "users_2026.json", status: "DOWNLOADED" }, ip);

    // 2. Realistic "Backup Data"
    const backupData = [
        {
            uid: "u_system_01",
            usr: "devops_master",
            mail: "devops@geng-fandom.fun",
            hash: "$2b$12$L9...",
            role: "ROOT",
            access_level: 99,
            last_sync: "2026-06-15T12:00:00Z"
        },
        {
            uid: "u_mod_02",
            usr: "community_lead",
            mail: "community@geng-fandom.fun",
            hash: "$2b$12$P8...",
            role: "ADMIN",
            access_level: 50,
            last_sync: "2026-06-14T09:30:00Z"
        },
        {
            uid: "u_vip_88",
            usr: "ruler_vip_reserve",
            mail: "reservation.ruler@gmail.com",
            hash: null,
            role: "VIP_RESERVED",
            access_level: 10,
            status: "PENDING_CLAIM",
            note: "Account reserved for Ruler. Do not purge."
        }
    ];

    return NextResponse.json(
        {
            filename: "users_2026_full_backup.json",
            size_kb: 450,
            backup_date: new Date().toISOString(),
            integrity_check: "PASSED",
            content: backupData
        },
        { status: 200 }
    );
}
