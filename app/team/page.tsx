"use client";

import { motion } from "framer-motion";
import { Crown, ArrowRight, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";


// Role Icons SVG Components
const MidLanerIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <g>
      <path fillRule="evenodd" fill="#555d64" d="M305.755,199.6L352.9,152.569l0.039,200.372h-200L200,305.882H305.883Zm-58.7-152.541L199.753,94.1H94.1L94.117,200,47.065,246.79V47.068Z"></path>
      <path fillRule="evenodd" fill="#c79e57" d="M105.882,352.941l247.06-247.059V47.059H294.118L47.059,294.117v58.824h58.823Z"></path>
    </g>
  </svg>
);

const TopLanerIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <g>
      <path fillRule="evenodd" fill="#555d64" d="M247.059,247.059V164.706H164.706v82.353h82.353ZM352.936,352.933V82.537l-47.054,46.875v176.47l-176.309.019L82.532,352.933h270.4Z"></path>
      <path fillRule="evenodd" fill="#c79e57" d="M329.946,47.1l-59.358,58.787H105.882V270.588L47.1,329.945,47.059,47.059Z"></path>
    </g>
  </svg>
);

const JungleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <path fillRule="evenodd" fill="#c79e57" d="M294.118,35.294c-25.034,38.865-60.555,80.6-81.959,134.935,8.81,21.507,17.469,42.872,23.135,65.065,5.088-12.873,5.51-23.4,11.765-35.294C247,141.447,268.9,97.375,294.118,35.294m-141.177,200c-17.5-52.79-56-81.948-105.882-105.882,45.506,36.9,52.025,88.47,58.823,141.176l44.035,38.96c17.313,18.887,44.514,48.694,50.083,55.158,53.589-111.119-39.6-244.759-94.118-329.412C137.292,112.618,161.376,156.962,152.941,235.294Zm94.118,58.824c1.1,9.873-.075,13.739,0,23.529l47.059-47.059c6.8-52.706,13.318-104.28,58.823-141.176C290.728,159.259,260.4,221.817,247.059,294.118Z"></path>
  </svg>
);

const ADCIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <g>
      <path fillRule="evenodd" fill="#555d64" d="M152.942,152.941v82.353h82.352V152.941H152.942ZM47.064,47.067v270.4L93.6,270.436l0.52-176.318,176.31-.019,47.041-47.032H47.064Z"></path>
      <path fillRule="evenodd" fill="#c79e57" d="M70.054,352.905l59.357-58.787H294.118V129.412L352.9,70.055l0.039,282.886Z"></path>
    </g>
  </svg>
);

const SupportIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <path fillRule="evenodd" fill="#c8aa6e" d="M317.647,200l-35.294-47.059h23.53c41.584,0,94.117-47.058,94.117-47.058H270.588l-35.294,35.293,23.53,82.354ZM245.026,35.3H153.673l-12.5,23.523L200,129.412l58.823-70.588L245.026,35.3m-33.262,117.64L200,164.706l-11.765-11.765L152.941,329.412,200,364.706l47.059-35.294ZM82.353,200l35.294-47.059H94.118C52.533,152.941,0,105.883,0,105.883H129.412l35.294,35.293-23.53,82.354Z"></path>
  </svg>
);

// Helper function to get role icon
const getRoleIcon = (roleKey: string, className: string = "w-4 h-4") => {
  switch (roleKey) {
    case "mid":
      return <MidLanerIcon className={className} />;
    case "top":
      return <TopLanerIcon className={className} />;
    case "jungle":
      return <JungleIcon className={className} />;
    case "adc":
      return <ADCIcon className={className} />;
    case "support":
      return <SupportIcon className={className} />;
    default:
      return <MidLanerIcon className={className} />;
  }
};

