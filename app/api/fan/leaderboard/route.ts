import { NextResponse } from "next/server";

import { listUsers } from "@/lib/auth/userService";

export async function GET() {
  try {
    const users = await listUsers();

    const top = users
      .filter((u) => typeof u.points === "number" && u.points > 0)
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
      .slice(0, 5);

    return NextResponse.json({ users: top }, { status: 200 });
  } catch (err) {
    console.error("Leaderboard error", err);
    return NextResponse.json({ users: [] }, { status: 500 });
  }
}

