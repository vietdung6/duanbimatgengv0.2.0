"use client";

import { useState, useEffect } from "react";
import { X, Check, Globe, Image as ImageIcon, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";
import UserAvatar from "@/components/shared/UserAvatar";

interface AvatarUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAvatarUrl: string | null;
    displayName: string;
}

const PRESET_AVATARS = [
    { name: "Gen.G Logo", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmtlXnDGIV-UcrmO88-8e0vp9S1ZAKto01Dg&s" },
    { name: "Tiger Gold", url: "https://thumbs.dreamstime.com/b/gold-tiger-logo-head-brand-design-vector-golden-logotype-style-happy-new-year-237255086.jpg" }, // Placeholder for Gen.G themed tiger
    { name: "Team Photo", url: "https://geng.gg/cdn/shop/files/06_2490_R4.jpg?v=1736792371&width=3000" }, // Placeholder for Gen.G team
    { name: "Minimal Dark", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwe_Q73Q347GOFyJne8bmqudgp3Ltwm_Fzbw&s" },
    { name: "Gold Abstract", url: "https://thumbs.dreamstime.com/b/user-profile-icon-gold-round-button-golden-coin-shiny-frame-shadow-luxury-realistic-border-concept-abstract-illustration-167075925.jpg" },
];

export default function AvatarUpdateModal({
    isOpen,
    onClose,
    currentAvatarUrl,
    displayName
}: AvatarUpdateModalProps) {
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl ?? "");
    const [previewUrl, setPreviewUrl] = useState(currentAvatarUrl ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Update preview when typing with a slight debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setPreviewUrl(avatarUrl);
        }, 500);
        return () => clearTimeout(timer);
    }, [avatarUrl]);

    const handleSave = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/update-avatar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    avatarUrl: avatarUrl.trim() || null,
                }),
            });

            const data = await response.json();

            if (data.success) {
                showToast("Cập nhật avatar thành công!", "success");
                onClose();
                setTimeout(() => window.location.reload(), 500);
            } else {
                showToast("Không thể cập nhật avatar. Vui lòng thử lại.", "error");
            }
        } catch (error) {
            console.error("Avatar update error:", error);
            showToast("Đã xảy ra lỗi. Vui lòng thử lại sau.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold/30 bg-gray-900/90 shadow-2xl shadow-gold/10 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-gold" size={18} />
                        <h2 className="font-heading text-xl uppercase tracking-wider text-white">Cập Nhật Ảnh Đại Diện</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Main Preview */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl animate-pulse"></div>
                            <UserAvatar
                                src={previewUrl}
                                alt={displayName || "User"}
                                fallback={(displayName || "U").charAt(0).toUpperCase()}
                                className="relative z-10 h-32 w-32 rounded-full border-4 border-gold shadow-[0_0_30px_rgba(212,175,55,0.3)] bg-black"
                            />
                        </div>
                        <p className="mt-4 text-xs text-gray-400 font-medium uppercase tracking-widest">Xem trước</p>
                    </div>

                    {/* URL Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
                            <Globe size={12} /> Link Ảnh Của Bạn
                        </label>
                        <input
                            type="url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-xl bg-black/50 border border-gray-800 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all shadow-inner"
                        />
                    </div>

                    {/* Presets */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
                            <ImageIcon size={12} /> Chọn Nhanh Từ Gen.G
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {PRESET_AVATARS.map((preset) => (
                                <button
                                    key={preset.url}
                                    onClick={() => setAvatarUrl(preset.url)}
                                    className={`relative group rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${avatarUrl === preset.url ? "border-gold shadow-gold-glow" : "border-gray-800 hover:border-gold/30"
                                        }`}
                                >
                                    <img src={preset.url} alt={preset.name} className="h-12 w-12 object-cover" />
                                    {avatarUrl === preset.url && (
                                        <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                                            <Check size={14} className="text-gold stroke-[3]" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                </button>
                            ))}
                            {/* Reset to Default */}
                            <button
                                onClick={() => setAvatarUrl("")}
                                className={`flex items-center justify-center h-12 w-12 rounded-xl border-2 transition-all hover:scale-105 ${avatarUrl === "" ? "border-gold bg-gold/10" : "border-gray-800 hover:border-gold/30 bg-gray-900"
                                    }`}
                                title="Reset to default"
                            >
                                <X size={16} className={avatarUrl === "" ? "text-gold" : "text-gray-500"} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 border-t border-gray-800 px-6 py-4 bg-black/40">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-bold text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        HỦY
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading || (avatarUrl === (currentAvatarUrl ?? ""))}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light py-3 text-sm font-black text-black shadow-lg hover:shadow-gold-glow transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        ) : (
                            <Check size={16} />
                        )}
                        LƯU THAY ĐỔI
                    </button>
                </div>
            </div>
        </div>
    );
}
