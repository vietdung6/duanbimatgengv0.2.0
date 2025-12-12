"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Trophy, Users, Star } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// EWC Logo SVG Component
const EWCLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" className={className}>
    <defs>
      <style>{`.cls-1 { fill: currentColor; stroke-width: 0px; }`}</style>
    </defs>
    <polygon className="cls-1" points="388.6 433.8 210.1 433.8 210.1 433.8 188.8 457.9 201.4 457.9 201.4 457.9 201.4 457.9 161.9 566.2 161.9 566.2 340.4 566.2 357.7 518.5 302.7 518.5 294.1 542.1 225.8 542.1 234.3 518.5 211.4 506 294.3 506 303 482 247.7 482 251.9 470.4 228.9 457.9 324.7 457.9 320.2 470.4 375.3 470.4 388.6 433.8"/>
    <polygon className="cls-1" points="824.8 470.4 838.1 433.8 659.6 433.8 638.3 457.9 650.9 457.9 611.4 566.2 789.9 566.2 807.2 518.5 752.2 518.5 743.6 542.1 675.3 542.1 701.4 470.4 678.4 457.9 774.2 457.9 769.7 470.4 824.8 470.4"/>
    <polygon className="cls-1" points="583.1 433.8 548.2 529.7 571 542.2 513 542.2 552.4 433.8 497.4 433.8 462.2 529.7 485.1 542.2 427.2 542.2 466.7 433.8 411.7 433.8 390.4 457.9 402.9 457.9 363.5 566.2 425 566.2 485.5 542.1 534.9 566.2 588.3 566.2 636.5 433.8 583.1 433.8"/>
  </svg>
);

// Tournament logos
const tournamentLogos = {
  lck: "https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2Flck-color-on-black.png",
};

