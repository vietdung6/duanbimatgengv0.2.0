import { NextRequest, NextResponse } from "next/server";

import { signAuthToken, setAuthCookie } from "@/lib/auth";
import { validateUserCredentials } from "@/lib/auth/userService";

import { loginSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { emailOrUsername, password, turnstileToken } = result.data;

    // --- TURNSTILE VERIFICATION ---
    if (!turnstileToken) {
      return NextResponse.json({ error: "Thiếu mã xác thực CAPTCHA" }, { status: 400 });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (secretKey) {
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const formData = new FormData();
      formData.append("secret", secretKey);
      formData.append("response", turnstileToken);
      formData.append("remoteip", ip);

      const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: formData,
      });

      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return NextResponse.json({ error: "Xác thực CAPTCHA thất bại" }, { status: 400 });
      }
    }
    // ------------------------------

    const authUser = await validateUserCredentials(emailOrUsername, password);
    if (!authUser) {
      return NextResponse.json(
        { error: "Sai thông tin đăng nhập" },
        { status: 401 }
      );
    }

    const token = signAuthToken(authUser);

    const res = NextResponse.json({ success: true, user: authUser });
    setAuthCookie(res, token);

    return res;
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
