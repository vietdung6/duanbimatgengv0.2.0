import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken, signAuthToken, setAuthCookie } from "@/lib/auth";
import { updateUserDisplayName, getAuthUserById } from "@/lib/auth/userService";

export async function POST(req: NextRequest) {
    try {
        const token = getAuthTokenFromRequest(req);
        if (!token) {
            return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
        }

        const jwtUser = verifyAuthToken(token);
        if (!jwtUser) {
            return NextResponse.json({ success: false, error: "INVALID_TOKEN" }, { status: 401 });
        }

        const { displayName } = await req.json();

        if (!displayName || displayName.trim().length < 2) {
            return NextResponse.json({ success: false, error: "INVALID_DISPLAY_NAME" }, { status: 400 });
        }

        if (displayName.length > 50) {
            return NextResponse.json({ success: false, error: "DISPLAY_NAME_TOO_LONG" }, { status: 400 });
        }

        // Check cooldown (72 hours)
        const currentUserData = await getAuthUserById(jwtUser.id);
        if (currentUserData?.lastDisplayNameChange) {
            const lastChange = new Date(currentUserData.lastDisplayNameChange);
            const now = new Date();
            const diffHours = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60);

            if (diffHours < 72) {
                const remainingHours = Math.ceil(72 - diffHours);
                return NextResponse.json({
                    success: false,
                    error: "COOLDOWN_ACTIVE",
                    message: `Bạn chỉ có thể đổi tên sau ${remainingHours} giờ nữa.`
                }, { status: 400 });
            }
        }

        await updateUserDisplayName(jwtUser.id, displayName.trim());

        // Refresh token to include new displayName
        const updatedUser = await getAuthUserById(jwtUser.id);
        if (updatedUser) {
            const newToken = signAuthToken(updatedUser);
            const response = NextResponse.json({
                success: true,
                message: "Cập nhật tên hiển thị thành công",
                user: updatedUser
            });
            setAuthCookie(response, newToken);
            return response;
        }

        return NextResponse.json({ success: true, message: "Cập nhật tên hiển thị thành công" });
    } catch (err: any) {
        console.error("/api/auth/profile/update error:", err);
        return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
    }
}
