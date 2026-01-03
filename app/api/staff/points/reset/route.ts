import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken, isStaff } from "@/lib/auth";
import { resetAllPoints } from "@/lib/auth/userService";

function requireAuthorizedUser(req: NextRequest) {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  const user = verifyAuthToken(token);
  if (!isStaff(user)) return null;
  return user;
}

export async function POST(req: NextRequest) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const affectedRows = await resetAllPoints();
    return NextResponse.json(
      { success: true, affectedRows },
      { status: 200 }
    );
  } catch (err) {
    console.error("Reset points error", err);
    return NextResponse.json(
      { error: "Không thể reset điểm" },
      { status: 500 }
    );
  }
}