// MSI Logo SVG Component
const MSILogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M21.611 12a9.61 9.61 0 0 0-9.61-9.61A9.61 9.61 0 0 0 2.39 12 9.61 9.61 0 0 0 12 21.61 9.61 9.61 0 0 0 21.61 12m-19.81 0C1.8 6.375 6.376 1.8 12 1.8c5.623 0 10.2 4.575 10.2 10.2S17.625 22.2 12 22.2C6.376 22.2 1.8 17.625 1.8 12m12.471 3.875c2.814-1.992 3.95-3.705 4.583-5.03.05.143.093.278.093.41 0 .48-.04.97-.081 1.445l-.004.044-.02.218c0 .022-.042.083-.103.13l-.204.152c-1.154.869-2.348 1.766-3.654 2.439-.181.095-.39.143-.61.192m-.014.576-.01-.007 2.945-.86-.06.044c-.34.232-.707.45-1.07.665-.268.159-.532.316-.78.474-.067.043-.162.091-.208.076-.06-.01-.384-.174-.658-.312zm-1.227.094c.32.185.648.35.996.525q.166.084.337.174c-.707.714-1.458 1.74-1.688 2.848-.144-.144-.271-.28-.271-.28s.09-.591.154-.798c.1-.323.19-.645.283-.979l.195-.688.029-.1-.09-.05-.07-.039-.34-.188-.158-.09c-.251-.14-.506-.284-.755-.436-1.554-.945-3.326-2.147-4.698-3.882-.697-.882-1.113-1.663-1.31-2.457-.053-.22-.025-.527.083-.84a6.6 6.6 0 0 1 1.48-2.442q.037-.04.088-.083a1.2 1.2 0 0 0-.034.246c-.003.213-.01.43-.016.641-.02.603-.039 1.226.027 1.835.156 1.44.73 2.742 1.706 3.872 1.04 1.2 2.327 2.222 4.052 3.211m-1.521.59c.276.145.537.283.792.428.01.016.026.052.027.068-.092.352-.192.699-.298 1.064zm-.154 1.673q.054.201.112.404l.086.31.082.293-.273.28c-.196-1.103-1.125-2.083-1.838-2.826l1.102-.55.054.12.04.09.013.028c.108.241.21.468.29.708a21 21 0 0 1 .332 1.143M7.998 16.27c-.351-.214-.703-.428-1.02-.65l2.823.821c-.11.055-.206.106-.298.155-.137.073-.27.143-.441.222a.3.3 0 0 1-.12.023c-.028 0-.044-.005-.048-.006-.282-.19-.589-.378-.896-.565m-2.85-5.373.01-.113c1.05 2.32 2.813 3.868 4.483 5.07-.526-.09-.974-.366-1.39-.649a75 75 0 0 1-2.946-2.09c-.133-.1-.251-.349-.252-.537-.003-.475.037-.963.075-1.435l.003-.037zm10.35-1.11.06.156c.045.117.015.339-.069.42-.825.77-1.28 1.76-1.636 2.79-.211.606-.36 1.196-.516 1.807l-.115.453q-.05.196-.104.458l-.017.08c-1.022-.466-1.919-1.098-2.734-1.84-.109-.1-.138-.302-.164-.483l-.014-.097c-.182-1.083-.72-1.99-1.412-2.812-.217-.254-.341-.506-.227-.82l.102-.284c.181-.505.363-1.011.589-1.494q.206-.438.448-.845c.771-1.537 2.332-3.111 2.332-3.111 1.059.856 1.812 2.097 2.14 2.702l.017.026.043.07c.156.256.298.525.428.795.317.66.583 1.345.848 2.028m-4.72 4.115q.031.039.062.084c.479-.793-.503-4.093-1.325-4.53q-.046.092-.096.183a3 3 0 0 0-.198.415c-.037.11-.041.277.019.365a9.6 9.6 0 0 1 1.437 3.316c.014.057.055.11.1.167m1.555.595.069.025.037-.328q.053-.441.092-.87a9.9 9.9 0 0 1 1.384-4.245c.064-.106.099-.284.055-.392-.247-.6-.676-1.072-1.145-1.586l-.048-.053a23 23 0 0 0-.36.81c-.121.28-.245.566-.394.88-.156-.295-.315-.575-.475-.857-.167-.294-.336-.592-.504-.914-.41.647-.759 1.2-1.106 1.752-.098.156-.037.273.07.416.693.905 1.027 1.965 1.223 3.066.082.458.108.927.135 1.393l.015.26c.013.225.11.347.312.416.21.072.418.147.64.227m.908-.905c.245-1.088.755-2.062 1.313-3.013.234-.396.126-.874-.318-1.14-.921 1.417-1.264 2.974-1.229 4.632q.037.005.075.014l.054-.155c.04-.111.08-.223.105-.338m4.431-5.571c.299.54.503.984.642 1.398.069.207.063.498-.016.786-.417 1.538-1.45 2.675-2.302 3.493-.502.481-1.068.916-1.617 1.338-.23.177-.47.361-.7.546q.002-.027.007-.053l.004-.028c.08-.508.151-.947.489-1.284.748-.751 1.582-1.648 2.009-2.79a9.3 9.3 0 0 0 .523-2.125c.066-.546.047-1.109.027-1.652l-.005-.165-.01-.377a2 2 0 0 0-.043-.365c.412.396.731.809.992 1.278" clipRule="evenodd"/>
  </svg>
);

