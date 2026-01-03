import { NextRequest, NextResponse } from "next/server";

import { getAuthTokenFromRequest, verifyAuthToken, isStaff, isStrictStaff } from "@/lib/auth";
import {
  listUsers,
  createUser,
  type CreateUserInput,
} from "@/lib/auth/userService";

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

  let users = await listUsers();

  // Filter users based on role
  if (isStrictStaff(requester)) {
    // Staff can only see "fan" users
    users = users.filter((u) => u.role === "fan");
  }
  // Admin sees all users (fan, staff, admin)

  return NextResponse.json({ users }, { status: 200 });
}

import { createUserSchema } from "@/lib/validations/staff";

export async function POST(req: NextRequest) {
  const requester = requireAuthorizedUser(req);
  if (!requester) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const { email, username, password, role, displayName, proof, points } = result.data;

  try {
    const created = await createUser({
      email,
      username: username ?? null,
      password,
      displayName: displayName ?? null,
      proof: proof ?? null,
      points: points ?? 0,
      role: role as "fan" | "staff" | "admin",
    });
    return NextResponse.json({ user: created }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_OR_USERNAME_EXISTS") {
      return NextResponse.json(
        { error: "Email hoặc username đã tồn tại" },
        { status: 409 }
      );
    }

    console.error("Create user error", err);
    return NextResponse.json(
      { error: "Không thể tạo tài khoản mới" },
      { status: 500 }
    );
  }
}

