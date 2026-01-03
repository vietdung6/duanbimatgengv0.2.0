"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Shield, ArrowLeft } from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, refreshUser } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    // Check if we're on a sub-page (not the main /staff page)
    const isSubPage = pathname !== "/staff";

    // Authorization check with grace period
    useEffect(() => {
        // Clear any existing timer
        if (redirectTimerRef.current) {
            clearTimeout(redirectTimerRef.current);
            redirectTimerRef.current = null;
        }

        // If still loading, wait
        if (loading) return;

        // Check if authorized
        const isAuthorized = user && (user.role === "staff" || user.role === "admin");

        if (isAuthorized) {
            setAuthChecked(true);
            return;
        }

        // Not authorized - try to refresh once
        if (!authChecked) {
            refreshUser();
            setAuthChecked(true);
            return;
        }

        // Still not authorized after refresh - redirect with grace period (3 seconds)
        redirectTimerRef.current = setTimeout(() => {
            router.replace("/");
        }, 3000);

        return () => {
            if (redirectTimerRef.current) {
                clearTimeout(redirectTimerRef.current);
            }
        };
    }, [user, loading, router, authChecked, refreshUser]);

    // Show nothing while loading or unauthorized
    if (loading || !user || (user.role !== "staff" && user.role !== "admin")) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-black flex items-center justify-center">
                <div className="text-gray-500">Đang kiểm tra quyền truy cập...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
            <div className="container mx-auto px-4 max-w-6xl space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-gold/70 mb-2">
                            <Shield size={16} />
                            <span className="text-xs uppercase tracking-widest font-bold">Admin Portal</span>
                        </div>
                        <h1 className="font-heading text-4xl text-white">
                            Staff <span className="text-gold">Dashboard</span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-lg">
                            Hệ thống quản lý nội bộ dành cho Staff Gen.G Fandom.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {isSubPage ? (
                            <Link
                                href="/staff"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold hover:text-white transition-colors text-sm font-medium border border-gold/30"
                            >
                                <ArrowLeft size={16} />
                                Quay về Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={user?.role === 'admin' ? '/admin' : '/'}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                <ArrowLeft size={16} />
                                {user?.role === 'admin' ? 'Back to Admin' : 'Back to Home'}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Page Content */}
                <div className="min-h-[400px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