// Worlds Logo SVG Component
const WorldsLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="m17.754 2.88.838 1.466h2.286c.03 3.912-.784 6.805-2.59 9.404l.83.916c-1.04-.904-2.362-2.058-2.836-2.472l.08-.16.238-.4c-.275-.035-.747-.098-1.22-.16-.472-.062-.945-.125-1.22-.16.368-.461.477-.6.685-.863l.166-.21c-.525-.909-.849-1.734-1.119-2.424-.496-1.266-.814-2.077-1.868-2.11v1.725l-.001-.002c-.063-.047-1.602-1.21-2.42 2.625 0 0 1.171.183 2.361 2.01h2.314c.282 0 .561.102.78.282l3.726 3.07a1.775 1.775 0 1 1-2.568 2.41l-1.506-2.085v1.136l-2.686 1.553v2.61s-.883-2.268-2.575-4.097c0 0-.411-.424-.57-.568l-1.046 1.45a1.778 1.778 0 1 1-2.572-2.409l.757-.624a5 5 0 0 0-1.09-.127l.838-.832c-1.463-2.067-2.647-4.579-2.647-9.488h2.287l.838-1.466 1.27 1.466h1.187c.231-.574.432-.81.741-1.172l.143-.168.913.721s.553-.703 1.5-.703c.949 0 1.502.703 1.502.703l.913-.72.143.168c.304.357.507.596.74 1.171h1.187zm-3.36 9.731q-.057-.01-.116-.012h-1.599l2.031 1.175v1.055l1.938 2.686c.751 1 2.305.42 2.247-.788a1.25 1.25 0 0 0-.45-.898l-2.043-1.683-1.686-1.388a.7.7 0 0 0-.321-.147m-.219 1.472-2.15-1.243-2.155 1.243v2.485l2.154 1.244 2.152-1.244zM11.366 12.6H9.771a.7.7 0 0 0-.442.16l-3.728 3.07a1.243 1.243 0 1 0 1.796 1.686 1136 1136 0 0 1 1.938-2.687v-1.054zm6.292.454.006.006c1.334-1.803 2.265-4.951 2.283-7.794h-1.62l-.621-1.087a11 11 0 0 1-.358 2.142c-.444 1.59-1.096 2.067-1.096 2.067.288-.98.495-2.094.432-3.122h-1.959s.057-.802-.42-1.37l-1.019.803h-.024c-.135-.574-.712-.98-1.265-.98-.55 0-1.126.406-1.262.98h-.024l-1.018-.803c-.48.568-.42 1.37-.42 1.37H7.31c-.039.676.018 1.713.433 3.122 0 0-1.196-.88-1.451-4.21l-.625 1.088H4.05c.018 2.924 1.003 6.172 2.4 7.947l1.049-1-.4-.68 2.383-.312-.704-.955c.448-.784.773-1.577 1.066-2.294.6-1.465 1.068-2.608 2.18-2.69 1.333.031 1.724 1.01 2.301 2.455.298.746.646 1.616 1.198 2.544l-.054.07c-.052.067-.065.085-.504.639l2.328.303c-.151.261-.163.28-.254.435l-.23.389zm-4.501-5s-.015.364-.102.797l-.075.097c-.223.288-.454.586-.508 1.162a.67.67 0 0 1-.895 0c-.057-.57-.28-.862-.504-1.154l-.08-.105c-.086-.433-.101-.796-.101-.796.826.18 1.523.162 2.265 0m1.232 2.215.08.144c-.615.198-1.66.721-2.255 1.43 0 0 .775-1.232 2.052-1.787zm-3.735 4.035 1.37.916.002-.876.001-.755c-.003 0-1.373.715-1.373.715" clipRule="evenodd"/>
  </svg>
);

// Role Icons SVG Components
const MidLanerIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <g>
      <path fillRule="evenodd" fill="#555d64" d="M305.755,199.6L352.9,152.569l0.039,200.372h-200L200,305.882H305.883Zm-58.7-152.541L199.753,94.1H94.1L94.117,200,47.065,246.79V47.068Z"></path>
      <path fillRule="evenodd" fill="#c79e57" d="M105.882,352.941l247.06-247.059V47.059H294.118L47.059,294.117v58.824h58.823Z"></path>
    </g>
  </svg>
);

const TopLanerIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <g>
      <path fillRule="evenodd" fill="#555d64" d="M247.059,247.059V164.706H164.706v82.353h82.353ZM352.936,352.933V82.537l-47.054,46.875v176.47l-176.309.019L82.532,352.933h270.4Z"></path>
      <path fillRule="evenodd" fill="#c79e57" d="M329.946,47.1l-59.358,58.787H105.882V270.588L47.1,329.945,47.059,47.059Z"></path>
    </g>
  </svg>
);

const JungleIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <path fillRule="evenodd" fill="#c79e57" d="M294.118,35.294c-25.034,38.865-60.555,80.6-81.959,134.935,8.81,21.507,17.469,42.872,23.135,65.065,5.088-12.873,5.51-23.4,11.765-35.294C247,141.447,268.9,97.375,294.118,35.294m-141.177,200c-17.5-52.79-56-81.948-105.882-105.882,45.506,36.9,52.025,88.47,58.823,141.176l44.035,38.96c17.313,18.887,44.514,48.694,50.083,55.158,53.589-111.119-39.6-244.759-94.118-329.412C137.292,112.618,161.376,156.962,152.941,235.294Zm94.118,58.824c1.1,9.873-.075,13.739,0,23.529l47.059-47.059c6.8-52.706,13.318-104.28,58.823-141.176C290.728,159.259,260.4,221.817,247.059,294.118Z"></path>
  </svg>
);

const ADCIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <g>
      <path fillRule="evenodd" fill="#555d64" d="M152.942,152.941v82.353h82.352V152.941H152.942ZM47.064,47.067v270.4L93.6,270.436l0.52-176.318,176.31-.019,47.041-47.032H47.064Z"></path>
      <path fillRule="evenodd" fill="#c79e57" d="M70.054,352.905l59.357-58.787H294.118V129.412L352.9,70.055l0.039,282.886Z"></path>
    </g>
  </svg>
);

const SupportIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 400 400">
    <path fillRule="evenodd" fill="#c8aa6e" d="M317.647,200l-35.294-47.059h23.53c41.584,0,94.117-47.058,94.117-47.058H270.588l-35.294,35.293,23.53,82.354ZM245.026,35.3H153.673l-12.5,23.523L200,129.412l58.823-70.588L245.026,35.3m-33.262,117.64L200,164.706l-11.765-11.765L152.941,329.412,200,364.706l47.059-35.294ZM82.353,200l35.294-47.059H94.118C52.533,152.941,0,105.883,0,105.883H129.412l35.294,35.293-23.53,82.354Z"></path>
  </svg>
);

// Helper function to get role icon
const getRoleIcon = (roleKey: string, className: string = "w-3.5 h-3.5") => {
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
    name: "Kiin", 
    realNameUpper: "KIIN KIM",
    role: "Top", 
    roleKey: "top", 
    flag: "🇰🇷", 
    animalIcon: "🐸", 
    color: "from-gold/30", 
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213448905_kiin.png" 
  },
  { 
    name: "Canyon", 
    realNameUpper: "GUNBU KIM",
    role: "Jungle", 
    roleKey: "jungle", 
    flag: "🇰🇷", 
    animalIcon: "🐻‍❄️", 
    color: "from-gold/30", 
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212470925_canyon.png" 
  },
  { 
    name: "Chovy", 
    realNameUpper: "JIHUN JUNG",
    role: "Mid", 
    roleKey: "mid", 
    flag: "🇰🇷", 
    animalIcon: "🐱", 
    color: "from-gold/30", 
    featured: true, 
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758212535327_chovu.png" 
  },
  { 
    name: "Ruler", 
    realNameUpper: "JAEHYEOK PARK",
    role: "ADC", 
    roleKey: "adc", 
    flag: "🇰🇷", 
    animalIcon: "🐶", 
    color: "from-gold/30", 
    featured: true, 
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213914983_ruler.png" 
  },
  { 
    name: "Duro", 
    realNameUpper: "MINKYU JU",
    role: "Support", 
    roleKey: "support", 
    flag: "🇰🇷", 
    animalIcon: "🐰", 
    color: "from-gold/30", 
    image: "https://am-a.akamaihd.net/image?resize=375:&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1758213092149_duro.png" 
  },
];

