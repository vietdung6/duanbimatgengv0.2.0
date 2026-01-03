import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { setup2FA } from "@/lib/auth/userService";

export async function POST(req: NextRequest) {
    try {
        const token = getAuthTokenFromRequest(req);
        if (!token) {
            return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
        }

        const user = verifyAuthToken(token);
        if (!user) {
            return NextResponse.json({ success: false, error: "INVALID_TOKEN" }, { status: 401 });
        }

        const { secret, otpauth } = await setup2FA(user.id);

        return NextResponse.json({
            success: true,
            secret,
            otpauth
        });
    } catch (err: any) {
        console.error("/api/auth/2fa/setup error:", err);
        return NextResponse.json({ success: false, error: err.message || "SERVER_ERROR" }, { status: 500 });
    }
}
