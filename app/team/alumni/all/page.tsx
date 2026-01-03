"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Search, Database, Filter } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";

// Expanded mock data to simulate a "Full" list
// In a real app, this would come from a database
const FULL_ROSTER_DB = [
    { id: "kiin", name: "Kiin", realName: "Kim Gi-in", role: "Top", era: "Gen.G", years: "2024-Present", status: "Active" },
    { id: "canyon", name: "Canyon", realName: "Kim Geon-bu", role: "Jungle", era: "Gen.G", years: "2024-Present", status: "Active" },
    { id: "chovy", name: "Chovy", realName: "Jeong Ji-hoon", role: "Mid", era: "Gen.G", years: "2022-Present", status: "Active" },
    { id: "ruler", name: "Ruler", realName: "Park Jae-hyuk", role: "ADC", era: "Gen.G / SSG", years: "2016-2022, 2025-", status: "Active" },
    { id: "duro", name: "Duro", realName: "Joo Min-kyu", role: "Support", era: "Gen.G", years: "2025-Present", status: "Active" },
    { id: "lehends", name: "Lehends", realName: "Son Si-woo", role: "Support", era: "Gen.G", years: "2021-2022, 2023-2024", status: "Former" },
    { id: "peyz", name: "Peyz", realName: "Kim Su-hwan", role: "ADC", era: "Gen.G", years: "2023-2024", status: "Former" },
    { id: "peanut", name: "Peanut", realName: "Han Wang-ho", role: "Jungle", era: "Gen.G", years: "2019, 2022-2023", status: "Former" },
    { id: "doran", name: "Doran", realName: "Choi Hyeon-joon", role: "Top", era: "Gen.G", years: "2022-2023", status: "Former" },
    { id: "delight", name: "Delight", realName: "Lee Ji-hoon", role: "Support", era: "Gen.G", years: "2023", status: "Former" },
    { id: "clid", name: "Clid", realName: "Kim Tae-min", role: "Jungle", era: "Gen.G", years: "2020-2021", status: "Former" },
    { id: "bdd", name: "Bdd", realName: "Gwak Bo-seong", role: "Mid", era: "Gen.G", years: "2020-2021", status: "Former" },
    { id: "rascal", name: "Rascal", realName: "Kim Kwang-hee", role: "Top", era: "Gen.G", years: "2020-2021", status: "Former" },
    { id: "life", name: "Life", realName: "Kim Jeong-min", role: "Support", era: "Gen.G", years: "2018-2021", status: "Former" },
    { id: "kellin", name: "Kellin", realName: "Kim Hyeong-gyu", role: "Support", era: "Gen.G", years: "2020", status: "Former" },
    { id: "bono", name: "Bono", realName: "Kim Gi-beom", role: "Jungle", era: "Gen.G", years: "2020", status: "Former" },
    { id: "fly", name: "Fly", realName: "Song Yong-jun", role: "Mid", era: "Gen.G", years: "2017-2019", status: "Former" },
    { id: "cuvee", name: "CuVee", realName: "Lee Seong-jin", role: "Top", era: "SSG / Gen.G", years: "2015-2019", status: "Former" },
    { id: "roach", name: "Roach", realName: "Kim Kang-hui", role: "Top", era: "Gen.G", years: "2019", status: "Former" },
    { id: "seonghwan", name: "SeongHwan", realName: "Yoon Seong-hwan", role: "Jungle", era: "Gen.G", years: "2019", status: "Former" },
    { id: "kuzan", name: "Kuzan", realName: "Lee Seong-hyeok", role: "Mid", era: "Gen.G", years: "2019", status: "Former" },
    { id: "rich", name: "Rich", realName: "Lee Jae-won", role: "Mid/Top", era: "Gen.G", years: "2019", status: "Former" },
    { id: "ambition", name: "Ambition", realName: "Kang Chan-yong", role: "Jungle", era: "SSG / Gen.G", years: "2016-2018", status: "Retired" },
    { id: "crown", name: "Crown", realName: "Lee Min-ho", role: "Mid", era: "SSG / Gen.G", years: "2015-2018", status: "Retired" },
    { id: "corejj", name: "CoreJJ", realName: "Jo Yong-in", role: "Support", era: "SSG / Gen.G", years: "2016-2018", status: "Former" },
    { id: "haru", name: "Haru", realName: "Kang Min-seung", role: "Jungle", era: "SSG / Gen.G", years: "2017-2018", status: "Former" },
    { id: "mong", name: "Mong", realName: "Moon Chang-min", role: "Top", era: "Gen.G", years: "2018", status: "Former" },
    { id: "wraith", name: "Wraith", realName: "Kwon Ji-min", role: "Support", era: "SSG / Gen.G", years: "2015-2018", status: "Retired" },
    { id: "stitch", name: "Stitch", realName: "Lee Seung-ju", role: "ADC", era: "SSG", years: "2015-2017", status: "Former" },
    { id: "looper", name: "Looper", realName: "Jang Hyeong-seok", role: "Top", era: "SSW", years: "2013-2014", status: "Retired" },
    { id: "dandy", name: "DanDy", realName: "Choi In-kyu", role: "Jungle", era: "SSW", years: "2013-2014", status: "Retired" },
    { id: "pawn", name: "PawN", realName: "Heo Won-seok", role: "Mid", era: "SSW / SSB", years: "2013-2014", status: "Retired" },
    { id: "imp", name: "imp", realName: "Gu Seung-bin", role: "ADC", era: "SSW", years: "2013-2014", status: "Retired" },
    { id: "mata", name: "Mata", realName: "Cho Se-hyeong", role: "Support", era: "SSW", years: "2013-2014", status: "Retired" },
    { id: "acorn", name: "Acorn", realName: "Choi Cheon-ju", role: "Top", era: "SSB", years: "2013-2014", status: "Retired" },
    { id: "spirit", name: "Spirit", realName: "Lee Da-yoon", role: "Jungle", era: "SSB", years: "2013-2014", status: "Retired" },
    { id: "dade", name: "Dade", realName: "Bae Eo-jin", role: "Mid", era: "SSB", years: "2013-2014", status: "Retired" },
    { id: "deft", name: "Deft", realName: "Kim Hyuk-kyu", role: "ADC", era: "SSB", years: "2013-2014", status: "Retired" },
    { id: "heart", name: "Heart", realName: "Lee Kwan-hyung", role: "Support", era: "SSB", years: "2013-2014", status: "Retired" },
    // Add more older Samsung players for "completeness" visual
    { id: "homme", name: "Homme", realName: "Yoon Sung-young", role: "Top", era: "MVP/SSO", years: "2012-2013", status: "Retired" },
];

