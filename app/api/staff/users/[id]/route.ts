import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken, isStaff, isStrictStaff } from "@/lib/auth";
import { deleteUserById, getAuthUserById } from "@/lib/auth/userService";

function requireAuthorizedUser(req: NextRequest) {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  const user = verifyAuthToken(token);
  if (!isStaff(user)) return null;
  return user;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  // Security check: Staff cannot delete admin or other staff
  if (isStrictStaff(requester)) {
    const targetUser = await getAuthUserById(id);
    if (targetUser && targetUser.role !== "fan") {
      return NextResponse.json({ error: "Forbidden: Staff can only delete fans" }, { status: 403 });
    }
  }

  const success = await deleteUserById(id);
  if (!success) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

