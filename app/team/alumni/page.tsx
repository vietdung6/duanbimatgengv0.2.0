"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Former players data - Samsung, Gen.G era
const alumniByEra = [
  {
    era: "Gen.G",
    eraKr: "Gen.G",
    years: "2018-Present",
    players: [
      { name: "Kiin", realName: "Kim Gi-in", role: "Top", years: "2024-Present", achievements: ["MSI 2024", "LCK Spring 2024", "MSI 2025", "EWC 2025", "LCK Regular 2025"], image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213448905_kiin.png" },
      { name: "Canyon", realName: "Kim Geon-bu", role: "Jungle", years: "2024-Present", achievements: ["MSI 2024", "LCK Spring 2024", "MSI 2025", "EWC 2025", "LCK Regular 2025"], image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212470925_canyon.png" },
      { name: "Chovy", realName: "Jeong Ji-hoon", role: "Mid", years: "2022-Present", achievements: ["LCK Summer 2022", "LCK Spring 2023", "LCK Summer 2023", "MSI 2024", "LCK Spring 2024", "MSI 2025", "EWC 2025", "LCK Regular 2025"], image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212535327_chovu.png" },
      { name: "Ruler", realName: "Park Jae-hyuk", role: "ADC", years: "2018-2022, 2025-Present", achievements: ["LCK Summer 2022", "MSI 2025", "EWC 2025", "LCK Regular 2025"], image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213914983_ruler.png" },
      { name: "Duro", realName: "Joo Min-kyu", role: "Support", years: "", achievements: ["MSI 2025", "EWC 2025", "LCK Regular 2025"], image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213092149_duro.png" },
      { name: "Lehends", realName: "Son Si-woo", role: "Support", years: "2021-2022, 2023-2024", achievements: ["LCK 2022 Summer", "LCK 2024 Spring", "MSI 2024", "FMVP MSI 2024"], image: "https://game8.vn/media/202407/images/gen-lehends-lck.jpg" },
      { name: "Peyz", realName: "Kim Su-hwan", role: "ADC", years: "2023-2024", achievements: ["LCK 2023 Spring", "LCK 2023 Summer", "LCK 2024 Spring", "MSI 2024"], image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/GEN_Peyz_2023.jpg" },
      { name: "Peanut", realName: "Han Wang-ho", role: "Jungle", years: "2019, 2022-2023", achievements: ["LCK 2022 Summer", "LCK 2023 Spring", "LCK 2023 Summer"], image: "https://cdn-img.thethao247.vn/origin_640x0/storage/files/haibui/2022/02/11/i1548951226478984-1644561368.jpeg" },
      { name: "Doran", realName: "Choi Hyeon-joon", role: "Top", years: "2022-2023", achievements: ["LCK 2022 Summer", "LCK 2023 Spring", "LCK 2023 Summer"], image: "https://img.dianjingfeng.com/m00/6d/83/9ff65a21a1ca68fbc07088f0adeb6ce2.png" },
      { name: "Delight", realName: "Lee Ji-hoon", role: "Support", years: "2023", achievements: ["LCK 2023 Spring", "LCK 2023 Summer", "LCK 2024 Spring", "MSI 2024"], image: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/delight_lol_c57af9a8fb.png" },
      { name: "Clid", realName: "Kim Tae-min", role: "Jungle", years: "2020-2021", achievements: ["LCK Spring 2020 Finals"], image: "https://geng.gg/cdn/shop/articles/clid-480x320.jpg?v=1617192837" },
      { name: "BDD", realName: "Gwak Bo-seong", role: "Mid", years: "2020-2021", achievements: ["LCK Spring 2020 Finals"], image: "https://cdn.oneesports.vn/cdn-data/wp-content/uploads/sites/4/2020/02/lmht-lck-geng-b%C4%91.jpeg" },
      { name: "Rascal", realName: "Kim Kwang-hee", role: "Top", years: "2020-2021", achievements: ["LCK Spring 2020 Finals"], image: "https://geng.gg/cdn/shop/articles/o1593102377388493.jpg?v=1617193180&width=3000" },
      { name: "Life", realName: "Kim Jeong-min", role: "Support", years: "2020-2022", achievements: ["LCK 2021 Spring Finals", "LCK 2020 Spring Finals", "KeSPA Cup 2018 Finals"], image: "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/media/images/2018/12/25/life-1545706108516856126616-crop-1545706112105636867300.jpeg" },
    ]
  },
  {
    era: "Samsung Galaxy",
    eraKr: "Samsung Galaxy",
    years: "2015-2017",
    players: [
      { name: "Ambition", realName: "Kang Chan-yong", role: "Jungle", years: "2015-2017", achievements: ["Worlds 2017 Champion (Jarvan IV)"], worldChamp: true, image: "👑" },
      { name: "Haru", realName: "Kang Min-seung", role: "Jungle", years: "2017", achievements: ["Worlds 2017 Champion (Ezreal)"], worldChamp: true, image: "👑" },
      { name: "Crown", realName: "Lee Min-ho", role: "Mid", years: "2015-2017", achievements: ["Worlds 2017 Champion (Taliyah)"], worldChamp: true, image: "👑" },
      { name: "CuVee", realName: "Lee Seong-jin", role: "Top", years: "2015-2017", achievements: ["Worlds 2017 Champion (Gnar)"], worldChamp: true, image: "👑" },
      { name: "CoreJJ", realName: "Jo Yong-in", role: "Support", years: "2016-2017", achievements: ["Worlds 2017 Champion (Rakan)"], worldChamp: true, image: "👑" },
      { name: "Ruler", realName: "Park Jae-hyuk", role: "ADC", years: "2016-2017", achievements: ["Worlds 2017 Champion (Xayah)", "Worlds 2016 Finalist"], worldChamp: true, image: "/images/players/Rulerssg.png" },
      { name: "Wraith", realName: "Kwon Ji-min", role: "Support", years: "2015-2016", achievements: [], image: "🎮" },
    ]
  },
  {
    era: "Samsung White / Blue",
    eraKr: "Samsung White / Blue",
    years: "2013-2014",
    players: [
      { name: "Mata", realName: "Cho Se-hyeong", role: "Support", years: "2013-2014", achievements: ["Worlds 2014 Champion (Thresh)", "Worlds 2014 MVP"], worldChamp: true, legend: true, image: "👑" },
      { name: "imp", realName: "Gu Seung-bin", role: "ADC", years: "2013-2014", achievements: ["Worlds 2014 Champion (Twitch)"], worldChamp: true, legend: true, image: "👑" },
      { name: "PawN", realName: "Heo Won-seok", role: "Mid", years: "2013-2014", achievements: ["Worlds 2014 Champion (Talon)"], worldChamp: true, legend: true, image: "👑" },
      { name: "DanDy", realName: "Choi In-kyu", role: "Jungle", years: "2013-2014", achievements: ["Worlds 2014 Champion (Rengar)"], worldChamp: true, legend: true, image: "👑" },
      { name: "Looper", realName: "Jang Hyeong-seok", role: "Top", years: "2013-2014", achievements: ["Worlds 2014 Champion (Singed)"], worldChamp: true, image: "👑" },
      { name: "Dade", realName: "Bae Eo-jin", role: "Mid", years: "2013-2014", achievements: ["OGN Spring 2014", "2x OGN MVP"], legend: true, image: "⭐" },
      { name: "Deft", realName: "Kim Hyuk-kyu", role: "ADC", years: "2013-2014", achievements: ["OGN Spring 2014"], legend: true, image: "⭐" },
      { name: "Heart", realName: "Lee Kwan-hyung", role: "Support", years: "2013-2014", achievements: ["OGN Spring 2014"], image: "🎮" },
      { name: "Spirit", realName: "Lee Da-yoon", role: "Jungle", years: "2013-2014", achievements: ["OGN Spring 2014"], image: "🎮" },
      { name: "Acorn", realName: "Choi Cheon-ju", role: "Top", years: "2013-2014", achievements: ["OGN Spring 2014"], image: "🎮" },
    ]
  },
];

export default function AlumniPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            href="/team" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            {language === "en" ? "Back to Current Roster" : "Quay lại Đội hình hiện tại"}
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 
                          rounded-full px-4 py-2 mb-6">
              <Calendar size={16} className="text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">{t.alumni.badge}</span>
            </div>
            
            <h1 className="font-heading text-5xl sm:text-6xl mb-4">
              <span className="text-gradient-gold">{t.alumni.title}</span>
            </h1>
            
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t.alumni.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Alumni by Era */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {alumniByEra.map((eraData, eraIndex) => (
            <motion.div
              key={eraData.era}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: eraIndex * 0.1 }}
              className="mb-16"
            >
              {/* Era Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-1 h-12 rounded-full ${
                  eraData.era.includes("White") ? "bg-gradient-to-b from-yellow-400 to-yellow-600" :
                  eraData.era.includes("Samsung Galaxy") ? "bg-gradient-to-b from-blue-400 to-blue-600" :
                  eraData.era.includes("KSV") ? "bg-gradient-to-b from-purple-400 to-purple-600" :
                  "bg-gradient-to-b from-gold to-gold-dark"
                }`} />
                <div>
                  <h2 className="font-heading text-3xl text-white">{eraData.era}</h2>
                  <p className="text-gray-400 text-sm">{eraData.years}</p>
                </div>
              </div>

              {/* Players Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {eraData.players.map((player, playerIndex) => (
                  <motion.div
                    key={`${eraData.era}-${player.name}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: playerIndex * 0.05 }}
                    whileHover={{ y: -5 }}
                    className={`card-dark relative overflow-hidden ${
                      player.worldChamp ? "border-yellow-500/30" : ""
                    }`}
                  >
                    {/* World Champion badge */}
                    {player.worldChamp && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded font-bold">
                          👑 {t.alumni.worldChampion}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden relative
                                    ${player.worldChamp
                                      ? "bg-gradient-to-br from-yellow-500/20 to-yellow-700/20"
                                      : "bg-black-charcoal"}`}>
                        {player.image?.startsWith('http') || player.image?.startsWith('/') ? (
                          <img
                            src={player.image}
                            alt={player.name}
                            className="w-full h-full object-cover relative z-10"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<span class="text-3xl">🎮</span>';
                              }
                            }}
                          />
                        ) : (
                          <span className="text-3xl relative z-10">{player.image}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-heading text-xl ${
                          player.worldChamp ? "text-yellow-400" : "text-white"
                        }`}>
                          {player.name}
                        </h3>
                        <p className="text-gray-500 text-xs truncate">{player.realName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gold text-xs">{player.role}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400 text-xs">{player.years}</span>
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {player.achievements.map((achievement, i) => (
                        <span 
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded ${
                            achievement.includes("Worlds") || achievement.includes("MVP") || achievement.includes("FMVP")
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-gray-700/50 text-gray-400"
                          }`}
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>

                    {/* Note if exists */}
                    {'note' in player && typeof player.note === 'string' && (
                      <p className="mt-2 text-xs text-green-400 italic">
                        ✓ {player.note}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <Link href="/team" className="btn-outline-gold inline-flex items-center justify-center gap-2">
              <ArrowLeft size={18} />
              {language === "en" ? "Back to Current Roster" : "Quay lại Đội hình hiện tại"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

