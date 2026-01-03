"use client";

import { motion } from "framer-motion";
import { Crown, ArrowRight, Users, Calendar, Instagram } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getCLRoster } from "@/lib/data/players";


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

const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
    champions: ["K'Sante", "Aatrox", "Gwen"],
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213448905_kiin.png",
    socials: {
      twitter: "https://twitter.com/kiin_99",
      instagram: "https://www.instagram.com/lol_kiin/"
    }
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
    champions: ["Nidalee", "Lee Sin", "Graves"],
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212470925_canyon.png",
    socials: {
      instagram: "https://www.instagram.com/lol_canyon/"
    }
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
    champions: ["Cassiopeia", "Smolder", "Aurelion Sol"],
    featured: true,
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212535327_chovu.png",
    socials: {
      twitter: "https://twitter.com/j1hu1V_chovy",
      instagram: "https://www.instagram.com/chovy_jihun/"
    }
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
    champions: ["Lucian", "Ezreal", "Zeri"],
    featured: true,
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213914983_ruler.png",
    socials: {
      twitter: "https://www.x.com/RulereluR",
      instagram: "https://www.instagram.com/lol_ruler98/"
    }
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
    champions: ["Nautilus", "Alistar", "Rakan"],
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213092149_duro.png",
    socials: {
      twitter: "https://www.x.com/Duro0204",
      instagram: "https://instagram.com/kr_duro"
    }
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
    id: "lyn",
    name: "Lyn",
    realName: "Kim Da-bin",
    roleKey: "coach",
    flag: "🇰🇷",
    color: "from-gold/30",
    image: "/images/coaches/lyn.png"
  },
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
    id: "nova",
    name: "Nova",
    realName: "Park Chan-ho",
    roleKey: "coach",
    flag: "🇰🇷",
    color: "from-gold/30",
    image: "/images/coaches/Nova.webp"
  },
];

