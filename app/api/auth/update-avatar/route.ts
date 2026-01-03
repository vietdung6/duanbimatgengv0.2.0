import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { updateUserAvatar } from "@/lib/auth/userService";

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

        const user = verifyAuthToken(token);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "INVALID_TOKEN" },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await req.json();
        const { avatarUrl } = body;

        // Update avatar
        await updateUserAvatar(
            user.id,
            avatarUrl && avatarUrl.trim() !== "" ? avatarUrl.trim() : null
        );

        return NextResponse.json(
            { success: true, message: "Avatar đã được cập nhật" },
            { status: 200 }
        );
    } catch (err) {
        console.error("/api/auth/update-avatar error:", err);
        return NextResponse.json(
            { success: false, error: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
