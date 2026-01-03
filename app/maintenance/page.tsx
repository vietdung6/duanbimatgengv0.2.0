import { Shield, Lock, ExternalLink } from "lucide-react";
// import Link from "next/link"; // Removed to use native <a>
import React from "react";

interface MaintenancePageProps {
    restrictedAccess?: boolean;
}

export default function MaintenancePage({ restrictedAccess }: MaintenancePageProps) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent z-0 blur-3xl" />

            <div className="relative z-10 text-center max-w-lg">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20 shadow-gold-glow animate-pulse">
                    {restrictedAccess ? (
                        <Lock size={40} className="text-red-500" />
                    ) : (
                        <Shield size={40} className="text-gold" />
                    )}
                </div>

                <h1 className="font-heading text-5xl md:text-6xl text-white mb-6">
                    {restrictedAccess ? (
                        <span className="text-red-500">TRUY CẬP BỊ TỪ CHỐI</span>
                    ) : (
                        <span className="text-gradient-gold">BẢO TRÌ</span>
                    )}
                </h1>

                <div className="text-xl text-white/80 mb-8 font-light">
                    {restrictedAccess ? (
                        <p>
                            Bạn cần quyền <span className="text-gold font-bold">Admin/Staff</span> để truy cập hệ thống lúc này.
                        </p>
                    ) : (
                        <p>
                            Hệ thống đang được nâng cấp để phục vụ bạn tốt hơn.
                            <br />
                            Vui lòng quay lại sau!
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-6">
                    {!restrictedAccess && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
                            <span className="text-sm text-gray-400 uppercase tracking-widest font-bold">System Maintenance</span>
                        </div>
                    )}

                    <div>
                        {/* Use native <a> tag to force hard navigation (server re-render) */}
                        <a
                            href="/portal-login"
                            className="flex items-center gap-2 text-sm text-gold/80 hover:text-gold hover:underline transition-colors uppercase tracking-wider font-bold"
                        >
                            <ExternalLink size={14} />
                            Cổng Đăng Nhập Quản Trị
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-center w-full z-10">
                <p className="text-gray-600 text-xs">Gen.G Fandom © 2025</p>
            </div>
        </div>
    );
}
