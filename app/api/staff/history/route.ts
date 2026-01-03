import { NextRequest, NextResponse } from "next/server";

import { getAuthTokenFromRequest, verifyAuthToken, isStaff } from "@/lib/auth";
import { updateUserPoints } from "@/lib/auth/userService";
import { logUserActivity } from "@/lib/history/historyService";

function requireAuthorizedUser(req: NextRequest) {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  const user = verifyAuthToken(token);
  if (!isStaff(user)) return null;
  return user;
}

import { createHistorySchema } from "@/lib/validations/staff";

export async function POST(req: NextRequest) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = createHistorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { userId, type, title, description, pointsChange } = result.data;

    // If there is a point change, we use updateUserPoints to ensure consistency
    if (pointsChange !== 0) {
      await updateUserPoints(
        userId,
        pointsChange,
        description,
        type === "admin" ? "admin" : "system",
        title
      );
    } else {
      // Just log activity
      await logUserActivity(
        userId,
        type as "point" | "admin" | "notification",
        title,
        description,
        0
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Create history error", err);
    return NextResponse.json(
      { error: "Không thể tạo lịch sử hoạt động" },
      { status: 500 }
    );
  }
}