export default function TeamPage() {
  const { language, t } = useLanguage();
  const clPlayers = getCLRoster();

  const getRoleLabel = (roleKey: string) => {
    const roles = t.team.roles as Record<string, string>;
    return roles[roleKey] || roleKey;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="font-heading text-3xl text-white mb-2">
              {language === "en" ? "MAIN ROSTER" : "ĐỘI HÌNH CHÍNH"}
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden
                          ${player.featured ? 'md:col-span-2 lg:col-span-1 ring-1 ring-gold/50 shadow-[0_0_30px_-5px_rgba(170,129,54,0.3)]' : 'border border-white/5 hover:border-gold/30'}
                          bg-[#080808] transition-all duration-500 hover:-translate-y-2`}
              >
                {/* Background Gradient & Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${player.color} to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/30 transition-all duration-500" />

                {/* Large Gen.G Logo Watermark */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  <img
                    src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png"
                    alt="Gen.G Logo"
                    className="w-[120%] h-[120%] object-contain opacity-[0.1] group-hover:opacity-[0.15] transition-opacity duration-500 transform -rotate-12 scale-150"
                  />
                </div>

                {/* Top Info Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl filter drop-shadow-lg transform -rotate-12">{player.animalIcon}</span>
                    {player.featured && (
                      <div className="bg-gold/20 backdrop-blur-md border border-gold/30 px-2 py-0.5 rounded text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <Crown size={10} /> ACE
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 group-hover:border-gold/50 transition-colors ${player.roleKey === 'mascot' ? 'px-3 py-1.5' : 'p-2'}`}>
                      {player.roleKey !== "mascot" ? (
                        getRoleIcon(player.roleKey, "w-6 h-6 text-gray-300 group-hover:text-gold transition-colors")
                      ) : (
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          {language === "en" ? "Mascot" : "Linh vật"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Player Image Area */}
                <div className="relative h-[22rem] w-full flex items-end justify-center overflow-hidden">
                  {player.image ? (
                    <img
                      src={player.image}
                      alt={player.name}
                      className="relative z-10 h-[110%] w-auto object-cover object-top transform group-hover:scale-105 group-hover:translate-y-2 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`text-9xl text-gray-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ${player.image ? 'hidden' : ''}`}>
                    👤
                  </div>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent z-10" />
                </div>

                {/* Content Section */}
                <div className="relative z-20 px-6 pb-6 -mt-12">
                  {/* Name & Title */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl">{player.flag}</span>
                      <h3 className="font-heading text-5xl text-white italic font-bold tracking-tighter group-hover:text-gold transition-colors duration-300">
                        {player.name}
                      </h3>
                    </div>
                    <p className="text-gray-500 font-medium tracking-wide uppercase text-sm pl-8 border-l-2 border-gold/30">
                      {player.realNameUpper || player.realName}
                    </p>
                  </div>

                  {/* Footer: Champions & Socials */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Champions or Favorites */}
                    <div className="flex flex-wrap gap-2 max-w-[70%]">
                      {player.favorites ? (
                        player.favorites.map((fav: string, idx: number) => (
                          <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-gray-300">
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
                          <span key={champ} className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-gray-300">
                            {champ}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Social Media Links */}
                    {player.socials && (
                      <div className="flex gap-2">
                        {player.socials.twitter && (
                          <a
                            href={player.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <XIcon className="w-3 h-3" />
                          </a>
                        )}
                        {player.socials.instagram && (
                          <a
                            href={player.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Instagram size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {coaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (players.length + index) * 0.1 }}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden
                          border border-white/5 hover:border-gold/30
                          bg-[#080808] transition-all duration-500 hover:-translate-y-2`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${coach.color} to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                {/* Large Gen.G Logo Watermark */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  <img
                    src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png"
                    alt="Gen.G Logo"
                    className="w-[120%] h-[120%] object-contain opacity-[0.1] group-hover:opacity-[0.15] transition-opacity duration-500 transform -rotate-12 scale-150"
                  />
                </div>

                {/* Top Info Bar */}
                <div className="absolute top-0 right-0 p-4 z-20">
                  <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 group-hover:border-gold/50 transition-colors flex items-center gap-2">
                    <Users size={14} className="text-gold" />
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{getRoleLabel(coach.roleKey)}</span>
                  </div>
                </div>

                {/* Coach Image Area */}
                <div className="relative h-[20rem] w-full flex items-end justify-center overflow-hidden">
                  {coach.image ? (
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="relative z-10 h-[105%] w-auto object-cover object-top transform group-hover:scale-105 group-hover:translate-y-2 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`text-9xl text-gray-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ${coach.image ? 'hidden' : ''}`}>
                    👤
                  </div>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent z-10" />
                </div>

                {/* Content Section */}
                <div className="relative z-20 px-6 pb-6 -mt-10 text-center">
                  <div className="mb-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-xl">{coach.flag}</span>
                      <h3 className="font-heading text-4xl text-white italic font-bold tracking-tighter group-hover:text-gold transition-colors duration-300">
                        {coach.name}
                      </h3>
                    </div>
                    <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                      {coach.realName}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LCK CL Section */}
      <section className="py-12 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-heading text-3xl text-white mb-2">
              {language === "en" ? "LCK CL ROSTER" : "ĐỘI HÌNH LCK CL"}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {clPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer rounded-2xl overflow-hidden border border-white/5 hover:border-gold/30 bg-[#080808] transition-all duration-500 hover:-translate-y-2"
              >
                {/* Background Gradient & Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${player.color || "from-gold/30"} to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/30 transition-all duration-500" />

                {/* Large Gen.G Logo Watermark */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  <img
                    src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png"
                    alt="Gen.G Logo"
                    className="w-[120%] h-[120%] object-contain opacity-[0.1] group-hover:opacity-[0.15] transition-opacity duration-500 transform -rotate-12 scale-150"
                  />
                </div>

                {/* Top Info Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
                  <div className="flex flex-col gap-1">
                    {player.animalIcon && <span className="text-4xl filter drop-shadow-lg transform -rotate-12">{player.animalIcon}</span>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 group-hover:border-gold/50 transition-colors p-2">
                      {getRoleIcon(player.roleKey, "w-6 h-6 text-gray-300 group-hover:text-gold transition-colors")}
                    </div>
                  </div>
                </div>

                {/* Player Image Area */}
                <div className="relative h-[22rem] w-full flex items-end justify-center overflow-hidden">
                  {player.image ? (
                    <img
                      src={player.image}
                      alt={player.name}
                      className="relative z-10 h-[110%] w-auto object-cover object-top transform group-hover:scale-105 group-hover:translate-y-2 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`text-9xl text-gray-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ${player.image && !player.image.includes('placeholder') ? 'hidden' : ''}`}>
                    👤
                  </div>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent z-10" />
                </div>

                {/* Content Section */}
                <div className="relative z-20 px-6 pb-6 -mt-12">
                  {/* Name & Title */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl">{player.flag}</span>
                      <h3 className="font-heading text-5xl text-white italic font-bold tracking-tighter group-hover:text-gold transition-colors duration-300">
                        {player.name}
                      </h3>
                    </div>
                    <p className="text-gray-500 font-medium tracking-wide uppercase text-sm pl-8 border-l-2 border-gold/30">
                      {player.realName?.toUpperCase()}
                    </p>
                  </div>

                  {/* Footer: Socials if available */}
                  <div className="flex items-center justify-end mt-4">
                    {player.socials && (
                      <div className="flex gap-2">
                        {player.socials.twitter && (
                          <a
                            href={player.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <XIcon className="w-3 h-3" />
                          </a>
                        )}
                        {player.socials.instagram && (
                          <a
                            href={player.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Instagram size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More Teams Section */}
      <section className="py-16 bg-black border-t border-white/10">
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
