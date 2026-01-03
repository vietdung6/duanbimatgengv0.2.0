"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, Key, Smartphone, Copy, CheckCircle2, ShieldOff } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";
import QRCode from "qrcode";

interface TwoFactorSettingsProps {
    initialEnabled: boolean;
}

export default function TwoFactorSettings({ initialEnabled }: TwoFactorSettingsProps) {
    const [isEnabled, setIsEnabled] = useState(initialEnabled);
    const [isSettingUp, setIsSettingUp] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [secret, setSecret] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [disableCode, setDisableCode] = useState("");
    const { showToast } = useToast();

    const handleSetup = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/2fa/setup", { method: "POST" });
            const data = await response.json();
            if (data.success) {
                setSecret(data.secret);
                const qrUrl = await QRCode.toDataURL(data.otpauth);
                setQrCodeUrl(qrUrl);
                setIsSettingUp(true);
            } else {
                showToast("Không thể khởi tạo 2FA. Vui lòng thử lại.", "error");
            }
        } catch (error) {
            console.error("2FA Setup Error:", error);
            showToast("Lỗi kết nối máy chủ.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            showToast("Vui lòng nhập mã 6 chữ số", "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/2fa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: verificationCode }),
            });
            const data = await response.json();
            if (data.success) {
                showToast("Bật 2FA thành công!", "success");
                setIsEnabled(true);
                setIsSettingUp(false);
                setVerificationCode("");
                setTimeout(() => window.location.reload(), 500);
            } else {
                showToast(data.error === "INVALID_TOKEN" ? "Mã xác nhận không đúng hoặc đã hết hạn" : "Lỗi xác thực 2FA. Vui lòng thử lại.", "error");
            }
        } catch (error) {
            console.error("2FA Verify Error:", error);
            showToast("Lỗi xác thực mã.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable = async () => {
        if (!disableCode || disableCode.length !== 6) {
            showToast("Vui lòng nhập mã 6 chữ số", "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/2fa/disable", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: disableCode }),
            });
            const data = await response.json();
            if (data.success) {
                showToast("Đã tắt bảo mật 2 lớp", "success");
                setIsEnabled(false);
                setIsDisabling(false);
                setDisableCode("");
            } else {
                showToast("Mã xác nhận không đúng", "error");
            }
        } catch (error) {
            console.error("2FA Disable Error:", error);
            showToast("Lỗi khi tắt 2FA.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Đã sao chép mã Secret", "success");
    };

    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-5 mt-4 transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isEnabled ? 'bg-green-500/10 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                        {isEnabled ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-100">Bảo mật 2 lớp (2FA)</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                            Sử dụng Google Authenticator để bảo vệ tài khoản của bạn.
                        </p>
                    </div>
                </div>
                {!isSettingUp && !isDisabling && (
                    <button
                        onClick={isEnabled ? () => setIsDisabling(true) : handleSetup}
                        disabled={isLoading}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${isEnabled
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30"
                            : "bg-gold/10 text-gold hover:bg-gold/20 border border-gold/50"
                            }`}
                    >
                        {isLoading ? "Đang xử lý..." : isEnabled ? "Tắt bảo mật" : "Thiết lập"}
                    </button>
                )}
            </div>

            {/* Setup Form */}
            {isSettingUp && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="bg-white p-2 rounded-xl shadow-lg shadow-white/5">
                            {qrCodeUrl && <img src={qrCodeUrl} alt="2FA QR Code" className="w-32 h-32" />}
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-start gap-2">
                                <Smartphone size={16} className="text-gold mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-300">
                                    Quét mã QR bằng ứng dụng <b>Google Authenticator</b> hoặc nhập mã bí mật bên dưới.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-black/50 border border-gray-800 rounded-lg group">
                                <Key size={14} className="text-gray-500" />
                                <code className="text-[10px] text-gold font-mono flex-1">{secret}</code>
                                <button
                                    onClick={() => copyToClipboard(secret)}
                                    className="p-1 hover:text-gold transition-colors text-gray-500"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800/50">
                        <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
                            Xác nhận mã 6 chữ số
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="000000"
                                className="flex-1 rounded-lg bg-black/50 border border-gray-800 px-4 py-2.5 text-center text-lg tracking-[0.5em] font-mono text-gold focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                            />
                            <button
                                onClick={handleVerify}
                                disabled={isLoading || verificationCode.length !== 6}
                                className="px-6 rounded-lg bg-gold text-black text-xs font-bold hover:bg-gold-light transition-all disabled:opacity-50"
                            >
                                {isLoading ? "..." : "XÁC NHẬN"}
                            </button>
                            <button
                                onClick={() => setIsSettingUp(false)}
                                disabled={isLoading}
                                className="px-4 rounded-lg bg-gray-800 text-gray-400 text-xs hover:bg-gray-700 transition-all"
                            >
                                HỦY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Disable Form */}
            {isDisabling && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <ShieldOff size={20} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-red-400 font-medium">Xác nhận tắt bảo mật 2 lớp</p>
                            <p className="text-[10px] text-gray-500 mt-1">
                                Nhập mã 6 số từ Google Authenticator để xác nhận. Sau khi tắt, tài khoản sẽ chỉ được bảo vệ bằng mật khẩu.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
                            Mã xác thực 2FA
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                maxLength={6}
                                value={disableCode}
                                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="000000"
                                className="flex-1 rounded-lg bg-black/50 border border-red-500/30 px-4 py-2.5 text-center text-lg tracking-[0.5em] font-mono text-red-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                            />
                            <button
                                onClick={handleDisable}
                                disabled={isLoading || disableCode.length !== 6}
                                className="px-6 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                {isLoading ? "..." : "TẮT 2FA"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsDisabling(false);
                                    setDisableCode("");
                                }}
                                disabled={isLoading}
                                className="px-4 rounded-lg bg-gray-800 text-gray-400 text-xs hover:bg-gray-700 transition-all"
                            >
                                HỦY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isSettingUp && !isDisabling && isEnabled && (
                <div className="flex items-center gap-2 text-[10px] text-green-500/80 bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                    <CheckCircle2 size={12} />
                    <span>Tài khoản của bạn đang được bảo vệ bởi Google Authenticator.</span>
                </div>
            )}
        </div>
    );
}