export default function FullAlumniPage() {
    const { language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    const filteredPlayers = FULL_ROSTER_DB.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.realName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "All" || p.role.includes(roleFilter);
        return matchesSearch && matchesRole;
    });

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 font-mono">
            {/* Header */}
            <div className="container mx-auto px-4 mb-8">
                <Link
                    href="/team/alumni"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-6 text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={16} />
                    {language === "en" ? "Back to Featured" : "Quay lại Tiêu điểm"}
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tighter mb-2 flex items-center gap-3">
                            <Database className="text-gold" />
                            GEN.G / SAMSUNG ARCHIVE
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {language === "en" ? "Complete database of registered players (2013-Present)" : "Cơ sở dữ liệu đầy đủ các tuyển thủ đã đăng ký (2013-Nay)"}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800">
                            {FULL_ROSTER_DB.length}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                            {language === "en" ? "Total Records" : "Tổng Hồ Sơ"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="container mx-auto px-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder={language === "en" ? "Search player name..." : "Tìm tên tuyển thủ..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-gold/50 outline-none transition-colors"
                        />
                    </div>
                    <div className="flex bg-[#0A0A0A] border border-white/10 rounded-lg p-1">
                        {["All", "Top", "Jungle", "Mid", "ADC", "Support"].map(role => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-colors ${roleFilter === role
                                    ? "bg-gold text-black"
                                    : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="container mx-auto px-4">
                <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">IGN</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Real Name</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Era</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Years Active</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPlayers.length > 0 ? (
                                    filteredPlayers.map((p, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 text-xs text-gray-600 font-mono">{(i + 1).toString().padStart(3, '0')}</td>
                                            <td className="p-4">
                                                <span className="font-bold text-white group-hover:text-gold transition-colors">{p.name}</span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">{p.realName}</td>
                                            <td className="p-4 text-xs font-bold uppercase text-gray-500">{p.role}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${p.era.includes("SSW") ? "bg-white/10 border-white/20 text-white" :
                                                    p.era.includes("SSG") ? "bg-blue-900/20 border-blue-500/20 text-blue-400" :
                                                        "bg-gold/5 border-gold/20 text-gold"
                                                    }`}>
                                                    {p.era}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-gray-400 font-mono">{p.years}</td>
                                            <td className="p-4 text-right">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${p.status === "Active" ? "text-green-500" :
                                                    p.status === "Retired" ? "text-gray-600" :
                                                        "text-gray-400"
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-gray-500 italic">
                                            No players found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
