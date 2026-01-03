import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma, UserRole } from "@prisma/client";

import {
  validateInviteToken,
} from "@/lib/auth/inviteService";
import { signAuthToken, setAuthCookie } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("check");

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  const invite = await validateInviteToken(token);
  return NextResponse.json({ valid: !!invite }, { status: 200 });
}

import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { token, email, username, password, displayName } = result.data;

    const invite = await validateInviteToken(token);
    if (!invite) {
      return NextResponse.json(
        { error: "Invite link không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim();
    const usernameTrimmed = username?.trim() || null;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailTrimmed },
          ...(usernameTrimmed ? [{ username: usernameTrimmed }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email hoặc username đã tồn tại" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const finalDisplayName =
      displayName?.trim() || usernameTrimmed || emailTrimmed.split("@")[0];

    // Transaction to ensure atomicity of user creation and token usage
    const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create the user first
      const user = await tx.user.create({
        data: {
          email: emailTrimmed,
          username: usernameTrimmed,
          avatar_url: null,
          display_name: finalDisplayName ?? null,
          proof: null,
          points: 0,
          total_points: 0,
          password_hash: passwordHash,
          role: invite.role as UserRole,
        },
      });

      // 2. Mark token as used.
      // We explicitly check for used: false to prevent race conditions where
      // multiple requests might validate the token simultaneously.
      const updateResult = await tx.inviteToken.updateMany({
        where: {
          token: token,
          used: false
        },
        data: {
          used: true,
          used_by_user_id: user.id,
        },
      });

      if (updateResult.count === 0) {
        throw new Error("Invite token has already been used");
      }

      return user;
    });

    if (!newUser) {
      return NextResponse.json(
        { error: "Không thể tạo tài khoản" },
        { status: 500 }
      );
    }

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      avatarUrl: newUser.avatar_url ?? null,
      displayName: newUser.display_name ?? null,
      proof: newUser.proof ?? null,
      points: newUser.points ?? 0,
      totalPoints: newUser.total_points ?? 0,
      role: (newUser.role as "fan" | "staff" | "admin") ?? "fan",
      twoFactorEnabled: false,
    };

    const jwtToken = signAuthToken(authUser);
    const res = NextResponse.json({ success: true, user: authUser });
    setAuthCookie(res, jwtToken);

    return res;
  } catch (err) {
    console.error("Register error", err);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