export default function HomePage() {
  const { t, language } = useLanguage();

  const stats = [
    { icon: Trophy, value: "7x", label: t.home.stats.lckChampions, asterisk: "**", logo: <img src={tournamentLogos.lck} alt="LCK" className="w-8 h-8 object-contain" /> }, // Samsung + LCK Regular
    { icon: Star, value: "2x", label: t.home.stats.worldsChampions, asterisk: "*", logo: <WorldsLogo className="w-8 h-8 text-yellow-400" /> }, // Samsung only
    { icon: Calendar, value: "2012", label: t.home.stats.established, asterisk: "*" }, // Samsung only
    { icon: Users, value: "5", label: t.home.stats.starPlayers },
  ];

  const getRoleLabel = (roleKey: string) => {
    const roles = t.team.roles as Record<string, string>;
    return roles[roleKey] || roleKey;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          {/* Hero Image */}
          <div className="absolute inset-0">
            <img 
              src="https://gamek.mediacdn.vn/thumb_w/640/133514250583805952/2025/7/14/geng-msi-1-17524662839241244737788.jpg"
              alt="Gen.G MSI 2025"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
            {/* Gold accent overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
          </div>
          
          {/* Gold accent gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[800px] h-[800px] bg-gradient-radial-gold opacity-10 blur-3xl" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
               style={{
                 backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
                 backgroundSize: '50px 50px'
               }} />
        </div>

        {/* Animated particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
              }}
              animate={{
                y: [0, -1000],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 
                        rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gold text-sm font-medium">{t.home.badge}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="font-heading text-7xl sm:text-8xl md:text-9xl text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-gradient-gold drop-shadow-lg">{t.home.title}</span>
            </motion.h1>
            
            <motion.p 
              className="font-heading text-3xl sm:text-4xl text-white/60 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t.home.subtitle}
            </motion.p>

            {/* Subtitle */}
            <motion.p 
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {t.home.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/team" className="btn-gold inline-flex items-center justify-center gap-2">
                {t.home.meetTeam} <ArrowRight size={18} />
              </Link>
              <Link href="/fan-zone/shrine" className="btn-outline-gold inline-flex items-center justify-center gap-2">
                <span>⛩️</span> {t.home.shrine}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-3 bg-gold rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 bg-black-light border-y border-black-charcoal relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={i} 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-center mb-3">
                    {stat.logo || <Icon className="w-8 h-8 text-gold" />}
                  </div>
                  <div className="font-heading text-4xl sm:text-5xl text-white mb-1">
                    {stat.value}
                    {stat.asterisk && <span className="text-gold text-lg align-top">{stat.asterisk}</span>}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Asterisk notes */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-500 text-xs mt-6 space-y-1"
          >
            <p><span className="text-gold">*</span> {t.home.stats.noteSamsung}</p>
            <p><span className="text-gold">**</span> {t.home.stats.noteLckRegular}</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Players */}
      <section className="section-divider relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "120px" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"
              />
              <motion.h2 
                className="font-heading text-4xl sm:text-5xl lg:text-6xl text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-gradient-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                  {t.home.roster.title}
                </span>
              </motion.h2>
              <motion.p 
                className="text-gray-400 text-center max-w-lg mx-auto text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {t.home.roster.subtitle}
              </motion.p>
            </div>

            {/* Player Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {players.map((player, i) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className={`card-dark relative overflow-hidden group cursor-pointer
                            bg-gradient-to-t ${player.color} to-transparent
                            ${player.featured ? 'ring-2 ring-gold/50' : ''}`}
                >
                  {/* Franchise Player badge */}
                  {player.featured && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-gold text-black text-xs px-2 py-1 rounded font-bold">
                        👑 {t.common.franchise}
                      </span>
                    </div>
                  )}

                  {/* Player image */}
                  <div className="aspect-[3/4] bg-black-charcoal rounded-lg mb-4 
                                flex items-center justify-center relative overflow-hidden
                                shadow-2xl shadow-black/50 group-hover:shadow-gold/20">
                    {player.image ? (
                      <img 
                        src={player.image} 
                        alt={player.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`text-6xl group-hover:scale-110 transition-transform duration-300 ${player.image ? 'hidden' : ''}`}>
                      👤
                    </div>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-all duration-300" />
                  </div>

                  {/* Player info */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{player.flag}</span>
                    <h3 className="font-heading text-2xl text-white group-hover:text-gold 
                                 transition-colors flex items-center gap-2">
                      {player.name}
                      {player.animalIcon && <span className="text-xl">{player.animalIcon}</span>}
                    </h3>
                  </div>
                  <p className="text-gold text-sm flex items-center gap-2">
                    {getRoleIcon(player.roleKey)}
                    {getRoleLabel(player.roleKey)}
                  </p>

                  {/* Hover glow border */}
                  <div className="absolute inset-0 border-2 border-transparent 
                                group-hover:border-gold/50 rounded-xl transition-colors pointer-events-none" />
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/team" className="btn-outline-gold inline-flex items-center gap-2">
                {t.home.roster.viewFull} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2025 Achievements */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl sm:text-5xl text-center mb-4">
              <span className="text-gradient-gold">
                {language === "en" ? "2025 ACHIEVEMENTS" : "THÀNH TÍCH 2025"}
              </span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              {language === "en" 
                ? "A historic year of dominance and excellence"
                : "Một năm lịch sử của sự thống trị và xuất sắc"
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 max-w-5xl mx-auto">
            {[
              { 
                title: language === "en" ? "MSI 2025" : "MSI 2025", 
                type: language === "en" ? "Champion" : "Vô địch", 
                logo: <MSILogo className="w-16 h-16 text-blue-400 mx-auto" />,
                color: "from-blue-500/20"
              },
              { 
                title: language === "en" ? "EWC 2025" : "EWC 2025", 
                type: language === "en" ? "Champion" : "Vô địch", 
                logo: <EWCLogo className="w-16 h-16 text-white mx-auto" />,
                color: "from-white/20"
              },
              { 
                title: language === "en" ? "LCK Regular" : "LCK Regular", 
                type: language === "en" ? "Champion" : "Vô địch", 
                logo: <img src={tournamentLogos.lck} alt="LCK" className="w-16 h-16 mx-auto object-contain" />,
                color: "from-gold/20"
              },
            ].map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
                className={`card-dark card-glow bg-gradient-to-br ${achievement.color} to-transparent 
                         border border-gold/30 rounded-xl p-8 text-center
                         hover:border-gold/60 hover:shadow-gold/20`}
              >
                <motion.div 
                  className="mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {achievement.logo}
                </motion.div>
                <div className="text-gold font-heading text-sm mb-2 uppercase tracking-wider">{achievement.type}</div>
                <div className="font-heading text-2xl text-white">{achievement.title}</div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/achievements" className="btn-outline-gold inline-flex items-center gap-2">
              {language === "en" ? "Explore More" : "Khám phá thêm"} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Next Match CTA - Hidden when no upcoming match */}
      {/* <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black-light border border-gold/30 rounded-2xl p-8 md:p-12 text-center
                      relative overflow-hidden"
          >
            <div className="relative z-10">
              <motion.div 
                className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 
                          rounded-full px-4 py-2 mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">{t.home.match.upcoming}</span>
              </motion.div>

              <h3 className="font-heading text-4xl sm:text-5xl text-white mb-2">
                GEN.G <span className="text-gold">{t.home.match.vs}</span> T1
              </h3>
              <p className="text-gray-400 mb-8">LCK Spring 2025 - Week 3</p>

              <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8">
                {[
                  { value: "03", label: t.home.match.days },
                  { value: "12", label: t.home.match.hours },
                  { value: "45", label: t.home.match.mins },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 sm:gap-8">
                    <div className="text-center">
                      <motion.div 
                        className="font-heading text-4xl sm:text-5xl text-gold"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {item.value}
                      </motion.div>
                      <div className="text-gray-400 text-xs sm:text-sm">{item.label}</div>
                    </div>
                    {i < 2 && <span className="text-gold text-2xl sm:text-3xl">:</span>}
                  </div>
                ))}
              </div>

              <Link href="/schedule" className="btn-gold inline-flex items-center gap-2">
                <Calendar size={18} /> {t.home.match.viewSchedule}
              </Link>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Fan Zone Teaser */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Church of Chovy Minigame Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-dark relative overflow-hidden group cursor-pointer min-h-[300px]
                        flex flex-col justify-end"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-radial-gold opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded font-bold">
                  🎮 {t.home.features.minigame}
                </span>
              </div>
              
              <div className="relative z-20 p-6">
                <span className="text-5xl mb-4 block">⛩️</span>
                <h3 className="font-heading text-3xl text-gold mb-2">{t.home.features.shrineTitle}</h3>
                <p className="text-gray-400 mb-4">
                  {t.home.features.shrineDesc}
                </p>
                <Link href="/fan-zone/shrine" className="text-gold font-semibold inline-flex items-center gap-2 
                              group-hover:gap-3 transition-all">
                  {t.home.features.enterShrine} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Predictions Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-dark relative overflow-hidden group cursor-pointer min-h-[300px]
                        flex flex-col justify-end"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold">
                  🎮 {t.home.features.minigame}
                </span>
              </div>
              
              <div className="relative z-20 p-6">
                <span className="text-5xl mb-4 block">🔮</span>
                <h3 className="font-heading text-3xl text-gold mb-2">{t.home.features.predictionTitle}</h3>
                <p className="text-gray-400 mb-4">
                  {t.home.features.predictionDesc}
                </p>
                <Link href="/fan-zone/predictions" className="text-gold font-semibold inline-flex items-center gap-2 
                              group-hover:gap-3 transition-all">
                  {t.home.features.joinNow} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
