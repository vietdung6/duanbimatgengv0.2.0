"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import Loading from "@/components/ui/Loading";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let returnUrl = searchParams.get("from") || "/me";
  
  // Prevent infinite redirect loop if returnUrl is login or register
  if (returnUrl.includes("/login") || returnUrl.includes("/register")) {
    returnUrl = "/me";
  }
  
  const { t } = useLanguage();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const auth = t.auth;

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(returnUrl);
      }
    }
  }, [user, authLoading, router, returnUrl]);

  if (authLoading) {
    return <Loading />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || auth.errorGeneric);
        return;
      }

      // Đăng nhập thành công, cập nhật state user và chuyển về trang profile
      await refreshUser();
      
      // Check for admin role directly from response data to avoid waiting for state update
      if (data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push(returnUrl);
      }
    } catch (err) {
      console.error("Login error", err);
      setError(auth.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background effects giống style trang chủ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="grid gap-6 md:gap-8 md:grid-cols-[1.15fr_minmax(0,1fr)] items-stretch">
          {/* Left: form */}
          <div className="card-dark p-8 shadow-2xl border border-gold/30 bg-black/80 backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-full bg-gold/20 mb-3">
                <Image 
                  src="/images/genrang_emote.png" 
                  alt="Logo" 
                  width={64} 
                  height={64} 
                  className="object-contain"
                />
              </div>
              <h1 className="font-heading text-3xl text-gold mb-2">
              {auth.title}
              </h1>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                {auth.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">
                  {auth.emailOrUsername}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-black-charcoal border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/60 transition"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    placeholder="your@email.com / username"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600 text-xs">
                    ID
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">
                  {auth.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-black-charcoal border border-gray-700 rounded-lg px-4 py-2.5 pr-16 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/60 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-[11px] text-gray-400 hover:text-gold transition"
                    tabIndex={-1}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs mt-1 text-center min-h-[1.5rem]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? auth.loading : auth.submit}
              </button>
            </form>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-4 w-full text-center text-xs text-gray-500 hover:text-gold transition-colors"
            >
              {auth.backToHome}
            </button>
          </div>

          {/* Right: info panel (hiện cả mobile & desktop) */}
          <div className="card-dark border border-gray-800/80 bg-black/70 px-6 py-6 mt-4 md:mt-0 flex flex-col justify-between">
            <div className="mb-3">
              <div className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-2">
                GEN.G FANDOM
              </div>
              <h2 className="font-heading text-xl text-gold mb-2">
                Quyền lợi khi đăng nhập
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Tài khoản fan giúp bạn tham gia viewing party, theo dõi điểm
                Gen.G Points, và sau này mở khoá thêm minigame / dự đoán tỉ số.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-[1px]">●</span>
                  <span>Theo dõi hồ sơ fan, Proof và điểm Gen.G Points.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-[1px]">●</span>
                  <span>Chuẩn bị cho Viewing Party & các tính năng Fan Zone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-[1px]">●</span>
                  <span>
                    Staff có thể quản lý tài khoản từ Staff Dashboard riêng.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-4 border-t border-gray-800/80 pt-3">
              <p className="text-[10px] text-gray-500 leading-relaxed space-y-1">
                <span className="block">
                  Tài khoản fan được cấp thủ công bởi admin Gen.G Fandom. Nếu
                  bạn chưa có tài khoản, hãy liên hệ admin qua:
                </span>
                <span className="block">
                  • Fanpage:{" "}
                  <a
                    href="https://www.facebook.com/profile.php?id=61584724361968"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold hover:text-gold/80 underline underline-offset-2"
                  >
                    GenG LOL Fandom Vietnam
                  </a>
                </span>
                <span className="block">
                  • Nhắn tin Messenger:{" "}
                  <a
                    href="https://www.m.me/61584724361968"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold hover:text-gold/80 underline underline-offset-2"
                  >
                    m.me/61584724361968
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
