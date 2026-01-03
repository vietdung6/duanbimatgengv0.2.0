"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, ShieldAlert, Cpu, ChevronRight } from "lucide-react";

export default function ChovyCSHackPage() {
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Simulate hacking/loading sequence
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        // Easter Egg Discovery Log
        console.log(
            "%c⚡ CHOVY CS HACK ACTIVATED! (Easter Egg #1 Found)\n%cBí kíp này trị giá 30 triệu won đấy.",
            "color: #00FF00; font-size: 20px; font-weight: bold; background: #000; padding: 4px;",
            "color: #aaa; font-size: 14px;"
        );

        return () => clearTimeout(timer);
    }, []);

    const steps = [
        "Bước 1: Tập last hit lính chuẩn 100% (Cơ bản).",
        "Bước 2: 'Mượn' bãi chim của Rừng (Bắt buộc).",
        "Bước 3: 'Tiện tay' ăn luôn bãi Sói (Nếu rảnh).",
        "Bước 4: Khi Rừng ping '?', hãy mute chat.",
        "Bước 5: Lặp lại cho đến khi 300 CS ở phút 20.",
    ];

    return (
        <div className="min-h-screen bg-black font-mono text-green-500 p-4 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Matrix Rain Effect Background (Simplified) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="animate-pulse bg-[url('https://media.giphy.com/media/Hp4lpKYteq9kk/giphy.gif')] bg-cover w-full h-full opacity-20"></div>
            </div>

            <div className="z-10 max-w-2xl w-full border border-green-500/30 bg-black/80 p-8 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)]">

                {loading ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-2xl font-bold animate-pulse">
                            <Terminal size={32} />
                            <span>DECRYPTING CHOVY_DATABASE...</span>
                        </div>
                        <div className="w-full bg-green-900/30 h-2 rounded overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, ease: "linear" }}
                                className="h-full bg-green-500"
                            />
                        </div>
                        <div className="text-xs text-green-400/70 h-32 overflow-hidden">
                            <p>Downloading: last_hit_mechanics.exe...</p>
                            <p>Bypassing: jungle_protection_protocol...</p>
                            <p>Accessing: brain_limit_remover...</p>
                            <p>Injecting: 10cs_min_script...</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="text-center border-b border-green-500/30 pb-6">
                            <ShieldAlert size={48} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                                BÍ KÍP CS HACK CỦA CHOVY
                            </h1>
                            <p className="text-green-400 italic">
                                "Muốn tìm bí kíp của Chovy ư? Hãy làm theo 5 bước sau..."
                            </p>
                        </div>

                        <div className="space-y-4">
                            {steps.map((text, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.5 }}
                                    className="flex items-center gap-3 bg-green-900/10 p-4 rounded border border-green-500/20"
                                >
                                    <Cpu size={20} className="text-green-400 shrink-0" />
                                    <span className="text-lg md:text-xl text-white">{text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3 }}
                            className="pt-6 text-center"
                        >
                            <p className="text-yellow-500 font-bold mb-6 text-xl">
                                ⚠ CẢNH BÁO: CÓ THỂ MẤT TÌNH ANH EM VỚI RỪNG!
                            </p>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-bold rounded transition-colors group"
                            >
                                <span>Đã Hiểu (Về lại Web Chính)</span>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
