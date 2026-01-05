"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import Loading from "@/components/ui/Loading";
import { Shield, Lock } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

function PortalLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("from") || "/admin";

    const { user, loading: authLoading, refreshUser } = useAuth();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === "admin" || user.role === "staff") {
                router.push("/admin");
            } else {
                setError("Tài khoản này không có quyền truy cập cổng quản trị.");
            }
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return <Loading />;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!turnstileToken) {
            setError("Vui lòng xác thực bạn không phải là robot");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ emailOrUsername, password, turnstileToken }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Đăng nhập thất bại");
                return;
            }

            await refreshUser();

            const role = data.user?.role;
            if (role === "admin" || role === "staff") {
                router.push("/admin");
            } else {
                setError("Tài khoản này không có quyền truy cập cổng quản trị.");
                // Optional: logout automatically if unauthorized?
                // fetch('/api/auth/logout'); 
            }
        } catch (err) {
            console.error("Login error", err);
            setError("Lỗi hệ thống");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-black relative overflow-hidden flex items-center justify-center">
            {/* Red Background effects for Backdoor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-900/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="card-dark p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)] border border-red-900/30 bg-black/90 backdrop-blur-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 mb-4 border border-red-500/20 shadow-lg">
                            <Lock size={32} className="text-red-500" />
                        </div>
                        <h1 className="font-heading text-2xl text-red-500 mb-2 uppercase tracking-widest">
                            CỔNG QUẢN TRỊ
                        </h1>
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                            Restricted Access Area
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                Tên Đăng Nhập / Email
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition font-mono"
                                    value={emailOrUsername}
                                    onChange={(e) => setEmailOrUsername(e.target.value)}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                                Mật Khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 pr-16 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition font-mono"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-2 flex items-center px-2 text-[10px] text-gray-500 hover:text-red-400 transition font-bold"
                                    tabIndex={-1}
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        {/* Turnstile Widget */}
                        <div className="flex justify-center">
                            <Turnstile
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                                onSuccess={setTurnstileToken}
                                options={{
                                    theme: "dark",
                                    size: "normal",
                                }}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center flex items-center justify-center gap-2">
                                <Shield size={12} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "ĐANG XÁC THỰC..." : "TRUY CẬP HỆ THỐNG"}
                        </button>
                    </form>

                    <div className="mt-8 pt-4 border-t border-gray-800 text-center">
                        <p className="text-[10px] text-gray-600 font-mono">
                            IP: {typeof window !== 'undefined' ? 'Logged' : '...'} • Secure Connection
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PortalLoginPage() {
    return (
        <Suspense fallback={<Loading />}>
            <PortalLoginForm />
        </Suspense>
    );
}
