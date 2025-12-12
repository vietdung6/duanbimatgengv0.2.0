"use client";

import { motion } from "framer-motion";
import { Gamepad2, Trophy, Brain, ArrowRight, Star, Flame } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FanZonePage() {
  const { t, language } = useLanguage();

  const fanZoneItems = [
    {
      title: language === "en" ? "Church of Chovy" : "Đền Thờ Chovy",
      description: language === "en" 
        ? "Light candles and receive blessings from the HIGH PRIEST. A fun interactive minigame!"
        : "Thắp nến và nhận lời chúc phúc từ giáo chủ 'Vinh dọn lúa'. Trò chơi tương tác thú vị!",
      icon: "⛩️",
      href: "/fan-zone/shrine",
      color: "from-gold/30",
      badge: language === "en" ? "POPULAR" : "PHỔ BIẾN",
      badgeColor: "bg-gold text-black",
    },
    {
      title: language === "en" ? "Prediction Game" : "Game Dự Đoán",
      description: language === "en"
        ? "Predict scores, MVP, First Blood... Correct predictions earn Gen.G Points!"
        : "Dự đoán tỉ số, MVP, First Blood... Đúng sẽ nhận điểm Gen.G Points!",
      icon: "🔮",
      href: "/fan-zone/predictions",
      color: "from-purple-500/30",
      badge: language === "en" ? "COMING SOON" : "SẮP CÓ",
      badgeColor: "bg-purple-500/20 text-purple-400",
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
      title: language === "en" ? "Community" : "Cộng Đồng",
      description: language === "en"
        ? "Join the Gen.G fan community. Share, discuss and connect!"
        : "Tham gia cộng đồng fan Gen.G. Chia sẻ, thảo luận và kết nối!",
      icon: "💬",
      href: "/fan-zone/community",
      color: "from-green-500/30",
    },
    {
      title: language === "en" ? "Genrang Pet" : "Thú Cưng Genrang",
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

  const leaderboard = [
    { rank: 1, name: "ChoviSimp2024", points: 15420, badge: "🥇" },
    { rank: 2, name: "GenGForever", points: 12850, badge: "🥈" },
    { rank: 3, name: "LCKFanatic", points: 11200, badge: "🥉" },
    { rank: 4, name: "MidLaneKing", points: 9800, badge: "" },
    { rank: 5, name: "GoldenTiger", points: 8650, badge: "" },
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
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/50 
                          rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Gamepad2 className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">{t.fanZone.badge}</span>
            </div>
            <h1 className="font-heading text-5xl sm:text-7xl mb-4">
              <span className="text-gradient-gold">{t.fanZone.title}</span>
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto text-lg">
              {t.fanZone.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {fanZoneItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Link href={item.href}>
                  <div className={`card-dark relative overflow-hidden group cursor-pointer min-h-[200px]
                                bg-gradient-to-br ${item.color} to-transparent`}>
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`${item.badgeColor} text-xs px-2 py-1 rounded font-bold`}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="relative z-10">
                      {item.href === "/fan-zone/genrang" ? (
                        <div className="mb-4 flex justify-start">
                          <img 
                            src="/images/Genrang.png"
                            alt="Genrang"
                            className="w-24 h-24 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <span className="text-5xl hidden">{item.icon}</span>
                        </div>
                      ) : (
                        <span className="text-5xl mb-4 block">{item.icon}</span>
                      )}
                      <h3 className="font-heading text-2xl text-white group-hover:text-gold 
                                   transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 mb-4">{item.description}</p>
                      <span className="text-gold font-semibold inline-flex items-center gap-2 
                                     group-hover:gap-3 transition-all">
                        {language === "en" ? "Enter" : "Vào"} <ArrowRight size={16} />
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <Trophy className="w-8 h-8 text-gold mx-auto mb-4" />
              <h2 className="font-heading text-3xl text-gold mb-2">
                {language === "en" ? "TOP FANS LEADERBOARD" : "BẢNG XẾP HẠNG FAN"}
              </h2>
              <p className="text-gray-400">
                {language === "en" 
                  ? "Earn Gen.G Points through activities"
                  : "Kiếm Gen.G Points thông qua các hoạt động"}
              </p>
            </div>

            <div className="card-dark">
              {leaderboard.map((fan, i) => (
                <motion.div
                  key={fan.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 ${
                    i < leaderboard.length - 1 ? 'border-b border-black-charcoal' : ''
                  } ${i < 3 ? 'bg-gold/5' : ''}`}
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading text-lg ${
                    i === 0 ? 'bg-yellow-500 text-black' :
                    i === 1 ? 'bg-gray-400 text-black' :
                    i === 2 ? 'bg-amber-700 text-white' :
                    'bg-black-charcoal text-gray-400'
                  }`}>
                    {fan.badge || fan.rank}
                  </div>

                  {/* Name */}
                  <div className="flex-grow">
                    <p className="font-semibold text-white">{fan.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star size={12} className="text-gold" />
                      <span>{language === "en" ? "Gen.G Superfan" : "Fan Cứng Gen.G"}</span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="font-heading text-2xl text-gold">{fan.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      {language === "en" ? "Gen.G Points" : "Điểm Gen.G"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm mb-4">
                {language === "en"
                  ? "Earn points by participating in predictions, quizzes, and community activities!"
                  : "Kiếm điểm bằng cách tham gia dự đoán, quiz và các hoạt động cộng đồng!"}
              </p>
              <button className="btn-outline-gold flex items-center gap-2 mx-auto">
                <Flame size={18} />
                {language === "en" ? "How to Earn Points" : "Cách Kiếm Điểm"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Daily Challenge */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black-light border border-gold/30 rounded-2xl p-8 text-center max-w-2xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-radial-gold opacity-10" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-gold/20 text-gold 
                            rounded-full px-4 py-2 mb-6">
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === "en" ? "DAILY CHALLENGE" : "THỬ THÁCH HÀNG NGÀY"}
                </span>
              </div>

              <h3 className="font-heading text-2xl text-white mb-4">
                {language === "en" ? "Today's Quiz" : "Quiz của ngày hôm nay"}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === "en"
                  ? "\"How many MVP titles has Chovy won in his LCK career?\""
                  : "\"Chovy đã có bao nhiêu danh hiệu MVP trong sự nghiệp LCK?\""}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                {(language === "en" 
                  ? ["2 times", "3 times", "4 times", "5 times"]
                  : ["2 lần", "3 lần", "4 lần", "5 lần"]
                ).map((answer, i) => (
                  <button
                    key={i}
                    className="bg-black-charcoal hover:bg-gold/20 hover:border-gold border border-transparent
                             rounded-lg py-3 px-4 text-white hover:text-gold transition-all"
                  >
                    {answer}
                  </button>
                ))}
              </div>

              <p className="text-gold text-sm">
                🎁 {language === "en" 
                  ? "Answer correctly to earn +100 Gen.G Points!"
                  : "Trả lời đúng nhận +100 Gen.G Points!"}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


