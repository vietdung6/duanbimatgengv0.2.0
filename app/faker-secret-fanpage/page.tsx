"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Crown, Trophy, Terminal, Skull } from "lucide-react";

export default function FakerSecretFanpage() {
    const [stage, setStage] = useState<"fake" | "glitch" | "real">("fake");

    useEffect(() => {
        // Only auto-transition from glitch to real
        if (stage === "glitch") {
            const timer = setTimeout(() => {
                setStage("real");
            }, 2000);
            return () => clearTimeout(timer);
        }

        // Easter Egg Discovery Log
        console.log(
            "%c🤫  Easter Egg #2 Found.",
            "color: #E4002B; font-size: 20px; font-weight: bold;",
            "color: #aaa; font-size: 14px;"
        );
    }, [stage]);

    return (
        <div className="min-h-screen bg-black overflow-hidden relative">
            <AnimatePresence mode="wait">

                {/* STAGE 1: T1 FAKE FANPAGE */}
                {stage === "fake" && (
                    <motion.div
                        key="fake"
                        exit={{ opacity: 0, scale: 1.1, filter: "invert(1)" }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-[#E4002B] flex flex-col items-center justify-center text-white p-4"
                    >
                        <div className="text-center max-w-3xl">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="mb-8"
                            >
                                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
                                    SHHH! 🤫
                                </h1>
                                <p className="text-xl md:text-3xl font-bold tracking-widest text-white/90">
                                    Thực ra Admin là fan cứng <span className="text-black bg-white px-2">T1</span> nhé!
                                </p>
                                <p className="text-lg text-white/80 mt-2">
                                    (Web Gen.G chỉ là bình phong thôi, Faker mới là chân ái ❤️)
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl relative mb-8"
                            >
                                <Image
                                    src="/images/faker-shhh.jpg"
                                    alt="Faker Shhh"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 256px"
                                    priority
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 }}
                            >
                                <button
                                    onClick={() => setStage("glitch")}
                                    className="bg-white text-[#E4002B] px-8 py-3 rounded-full font-black text-xl 
                                             hover:bg-black hover:text-white transition-all transform hover:scale-105 shadow-lg
                                             flex items-center gap-2 mx-auto"
                                >
                                    Xem Bộ Sưu Tập Ảnh T1 Bí Mật ➡
                                </button>
                                <p className="text-xs text-white/60 mt-4 italic">
                                    *Đừng nói cho ai biết nhé!
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* STAGE 2: GLITCH / HACKED */}
                {stage === "glitch" && (
                    <motion.div
                        key="glitch"
                        className="absolute inset-0 bg-black flex items-center justify-center"
                    >
                        <div className="text-green-500 font-mono text-2xl md:text-4xl text-center">
                            <p>KHOAN ĐÃ...</p>
                            <p className="text-red-500">PHÁT HIỆN PHẢN ĐỒ...</p>
                            <br />
                            <p className="animate-pulse text-gold">CHOVY: "BẮT ĐƯỢC RỒI NHÉ!" 🤨</p>
                        </div>
                    </motion.div>
                )}

                {/* STAGE 3: REALITY (GEN.G) */}
                {stage === "real" && (
                    <motion.div
                        key="real"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-black flex flex-col items-center justify-center p-4"
                    >
                        {/* Background Gold Particles */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-black to-black z-0" />

                        <div className="z-10 text-center max-w-4xl border border-gold/30 p-8 rounded-2xl bg-black/50 backdrop-blur-md shadow-gold-glow">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-4"
                            >
                                <Crown size={64} className="text-gold mx-auto mb-4 animate-bounce" />
                                <h1 className="font-heading text-5xl md:text-7xl mb-2">
                                    <span className="text-gradient-gold">SURPRISE!</span> <span className="text-white filter drop-shadow-md">😜</span>
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="space-y-6"
                            >
                                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gold shadow-gold-glow relative">
                                    <Image
                                        src="/images/chovy-goat.jpg"
                                        alt="Chovy GOAT"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="py-4 border-y border-gold/20">
                                    <p className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider leading-tight mb-4">
                                        <span className="text-red-500 line-through decoration-4 opacity-70">Admin là fan T1</span>
                                        <br />
                                        <span className="text-gold font-black text-4xl md:text-6xl mt-4 block filter drop-shadow-gold-glow">
                                            ADMIN LÀ GENCON RIÊU (REAL) 100% 🐯
                                        </span>
                                    </p>
                                    <p className="text-lg text-gray-300 mt-2">
                                        (Chúng tôi tôn trọng Faker, nhưng <span className="text-white font-bold">Chovy</span> mới là tín ngưỡng!)
                                    </p>
                                </div>

                                <p className="text-gray-400 italic">
                                    "Đừng tin những gì bạn thấy trên mạng."
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                                className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center"
                            >
                                <Link
                                    href="/"
                                    className="btn-gold inline-flex items-center gap-2"
                                >
                                    <Trophy size={18} />
                                    Về Nhà Thôi
                                </Link>

                                <Link
                                    href="/chovy-cs-hack"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-green-500/50 text-green-400 font-mono rounded hover:bg-green-500/10 transition-all text-sm"
                                >
                                    <Terminal size={16} />
                                    Bí kíp Farm 300CS/20p 🤫
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
