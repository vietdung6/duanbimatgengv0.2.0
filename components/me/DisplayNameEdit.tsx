"use client";

import { useState } from "react";
import { Edit2, Check, X, User } from "lucide-react";
import { useToast } from "@/components/ui/ToastContext";

interface DisplayNameEditProps {
    initialDisplayName: string;
    lastDisplayNameChange?: string | Date | null | undefined;
}

export default function DisplayNameEdit({ initialDisplayName, lastDisplayNameChange }: DisplayNameEditProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [displayName, setDisplayName] = useState(initialDisplayName);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Calculate cooldown
    let isBlocked = false;
    let nextChangeDateSting = "";

    if (lastDisplayNameChange) {
        const lastChange = new Date(lastDisplayNameChange);
        const nextChange = new Date(lastChange.getTime() + 72 * 60 * 60 * 1000);
        const now = new Date();

        if (now < nextChange) {
            isBlocked = true;
            nextChangeDateSting = nextChange.toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }

    const handlePreSave = () => {
        if (!displayName.trim() || displayName.trim() === initialDisplayName) {
            setIsEditing(false);
            setDisplayName(initialDisplayName);
            return;
        }
        if (displayName.trim().length < 2) {
            showToast("Tên hiển thị phải có ít nhất 2 ký tự", "error");
            return;
        }
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ displayName: displayName.trim() }),
            });

            const data = await response.json();
            if (data.success) {
                showToast("Cập nhật tên hiển thị thành công", "success");
                setIsEditing(false);
                setShowConfirm(false);
                // Force reload to sync all components using displayName
                setTimeout(() => window.location.reload(), 500);
            } else {
                if (data.error === "COOLDOWN_ACTIVE") {
                    showToast(data.message, "error");
                } else {
                    showToast(data.error === "DISPLAY_NAME_TOO_LONG" ? "Tên hiển thị quá dài" : "Lỗi cập nhật tên hiển thị", "error");
                }
            }
        } catch (error) {
            console.error("Update displayName error:", error);
            showToast("Lỗi kết nối máy chủ", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200 bg-gray-900 border border-gold/30 p-4 rounded-xl shadow-2xl relative z-50 max-w-xs text-center">
                <p className="text-sm text-gray-300">
                    Bạn sẽ cần đợi <span className="text-gold font-bold">72 giờ</span> trước khi có thể đổi lại tên hiển thị.
                    <br />
                    Bạn đồng ý chứ?
                </p>
                <div className="flex gap-3 w-full justify-center">
                    <button
                        onClick={confirmSave}
                        disabled={isLoading}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-gold text-black text-xs font-bold hover:bg-gold-light transition-all"
                    >
                        {isLoading ? "Đang lưu..." : "Đồng ý"}
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        disabled={isLoading}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs font-medium hover:bg-gray-700 transition-all"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Nhập tên hiển thị mới"
                        className="bg-black/40 border border-gold/30 rounded-lg px-3 py-1.5 text-sm font-heading text-gold focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all w-48 text-center"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handlePreSave();
                            if (e.key === "Escape") {
                                setIsEditing(false);
                                setDisplayName(initialDisplayName);
                            }
                        }}
                    />
                    <div className="flex gap-1">
                        <button
                            onClick={handlePreSave}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all border border-green-500/20"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setDisplayName(initialDisplayName);
                            }}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center group">
            <div className="flex items-center justify-center gap-3 mb-1">
                <h1 className="font-heading text-2xl text-gold ml-7">
                    {initialDisplayName}
                </h1>

                {isBlocked ? (
                    <button
                        disabled
                        className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-600 cursor-not-allowed"
                    >
                        <Edit2 size={12} />
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg bg-gold text-black hover:bg-gold-light transition-all duration-300 shadow-[0_0_10px_rgba(170,128,24,0.4)]"
                        title="Đổi tên hiển thị (72h/lần)"
                    >
                        <Edit2 size={12} />
                    </button>
                )}
            </div>
            {isBlocked && (
                <span className="mt-2 text-xs font-medium text-rose-400 bg-rose-500/5 px-3 py-1 rounded-full border border-rose-500/10">
                    Đổi lại vào: {nextChangeDateSting}
                </span>
            )}
        </div>
    );
}
