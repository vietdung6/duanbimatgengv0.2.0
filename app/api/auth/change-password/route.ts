import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { updateUserPassword, getAuthUserById, verify2FAToken } from "@/lib/auth/userService";

export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const token = getAuthTokenFromRequest(req);
        if (!token) {
            return NextResponse.json(
                { success: false, error: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        const jwtUser = verifyAuthToken(token);
        if (!jwtUser) {
            return NextResponse.json(
                { success: false, error: "INVALID_TOKEN" },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await req.json();
        const { currentPassword, newPassword, twoFactorToken } = body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, error: "MISSING_FIELDS" },
                { status: 400 }
            );
        }

        // Get fresh user data from DB to check 2FA status (not from JWT which may be stale)
        const user = await getAuthUserById(jwtUser.id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "USER_NOT_FOUND" },
                { status: 404 }
            );
        }

        // Check 2FA if enabled (using fresh DB data)
        if (user.twoFactorEnabled) {
            if (!twoFactorToken) {
                return NextResponse.json(
                    { success: false, error: "TWO_FACTOR_REQUIRED" },
                    { status: 400 }
                );
            }

            const isValid2FA = await verify2FAToken(user.id, twoFactorToken);
            if (!isValid2FA) {
                return NextResponse.json(
                    { success: false, error: "INVALID_2FA_TOKEN" },
                    { status: 400 }
                );
            }
        }


        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, error: "PASSWORD_TOO_SHORT" },
                { status: 400 }
            );
        }

        // Update password
        const result = await updateUserPassword(
            user.id,
            currentPassword,
            newPassword
        );

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Mật khẩu đã được thay đổi thành công" },
            { status: 200 }
        );
    } catch (err) {
        console.error("/api/auth/change-password error:", err);
        return NextResponse.json(
            { success: false, error: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