const players = [
  { 
    id: "kiin",
    name: "Kiin", 
    realName: "Kim Gi-in",
    realNameUpper: "KIIN KIM",
    roleKey: "top", 
    flag: "🇰🇷", 
    animalIcon: "🐸",
    color: "from-gold/30",
    number: "10",
    champions: ["K'Sante", "Aatrox", "Gwen"],
    stats: { kda: "4.2", cs: "8.9", games: "142" },
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213448905_kiin.png"
  },
  { 
    id: "canyon",
    name: "Canyon", 
    realName: "Kim Geon-bu",
    realNameUpper: "GUNBU KIM",
    roleKey: "jungle", 
    flag: "🇰🇷", 
    animalIcon: "🐻‍❄️",
    color: "from-gold/30",
    number: "23",
    champions: ["Nidalee", "Lee Sin", "Graves"],
    stats: { kda: "5.1", cs: "6.2", games: "156" },
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212470925_canyon.png"
  },
  { 
    id: "chovy",
    name: "Chovy", 
    realName: "Jeong Ji-hoon",
    realNameUpper: "JIHUN JUNG",
    roleKey: "mid", 
    flag: "🇰🇷", 
    animalIcon: "🐱",
    color: "from-gold/30",
    number: "7",
    champions: ["Cassiopeia", "Galio", "Taliyah"],
    stats: { kda: "8.2", cs: "10.1", games: "168" },
    featured: true,
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212535327_chovu.png"
  },
  { 
    id: "ruler",
    name: "Ruler", 
    realName: "Park Jae-hyuk",
    realNameUpper: "JAEHYEOK PARK",
    roleKey: "adc", 
    flag: "🇰🇷", 
    animalIcon: "🐶",
    color: "from-gold/30",
    number: "1",
    champions: ["Lucian", "Ezreal", "Zeri"],
    stats: { kda: "7.1", cs: "10.5", games: "245" },
    featured: true,
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213914983_ruler.png"
  },
  { 
    id: "duro",
    name: "Duro", 
    realName: "Joo Min-kyu",
    realNameUpper: "MINKYU JU",
    roleKey: "support", 
    flag: "🇰🇷", 
    animalIcon: "🐰",
    color: "from-gold/30",
    number: "33",
    champions: ["Nautilus", "Alistar", "Rakan"],
    stats: { kda: "4.5", cs: "1.1", games: "98" },
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213092149_duro.png"
  },
  {
    id: "genrang",
    name: "Genrang",
    realName: "Genrang",
    roleKey: "mascot",
    flag: "🎮",
    color: "from-gold/30",
    favorites: ["Xách nước", "Bổ Cam", "Content Creator"],
    image: "/images/Genrang.png"
  },
];

const coaches = [
  {
    id: "ryu",
    name: "Ryu",
    realName: "Ryu Sang-wook",
    roleKey: "headCoach",
    flag: "🇰🇷",
    color: "from-gold/30",
    image: "/images/coaches/ryu.png"
  },
  {
    id: "lyn",
    name: "Lyn",
    realName: "Kim Da-bin",
    roleKey: "coach",
    flag: "🇰🇷",
    color: "from-gold/30",
    image: "/images/coaches/lyn.png"
  },
];

