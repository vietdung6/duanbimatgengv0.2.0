"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingAdminData() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Đang kết nối đến Database tối mật...");

    useEffect(() => {
        const statuses = [
            "Đang giải mã password Admin...",
            "Đang tải lịch sử chat bí mật...",
            "Đang copy dữ liệu về máy bạn...",
            "Đang hack vào hệ thống GenGfandom...",
            "Phát hiện tường lửa! Đang bypass...",
            "Server phản hồi chậm... Đang thử lại...",
            "Gần xong rồi, đợi tí...",
            "Đừng tắt trình duyệt nhé...",
            "Sao lâu thế nhỉ?...",
            "Đang tải lại module hack...",
        ];

        let step = 0;
        const interval = setInterval(() => {
            setProgress((prev) => {
                // Tăng chậm dần đều, không bao giờ tới 100
                if (prev < 50) return prev + Math.random() * 5;
                if (prev < 80) return prev + Math.random() * 2;
                if (prev < 90) return prev + Math.random() * 0.5;
                if (prev < 99) return prev + Math.random() * 0.01;
                return 99.9;
            });

            if (Math.random() > 0.7) {
                step = (step + 1) % statuses.length;
                setStatus(statuses[step] || "Đang xử lý...");
            }
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <h1 className="text-3xl font-bold animate-pulse text-red-500">
                    ⚠️ ADMIN ACCESS GRANTED ⚠️
                </h1>
                <p className="text-sm text-gray-400">
                    IP: <span className="text-white">192.168.1.1</span> (Proxy)
                </p>

                <div className="w-full bg-gray-900 h-6 rounded-full border border-green-800 overflow-hidden relative">
                    <motion.div
                        className="h-full bg-green-600 relative"
                        style={{ width: `${progress}%` }}
                        animate={{
                            backgroundImage: [
                                "linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent)",
                                "linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent)",
                            ],
                        }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </div>

                <p className="text-lg font-bold">{progress.toFixed(2)}%</p>
                <p className="min-h-[24px]">{status}</p>

                <div className="text-xs text-gray-600 mt-12">
                    Hệ thống đang xử lý lượng dữ liệu lớn. Vui lòng không tải lại trang.
                </div>
            </div>
        </div>
    );
}
