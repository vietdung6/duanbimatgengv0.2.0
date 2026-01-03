"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, ArrowRight, Star, Flame } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { AuthUser } from "@/lib/auth";
import { LoginCheck } from "@/components/shared/LoginCheck";

interface LeaderboardResponse {
  users: Array<Pick<AuthUser, "id" | "displayName" | "username" | "email" | "points">>;
}

export default function FanZonePage() {
  return (
    <LoginCheck>
      <FanZoneContent />
    </LoginCheck>
  );
}

function FanZoneContent() {
  const { t, language } = useLanguage();

  const [leaderboard, setLeaderboard] = useState<
    Array<Pick<AuthUser, "id" | "displayName" | "username" | "email" | "points">>
  >([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch("/api/fan/leaderboard", { cache: "no-store" });
        if (!res.ok) {
          setLoadingLeaderboard(false);
          return;
        }
        const data = (await res.json()) as LeaderboardResponse;
        setLeaderboard(data.users || []);
      } finally {
        setLoadingLeaderboard(false);
      }
    }

    void loadLeaderboard();
  }, []);

  const fanZoneItems = [
    {
      title: language === "en" ? "Church of Chovy" : "Đền Thờ Chovy",
      description: language === "en" 
        ? "Light candles and receive blessings from the HIGH PRIEST. A fun interactive minigame!"
        : "Thắp nến và nhận lời chúc phúc từ giáo chủ 'Vinh dọn lúa'. Trò chơi tương tác thú vị!",
      icon: "⛩️",
      href: "/fan-zone/church",
      color: "from-gold/30",
      badge: language === "en" ? "POPULAR" : "PHỔ BIẾN",
      badgeColor: "bg-gold text-black",
    },
    {
      title: language === "en" ? "Gen.G Quiz" : "Gen.G Quiz",
      description: language === "en"
        ? "Test your knowledge about your favorite team. Are you a true fan?"
        : "Thử thách kiến thức về đội tuyển yêu thích. Bạn là fan thực sự?",
      icon: "🧠",
      href: "/fan-zone/quiz",
      color: "from-blue-500/30",
      badge: language === "en" ? "COMING SOON" : "SẮP CÓ",
      badgeColor: "bg-blue-500/20 text-blue-400",
    },
    {
      title: language === "en" ? "Viewing Party" : "Viewing Party",
      description:
        language === "en"
          ? "Watch Gen.G matches together with other fans (online viewing party)."
          : "Xem Gen.G thi đấu cùng nhau (online viewing party).",
      icon: "📺",
      href: "/fan-zone/viewing-party",
      color: "from-red-600/30",
      badge: language === "en" ? "NEW" : "MỚI",
      badgeColor: "bg-red-600 text-white animate-pulse",
    },
    {
      title: language === "en" ? "Community" : "Cộng Đồng",
      description: language === "en"
        ? "Join the Gen.G fan community. Share, discuss and connect!"
        : "Tham gia cộng đồng fan Gen.G. Chia sẻ, thảo luận và kết nối!",
      icon: "💬",
      href: "/fan-zone/community",
      color: "from-green-500/30",
    },
    {
      title: language === "en" ? "Genrang Pet" : "Nuôi em Genrang",
      description: language === "en"
        ? "Take care of Genrang, Gen.G's mascot! Feed, play and watch it grow!"
        : "Chăm sóc Genrang, linh vật của Gen.G! Cho ăn, chơi và xem nó lớn lên!",
      icon: "🐯",
      href: "/fan-zone/genrang",
      color: "from-orange-500/30",
      badge: language === "en" ? "COMING SOON" : "SẮP CÓ",
      badgeColor: "bg-orange-500/20 text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/591419253_122097488481146861_6634943771196527378_n.png?_nc_cat=108&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=RNna-54F2FIQ7kNvwFaAi3Y&_nc_oc=AdmvxBSeR2ByAfWrGxIRDbxRgHxcBuz-CpRnJvwWmhBf4xG_Ow6anIzTQCI5hQutZIY&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AjxaFD9Tke4-Jf3WZL9GfA&oh=00_AfmqHquauPsPW8nfm5uVtJZnXMp8OBitxc0OoYDsuMUc-w&oe=6940E09E"
            alt="Genrang Fan Zone Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/50 
                          rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 backdrop-blur-sm">
              <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
              <span className="text-gold text-xs sm:text-sm font-medium">{t.fanZone.badge}</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 px-2">
              <span className="text-gradient-gold">{t.fanZone.title}</span>
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base md:text-lg px-2">
              {t.fanZone.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {fanZoneItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Link href={item.href}>
                  <div className={`card-dark relative overflow-hidden group cursor-pointer min-h-[180px] sm:min-h-[200px]
                                bg-gradient-to-br ${item.color} to-transparent p-4 sm:p-6`}>
                    {/* Badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                      <span className={`${item.badgeColor} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-bold`}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="relative z-10">
                      {item.href === "/fan-zone/genrang" ? (
                        <div className="mb-3 sm:mb-4 flex justify-start">
                          <img 
                            src="/images/Genrang.png"
                            alt="Genrang"
                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <span className="text-4xl sm:text-5xl hidden">{item.icon}</span>
                        </div>
                      ) : (
                        <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">{item.icon}</span>
                      )}
                      <h3 className="font-heading text-xl sm:text-2xl text-white group-hover:text-gold 
                                   transition-colors mb-1.5 sm:mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">{item.description}</p>
                      <span className="text-gold font-semibold inline-flex items-center gap-1.5 sm:gap-2 
                                     group-hover:gap-2 sm:group-hover:gap-3 transition-all text-sm sm:text-base">
                        {language === "en" ? "Enter" : "Vào"} <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                      </span>
                    </div>

                    {/* Hover Border */}
                    <div className="absolute inset-0 border-2 border-transparent 
                                  group-hover:border-gold/50 rounded-xl transition-colors pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-6 sm:mb-8">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-gold mx-auto mb-3 sm:mb-4" />
              <h2 className="font-heading text-2xl sm:text-3xl text-gold mb-2 px-2">
                {language === "en" ? "TOP FANS LEADERBOARD" : "BẢNG XẾP HẠNG FAN"}
              </h2>
              <p className="text-gray-400 text-sm sm:text-base px-2">
                {language === "en" 
                  ? "Earn Gen.G Points through activities"
                  : "Kiếm Gen.G Points thông qua các hoạt động"}
              </p>
            </div>

            <div className="card-dark">
              {loadingLeaderboard ? (
                <div className="py-6 text-center text-gray-400 text-sm">
                  {language === "en" ? "Loading leaderboard..." : "Đang tải bảng xếp hạng..."}
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="py-6 text-center text-gray-400 text-sm">
                  {language === "en"
                    ? "No fans with points yet. Earn points to appear here!"
                    : "Chưa có fan nào có điểm. Hãy kiếm điểm để xuất hiện tại đây!"}
                </div>
              ) : (
                leaderboard.map((fan, i) => {
                  const name =
                    fan.displayName ||
                    fan.username ||
                    fan.email.split("@")[0];

                  return (
                    <motion.div
                      key={fan.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 ${
                        i < leaderboard.length - 1
                          ? "border-b border-black-charcoal"
                          : ""
                      } ${i < 3 ? "bg-gold/5" : ""}`}
                    >
                      {/* Rank */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading text-base sm:text-lg flex-shrink-0 ${
                          i === 0
                            ? "bg-yellow-500 text-black"
                            : i === 1
                            ? "bg-gray-400 text-black"
                            : i === 2
                            ? "bg-amber-700 text-white"
                            : "bg-black-charcoal text-gray-400"
                        }`}
                      >
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                      </div>

                      {/* Name */}
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-white text-sm sm:text-base truncate">
                          {name}
                        </p>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                          <Star
                            size={10}
                            className="sm:w-3 sm:h-3 text-gold flex-shrink-0"
                          />
                          <span className="truncate">
                            {language === "en"
                              ? "Gen.G Superfan"
                              : "Fan Cứng Gen.G"}
                          </span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-heading text-xl sm:text-2xl text-gold">
                          {fan.points.toLocaleString()}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {language === "en"
                            ? "Gen.G Points"
                            : "Điểm Gen.G"}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div className="text-center mt-4 sm:mt-6 px-2">
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                {language === "en"
                  ? "Earn points by participating in viewing parties, quizzes, and community activities!"
                  : "Kiếm điểm bằng cách tham gia viewing party, quiz và các hoạt động cộng đồng!"}
              </p>
              <button className="btn-outline-gold flex items-center gap-2 mx-auto text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6">
                <Flame size={16} className="sm:w-[18px] sm:h-[18px]" />
                {language === "en" ? "How to Earn Points" : "Cách Kiếm Điểm"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}


