"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";

interface AvatarUpdateFormProps {
    currentAvatarUrl: string | null;
}

export default function AvatarUpdateForm({ currentAvatarUrl }: AvatarUpdateFormProps) {
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                // Reload page to show new avatar
                window.location.reload();
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

    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-5">
            <div className="flex items-center gap-2 mb-4 text-gray-300">
                <Edit size={16} />
                <h3 className="text-sm font-bold uppercase tracking-wide">Cập nhật Avatar</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                    <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        disabled={isLoading}
                        className="w-full rounded-lg bg-black/50 border border-gray-800 px-4 py-2.5 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-2.5 text-[10px] text-gray-600 pointer-events-none">URL</div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </form>
        </div>
    );
}
