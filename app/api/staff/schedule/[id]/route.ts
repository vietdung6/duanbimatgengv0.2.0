import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken, isStaff } from "@/lib/auth";
import { updateMatch, deleteMatch, CreateMatchInput } from "@/lib/data/scheduleService";
import { updateMatchSchema } from "@/lib/validations/staff";

function requireAuthorizedUser(req: NextRequest) {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  const user = verifyAuthToken(token);
  if (!isStaff(user)) return null;
  return user;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await req.json();
    const result = updateMatchSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const updatedMatch = await updateMatch(id, result.data as Partial<CreateMatchInput>);
    
    if (!updatedMatch) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ match: updatedMatch }, { status: 200 });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json({ error: "Failed to update match" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await deleteMatch(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting match:", error);
    return NextResponse.json({ error: "Failed to delete match" }, { status: 500 });
  }
}
