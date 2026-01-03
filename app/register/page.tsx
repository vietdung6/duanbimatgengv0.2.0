"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Loading from "@/components/ui/Loading";
import { useProgress } from "@bprogress/next";
import { Turnstile } from "@marsidev/react-turnstile";

function RegisterContent() {
  const router = useRouter();
  const { start, stop } = useProgress();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      checkToken(tokenParam);
    } else {
      setTokenValid(false);
    }
  }, [searchParams]);

  async function checkToken(t: string) {
    start();
    try {
      const res = await fetch(`/api/auth/register?check=${t}`);
      if (res.ok) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
      }
    } catch {
      setTokenValid(false);
    } finally {
      stop();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!turnstileToken) {
      setError("Vui lòng xác thực bạn không phải là robot");
      return;
    }

    setLoading(true);
    start();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          username: username || null,
          password,
          displayName: displayName || null,
          turnstileToken
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      router.push("/me");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(msg);
      stop();
    } finally {
      setLoading(false);
    }
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-black flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          {language === "en" ? "Checking invite link..." : "Đang kiểm tra link..."}
        </p>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-black">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="card-dark p-8 max-w-md text-center">
            <h1 className="font-heading text-2xl text-gold mb-4">
              {language === "en" ? "Invalid Invite Link" : "Link không hợp lệ"}
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              {language === "en"
                ? "This invite link is invalid, expired, or has already been used."
                : "Link này không hợp lệ, đã hết hạn hoặc đã được sử dụng."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="btn-outline-gold text-xs px-4 py-2"
            >
              {language === "en" ? "Back to Home" : "Về trang chủ"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="card-dark p-8 shadow-2xl border border-gold/30 bg-black/80 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/20 mb-3">
              <span className="text-xl">✨</span>
            </div>
            <h1 className="font-heading text-3xl text-gold mb-2">
              {language === "en" ? "Create Account" : "Tạo Tài Khoản"}
            </h1>
            <p className="text-gray-400 text-sm">
              {language === "en"
                ? "Fill in your information to join Gen.G Fandom"
                : "Điền thông tin để tham gia Gen.G Fandom"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md bg-black-charcoal border border-gray-700 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/60 transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md bg-black-charcoal border border-gray-700 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/60 transition"
                placeholder="username (optional)"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">
                {language === "en" ? "Display Name" : "Tên hiển thị"}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-md bg-black-charcoal border border-gray-700 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/60 transition"
                placeholder={
                  language === "en"
                    ? "How others see you"
                    : "Tên hiển thị của bạn"
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">
                {language === "en" ? "Password" : "Mật khẩu"} *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md bg-black-charcoal border border-gray-700 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/60 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">
                {language === "en"
                  ? "Confirm Password"
                  : "Xác nhận mật khẩu"} *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md bg-black-charcoal border border-gray-700 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/60 transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-center my-2">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={setTurnstileToken}
                options={{ theme: 'dark' }}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-1 text-center min-h-[1.5rem]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className="btn-gold w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? language === "en"
                  ? "Creating..."
                  : "Đang tạo..."
                : language === "en"
                  ? "Create Account"
                  : "Tạo Tài Khoản"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 w-full text-center text-xs text-gray-500 hover:text-gold transition-colors"
          >
            {language === "en" ? "Back to Home" : "Về trang chủ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterContent />
    </Suspense>
  );
}
