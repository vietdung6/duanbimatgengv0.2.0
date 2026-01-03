"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";

interface ChangePasswordFormProps {
    twoFactorEnabled: boolean;
}

export default function ChangePasswordForm({ twoFactorEnabled }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactorToken, setTwoFactorToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        if (newPassword.length < 6) {
            showToast("Mật khẩu mới phải có ít nhất 6 ký tự", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Mật khẩu mới không khớp", "error");
            return;
        }

        if (currentPassword === newPassword) {
            showToast("Mật khẩu mới phải khác mật khẩu hiện tại", "error");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    twoFactorToken: twoFactorEnabled ? twoFactorToken : undefined,
                }),
            });

            const data = await response.json();

            if (data.success) {
                showToast("Đổi mật khẩu thành công!", "success");
                // Clear form
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setTwoFactorToken("");
            } else {
                // Handle specific errors
                if (data.error === "INVALID_CURRENT_PASSWORD") {
                    showToast("Mật khẩu hiện tại không đúng", "error");
                } else if (data.error === "PASSWORD_TOO_SHORT") {
                    showToast("Mật khẩu mới quá ngắn (tối thiểu 6 ký tự)", "error");
                } else if (data.error === "TWO_FACTOR_REQUIRED" || data.error === "INVALID_2FA_TOKEN") {
                    showToast("Mã 2FA không đúng hoặc còn thiếu", "error");
                } else {
                    showToast("Không thể đổi mật khẩu. Vui lòng thử lại.", "error");
                }
            }
        } catch (error) {
            console.error("Password change error:", error);
            showToast("Đã xảy ra lỗi. Vui lòng thử lại sau.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-5">
            <div className="flex items-center gap-2 mb-4 text-gray-300">
                <Lock size={16} />
                <h3 className="text-sm font-bold uppercase tracking-wide">Đổi Mật Khẩu</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Current Password */}
                <div className="relative">
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Mật khẩu hiện tại"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-black/50 border border-gray-800 px-4 py-2.5 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* New Password */}
                <div className="relative">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-black/50 border border-gray-800 px-4 py-2.5 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-black/50 border border-gray-800 px-4 py-2.5 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* 2FA Token (Conditional) */}
                {twoFactorEnabled && (
                    <div className="pt-2">
                        <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">
                            Mã xác thực 2FA
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            value={twoFactorToken}
                            onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ""))}
                            placeholder="000000"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-gold/5 border border-gold/30 px-4 py-2.5 text-center text-lg tracking-[0.5em] font-mono text-gold focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all disabled:opacity-50"
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/50 text-gold text-xs py-2.5 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-gold-glow"
                >
                    {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
            </form>
        </div>
    );
}
