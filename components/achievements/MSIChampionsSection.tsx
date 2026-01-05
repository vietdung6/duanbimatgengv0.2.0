"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { MSILogo } from "@/components/shared/Logos";
import { translations, Language } from "@/lib/i18n/translations";

interface MSIChampionsProps {
    language: Language;
}

export function MSIChampionsSection({ language }: MSIChampionsProps) {
    const t = translations[language].achievementsPage.msiChampions;
    const [bits, setBits] = React.useState<Array<{ x: number; duration: number; delay: number }>>([]);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        setBits(
            [...Array(20)].map(() => ({
                x: Math.random() * 100,
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 5,
            }))
        );
    }, []);

    if (!mounted) return null;

    return (
        <section className="py-16 relative bg-[#0a0a0a] overflow-hidden">
            {/* Dynamic Background Elements: CYBER 3D GRID */}
            <div className="absolute inset-0 z-0 bg-[#000510] overflow-hidden perspective-[1000px]">

                {/* 3D Moving Floor Grid */}
                <motion.div
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "0% 100%" }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-50%] opacity-15 top-[20%]"
                    style={{
                        backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                        transform: "rotateX(75deg)",
                    }}
                />

                {/* Digital Horizon Light */}
                <div className="absolute top-[10%] left-0 right-0 h-[400px] bg-gradient-to-b from-blue-600/20 via-blue-900/5 to-transparent blur-[80px] mix-blend-screen" />

                {/* Floating Digital Bits */}
                {bits.map((bit, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: "120%", opacity: 0 }}
                        animate={{ y: "-20%", opacity: [0, 0.5, 0] }}
                        transition={{
                            duration: bit.duration,
                            repeat: Infinity,
                            delay: bit.delay,
                            ease: "linear"
                        }}
                        className="absolute left-[var(--x)] w-[2px] h-[15px] bg-cyan-400 box-shadow-[0_0_10px_#22d3ee]"
                        style={{ '--x': `${bit.x}%` } as any}
                    />
                ))}

                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)] z-10" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <MSILogo className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse-slow drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    <h2 className="font-heading text-3xl md:text-5xl text-uppercase text-white tracking-widest leading-none">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-900">{t.mainTitleLine1}</span>
                        <span className="block text-blue-500 text-xl md:text-3xl mt-2 tracking-[0.3em] md:tracking-[0.5em] font-light">{t.mainTitleLine2}</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* 2024 MSI */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="group relative h-[350px] rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-500"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-[url('https://kenh14cdn.com/203336854389633024/2024/5/20/53731990415c7fc25b9ack-0953-17161832933322084945724.jpg')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110 opacity-40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-end justify-between border-b border-white/20 pb-4 mb-4">
                                <div>
                                    <div className="text-5xl font-heading text-white leading-none">2024</div>
                                    <div className="text-white/60 font-mono tracking-widest text-xs uppercase mt-2">{t.era2024}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-heading text-white">GEN.G</div>
                                    <div className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">{t.tag2024}</div>
                                </div>
                            </div>

                            {/* Roster */}
                            <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-mono">
                                <span>Kiin</span> <span className="text-blue-500">•</span>
                                <span>Canyon</span> <span className="text-blue-500">•</span>
                                <span>Chovy</span> <span className="text-blue-500">•</span>
                                <span>Peyz</span> <span className="text-blue-500">•</span>
                                <span className="text-white font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">Lehends (MVP)</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2025 MSI */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="group relative h-[350px] rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-500"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-[url('https://admin.esports.gg/wp-content/uploads/2025/07/GENG-won-MSI-2025.jpg')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110 opacity-40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-end justify-between border-b border-white/20 pb-4 mb-4">
                                <div>
                                    <div className="text-5xl font-heading text-white leading-none">2025</div>
                                    <div className="text-white/60 font-mono tracking-widest text-xs uppercase mt-2">{t.era2025}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-heading text-white">GEN.G</div>
                                    <div className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">{t.tag2025}</div>
                                </div>
                            </div>

                            {/* Roster */}
                            <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-mono">
                                <span>Kiin</span> <span className="text-blue-500">•</span>
                                <span>Canyon</span> <span className="text-blue-500">•</span>
                                <span className="text-white font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">Chovy (MVP)</span> <span className="text-blue-500">•</span>
                                <span>Ruler</span> <span className="text-blue-500">•</span>
                                <span>Duro</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
