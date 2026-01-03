import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest, verifyAuthToken, isStaff } from "@/lib/auth";
import { createMatchSchema } from "@/lib/validations/staff";
import { createMatch, listMatches, CreateMatchInput } from "@/lib/data/scheduleService";

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

  try {
    const matches = await listMatches();
    return NextResponse.json({ matches }, { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = createMatchSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const newMatch = await createMatch(result.data as CreateMatchInput);
    return NextResponse.json({ match: newMatch }, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
  }
}