export default function TeamPage() {
  const { language, t } = useLanguage();

  const getRoleLabel = (roleKey: string) => {
    const roles = t.team.roles as Record<string, string>;
    return roles[roleKey] || roleKey;
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/GenG_Cup2025.webp"
            alt="Gen.G Cup 2025"
            className="w-full h-full object-cover object-top"
            style={{ objectPosition: 'center 20%' }}
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
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 
                          rounded-full px-4 py-2 mb-6">
              <Crown className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">{t.team.badge}</span>
            </div>
            <h1 className="font-heading text-5xl sm:text-7xl mb-4">
              <span className="text-gradient-gold">{t.team.title}</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t.team.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Players Grid */}
      <section className="section-divider relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
                className={`card-dark card-glow relative overflow-hidden group cursor-pointer
                          bg-gradient-to-br ${player.color} to-transparent
                          ${player.featured ? 'md:col-span-2 lg:col-span-1 ring-2 ring-gold/50 shadow-gold-glow' : ''}
                          backdrop-blur-sm`}
              >
                {/* Gen.G Logo Background */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none">
                  <img
                    src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png"
                    alt="Gen.G Logo"
                    className="w-32 h-32 object-contain"
                  />
                </div>

                {/* Franchise Player Badge */}
                {player.featured && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-gold text-black text-xs px-3 py-1 rounded-full font-bold
                                   flex items-center gap-1 shadow-lg">
                      <Crown size={12} /> {t.team.franchisePlayer}
                    </span>
                  </div>
                )}

                {/* Player Avatar */}
                <div className="aspect-square max-w-[200px] mx-auto bg-black-charcoal rounded-xl mb-6
                              flex items-center justify-center relative overflow-hidden z-10
                              shadow-2xl shadow-black/50 group-hover:shadow-gold/20">
                  {player.image ? (
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`text-8xl group-hover:scale-110 transition-transform duration-500 relative z-10 ${player.image ? 'hidden' : ''}`}>
                    👤
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Player Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl">{player.flag}</span>
                    <h3 className="font-heading text-3xl text-white group-hover:text-gold transition-colors flex items-center gap-2">
                      {player.name}
                      {player.animalIcon && <span className="text-2xl">{player.animalIcon}</span>}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{player.realName}</p>
                  
                  <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full mb-6">
                    {player.roleKey !== "mascot" && getRoleIcon(player.roleKey, "w-4 h-4")}
                    <span className="text-gold font-semibold">{getRoleLabel(player.roleKey)}</span>
                  </div>

                  {/* Champions or Favorites */}
                  <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    {player.favorites ? (
                      player.favorites.map((fav: string, idx: number) => (
                        <span key={idx} className="bg-black-charcoal px-3 py-1 rounded text-xs text-gray-400">
                          {language === "en" 
                            ? fav === "Xách nước" ? "Water Carrier"
                            : fav === "Bổ Cam" ? "Orange Cutter"
                            : fav === "Content Creator" ? "Content Creator"
                            : fav
                            : fav}
                        </span>
                      ))
                    ) : (
                      player.champions?.map((champ) => (
                        <span key={champ} className="bg-black-charcoal px-3 py-1 rounded text-xs text-gray-400">
                          {champ}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-transparent 
                              group-hover:border-gold/50 rounded-xl transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-heading text-3xl text-white mb-2">
              {language === "en" ? "COACHING STAFF" : "BAN HUẤN LUYỆN"}
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {coaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (players.length + index) * 0.1 }}
                whileHover={{ y: -10 }}
                className={`card-dark relative overflow-hidden group cursor-pointer
                          bg-gradient-to-br ${coach.color} to-transparent`}
              >
                {/* Gen.G Logo Background */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-500 flex items-center justify-center">
                  <img
                    src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png"
                    alt="Gen.G Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Coach Avatar */}
                <div className="aspect-square max-w-[200px] mx-auto bg-black-charcoal rounded-xl mb-6
                              flex items-center justify-center relative overflow-hidden z-10">
                  {coach.image ? (
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`text-8xl group-hover:scale-110 transition-transform duration-500 relative z-10 ${coach.image ? 'hidden' : ''}`}>
                    👤
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Coach Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl">{coach.flag}</span>
                    <h3 className="font-heading text-3xl text-white group-hover:text-gold transition-colors">
                      {coach.name}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{coach.realName}</p>
                  
                  <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full mb-6">
                    <Users size={16} className="text-gold" />
                    <span className="text-gold font-semibold">{getRoleLabel(coach.roleKey)}</span>
                  </div>
                </div>

                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-transparent 
                              group-hover:border-gold/50 rounded-xl transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More Teams Section */}
      <section className="py-16 bg-black-light border-t border-black-charcoal">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl text-white mb-4">
              {language === "en" ? "EXPLORE MORE" : "KHÁM PHÁ THÊM"}
            </h2>
            <p className="text-gray-400">
              {language === "en" 
                ? "Discover the rich history and legendary players of our organization"
                : "Khám phá lịch sử phong phú và những tuyển thủ huyền thoại của tổ chức"
              }
            </p>
          </motion.div>

          <div className="flex justify-center max-w-2xl mx-auto">
            {/* Alumni Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="w-full"
            >
              <Link 
                href="/team/alumni"
                className="card-dark flex flex-col items-center text-center p-8 group cursor-pointer h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4
                              group-hover:bg-blue-500/30 transition-colors">
                  <Calendar size={32} className="text-blue-400" />
                </div>
                <h3 className="font-heading text-2xl text-white mb-2 group-hover:text-gold transition-colors">
                  {language === "en" ? "FORMER PLAYERS" : "CỰU TUYỂN THỦ"}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {language === "en" 
                    ? "From Samsung to Gen.G, see all players who wore our colors"
                    : "Từ Samsung đến Gen.G, xem tất cả tuyển thủ đã khoác áo chúng ta"
                  }
                </p>
                <span className="text-gold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t.team.viewAlumni} <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
