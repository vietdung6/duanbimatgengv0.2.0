import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { getAuthUserById } from "@/lib/auth/userService";

export async function GET(req: NextRequest) {
  try {
    const token = getAuthTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = verifyAuthToken(token);
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Optionally refresh from DB in case role/email changed
    const user = await getAuthUserById(decoded.id);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("/api/auth/me error", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
