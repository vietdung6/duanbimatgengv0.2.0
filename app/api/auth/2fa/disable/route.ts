import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken, signAuthToken, setAuthCookie } from "@/lib/auth";
import { disable2FA, getAuthUserById } from "@/lib/auth/userService";

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

        const { code } = await req.json();
        if (!code) {
            return NextResponse.json({ success: false, error: "MISSING_CODE" }, { status: 400 });
        }

        const result = await disable2FA(user.id, code);
        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        // Refresh token to include twoFactorEnabled: false
        const updatedUser = await getAuthUserById(user.id);
        if (updatedUser) {
            const newToken = signAuthToken(updatedUser);
            const response = NextResponse.json({
                success: true,
                message: "Đã tắt bảo mật 2 lớp",
                user: updatedUser
            });
            setAuthCookie(response, newToken);
            return response;
        }

        return NextResponse.json({ success: true, message: "Đã tắt bảo mật 2 lớp" });
    } catch (err: any) {
        console.error("/api/auth/2fa/disable error:", err);
        return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
    }
}
