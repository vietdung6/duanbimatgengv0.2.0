import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // 1. Security Check
    const securityHeader = req.headers.get("X-Security-Clearance");

    if (!securityHeader || securityHeader !== "TOP_SECRET") {
        return NextResponse.json(
            {
                error: "ACCESS_DENIED",
                code: "SEC_401",
                message: "Insufficient clearance level.",
                timestamp: new Date().toISOString()
            },
            { status: 401 }
        );
    }

    // 2. Realistic "User Leak" Data (Standard DB Dump format)
    const leakedUsers = [
        {
            id: 1,
            username: "admin",
            email: "admin@geng-fandom.com",
            password_hash: "$2b$10$X7.G1...[HIDDEN]",
            role: "ADMIN",
            created_at: "2024-01-01T00:00:00Z",
            last_login: "2026-06-15T10:30:00Z"
        },
        {
            id: 2,
            username: "mod_soyeon",
            email: "soyeon.lee@gmail.com",
            password_hash: "$2b$10$9kL2...",
            role: "MODERATOR",
            created_at: "2024-02-14T12:00:00Z",
            last_login: "2026-06-14T22:15:00Z"
        },
        {
            id: 105,
            username: "fan_boy_99",
            email: "minh.tuan99@yahoo.com",
            password_hash: "$2b$10$aP5...",
            role: "FAN",
            created_at: "2025-11-20T08:45:00Z",
            last_login: "2026-06-15T09:00:00Z"
        },
        {
            id: 8888,
            username: "vip_ruler_fan",
            email: "ruler.fanclub.vn@gmail.com",
            password_hash: "$2b$10$Z3...",
            role: "VIP_MEMBER",
            created_at: "2026-01-05T15:30:00Z",
            last_login: "2026-06-01T11:20:00Z"
        }
    ];

    return NextResponse.json(
        {
            data: leakedUsers,
            meta: {
                total: 4209,
                page: 1,
                per_page: 4,
                source: "users_primary_db"
            }
        },
        { status: 200 }
    );
}
