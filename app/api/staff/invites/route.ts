import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken, isStaff, isAdmin } from "@/lib/auth";
import {
  createInviteToken,
  listInviteTokens,
  deleteInviteToken,
  getInviteTokenById,
} from "@/lib/auth/inviteService";

function requireAuthorizedUser(req: NextRequest) {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  const user = verifyAuthToken(token);
  if (!isStaff(user)) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const invites = await listInviteTokens();

  // If not admin, hide staff invites
  if (!isAdmin(requester)) {
    const filteredInvites = invites.filter(i => i.role !== 'staff');
    return NextResponse.json({ invites: filteredInvites }, { status: 200 });
  }

  return NextResponse.json({ invites }, { status: 200 });
}

import { createInviteSchema } from "@/lib/validations/staff";

export async function POST(req: NextRequest) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const result = createInviteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const { role, expiresAt } = result.data;

  // Security: Only Admin can create staff invites
  if (role === "staff" && !isAdmin(requester)) {
     return NextResponse.json({ error: "Bạn không đủ quyền" }, { status: 403 });
  }

  const expiresInHours = expiresAt 
    ? Math.max(1, Math.round((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))) 
    : 24;

  const invite = await createInviteToken(
    requester.id,
    role as "fan" | "staff",
    expiresInHours
  );

  return NextResponse.json({ code: invite.token, invite }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const inviteId = parseInt(id);
  const invite = await getInviteTokenById(inviteId);

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  // Security: Only Admin can delete staff invites
  if (invite.role === "staff" && !isAdmin(requester)) {
    return NextResponse.json({ error: "Bạn không đủ quyền" }, { status: 403 });
  }

  await deleteInviteToken(inviteId);
  return NextResponse.json({ success: true }, { status: 200 });
}
