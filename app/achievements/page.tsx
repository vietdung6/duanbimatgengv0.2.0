"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Medal, Calendar, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Era logos (local images in public/images/)
const eraLogos: Record<string, string> = {
  "Gen.G": "https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png",
  "KSV": "",
  "Samsung Galaxy": "https://am-a.akamaihd.net/image?resize=400:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1669027895369_Samsung_Galaxylogo_square.png",
  "Samsung": "https://am-a.akamaihd.net/image?resize=400:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1669027895369_Samsung_Galaxylogo_square.png",
};

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

// Full history including Samsung era
const achievements = [
  {
    year: 2025,
    era: "Gen.G",
    items: [
      { title: "MSI 2025 Champion", titleVi: "Vô địch MSI 2025", type: "gold", icon: "🏆", major: true, players: ["Kiin", "Canyon", "Chovy", "Ruler", "Duro"], mvp: "Chovy" },
      { title: "EWC 2025 Champion", titleVi: "Vô địch EWC 2025", type: "gold", icon: "🏆", major: true, players: ["Kiin", "Canyon", "Chovy", "Ruler", "Duro"], mvp: "Kiin" },
      { title: "LCK Regular Season Champion*", titleVi: "Vô địch LCK Regular*", type: "gold", icon: "🏆", major: true, players: ["Kiin", "Canyon", "Chovy", "Ruler", "Duro"], mvp: "Chovy" },
      { title: "LCK Cup Runner-up", titleVi: "Á quân LCK Cup", type: "silver", icon: "🥈", players: ["Kiin", "Canyon", "Chovy", "Ruler", "Duro"] },
      { title: "Worlds 2025 - 4th Place", titleVi: "CKTG 2025 - Hạng 4", type: "bronze", icon: "🏅", players: ["Kiin", "Canyon", "Chovy", "Ruler", "Duro"] },
    ]
  },
  {
    year: 2024,
    era: "Gen.G",
    items: [
      { title: "MSI 2024 Champion", titleVi: "Vô địch MSI 2024", type: "gold", icon: "🏆", major: true, players: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"], mvp: "Lehends" },
      { title: "LCK Spring Champion", titleVi: "Vô địch LCK Mùa Xuân", type: "gold", icon: "🏆", major: true, players: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"], mvp: "Chovy" },
      { title: "LCK Summer Runner-up", titleVi: "Á quân LCK Mùa Hè", type: "silver", icon: "🥈", players: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"] },
      { title: "Worlds 2024 Semifinalist", titleVi: "Bán kết CKTG 2024", type: "bronze", icon: "🏅", major: true, players: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"] },
    ]
  },
  {
    year: 2023,
    era: "Gen.G",
    items: [
      { title: "LCK Spring Champion", titleVi: "Vô địch LCK Mùa Xuân", type: "gold", icon: "🏆", major: true, players: ["Doran", "Peanut", "Chovy", "Peyz", "Delight"], mvp: "Peyz" },
      { title: "LCK Summer Champion", titleVi: "Vô địch LCK Mùa Hè", type: "gold", icon: "🏆", major: true, players: ["Doran", "Peanut", "Chovy", "Peyz", "Delight"], mvp: "Chovy" },
      { title: "Worlds 2023 Quarterfinalist", titleVi: "Tứ kết CKTG 2023", type: "bronze", icon: "🏅", players: ["Doran", "Peanut", "Chovy", "Peyz", "Delight"] },
    ]
  },
  {
    year: 2022,
    era: "Gen.G",
    items: [
      { title: "LCK Spring Runner-up", titleVi: "Á quân LCK Mùa Xuân", type: "silver", icon: "🥈", players: ["Doran", "Peanut", "Chovy", "Ruler", "Lehends"] },
      { title: "LCK Summer Champion", titleVi: "Vô địch LCK Mùa Hè", type: "gold", icon: "🏆", major: true, players: ["Doran", "Peanut", "Chovy", "Ruler", "Lehends"], mvp: "Ruler" },
      { title: "Worlds 2022 Semifinalist", titleVi: "Bán kết CKTG 2022", type: "bronze", icon: "🏅", major: true, players: ["Doran", "Peanut", "Chovy", "Ruler", "Lehends"] },
    ]
  },
  {
    year: 2021,
    era: "Gen.G",
    items: [
      { title: "LCK Spring Runner-up", titleVi: "Á quân LCK Mùa Xuân", type: "silver", icon: "🥈", players: ["Rascal", "Clid", "Bdd", "Ruler", "Life"] },
      { title: "Worlds 2021 Semifinalist", titleVi: "Bán kết CKTG 2021", type: "bronze", icon: "🏅", major: true, players: ["Rascal", "Clid", "Bdd", "Ruler", "Life"] },
    ]
  },
  {
    year: 2020,
    era: "Gen.G",
    items: [
      { title: "LCK Spring Finalist", titleVi: "Á quân LCK Mùa Xuân", type: "silver", icon: "🥈", players: ["Rascal", "Clid", "Bdd", "Ruler", "Life"] },
      { title: "Worlds 2020 Quarterfinalist", titleVi: "Tứ kết CKTG 2020", type: "bronze", icon: "🏅", players: ["Rascal", "Clid", "Bdd", "Ruler", "Life"] },
    ]
  },
  {
    year: 2019,
    era: "Gen.G",
    items: [
    ]
  },
  {
    year: 2018,
    era: "KSV → Gen.G",
    items: [
      { title: "Samsung Galaxy Disbanded", titleVi: "Samsung Galaxy Giải Tán", type: "info", icon: "🔚" },
      { title: "KSV eSports Acquired Roster", titleVi: "KSV eSports Mua Lại Đội Hình", type: "info", icon: "🔄" },
      { title: "Rebranded: KSV eSports → Gen.G", titleVi: "Đổi Tên: KSV eSports → Gen.G", type: "info", icon: "🔄" },
      { title: "Worlds 2018 Group Stage", titleVi: "Vòng Bảng CKTG 2018", type: "bronze", icon: "🏅", players: ["CuVee", "Haru", "Crown", "Ruler", "CoreJJ"] },
    ]
  },
  {
    year: 2017,
    era: "Samsung Galaxy",
    items: [
      { title: "WORLDS CHAMPION 🏆", titleVi: "VÔ ĐỊCH THẾ GIỚI 🏆", type: "legendary", icon: "👑", major: true, players: ["CuVee", "Ambition", "Haru", "Crown", "Ruler", "CoreJJ"], mvp: "Ruler" },
    ]
  },
  {
    year: 2016,
    era: "Samsung Galaxy",
    items: [
      { title: "Worlds 2016 Finalist", titleVi: "Á quân CKTG 2016", type: "silver", icon: "🥈", major: true, players: ["CuVee", "Ambition", "Crown", "Ruler", "CoreJJ"] },
    ]
  },
  {
    year: 2015,
    era: "Samsung Galaxy",
    items: [
    ]
  },
  {
    year: 2014,
    era: "Samsung",
    items: [
      { title: "WORLDS CHAMPION (Samsung White)", titleVi: "VÔ ĐỊCH THẾ GIỚI (Samsung White)", type: "legendary", icon: "👑", major: true, players: ["Looper", "DanDy", "PawN", "imp", "Mata"], mvp: "Mata" },
      { title: "Champions Spring Champion (Blue)", titleVi: "Champions Mùa Xuân (Blue)", type: "gold", icon: "🏆", major: true, players: ["Acorn", "Spirit", "Dade", "Deft", "Heart"], mvp: "Dade" },
    ]
  },
  {
    year: 2013,
    era: "MVP Ozone",
    items: [
      { title: "Worlds 2013 Quarterfinalist", titleVi: "Tứ kết CKTG 2013", type: "bronze", icon: "🏅", players: ["Looper", "DanDy", "Dade", "imp", "Mata"] },
    ]
  },
  {
    year: 2012,
    era: "Samsung",
    items: [
      { title: "Samsung Galaxy Team Founded", titleVi: "Thành lập đội Samsung Galaxy", type: "info", icon: "🎮" },
      { title: "First entry into Korean LoL scene", titleVi: "Lần đầu gia nhập làng LMHT Hàn Quốc", type: "info", icon: "🇰🇷" },
    ]
  },
];

export default function AchievementsPage() {
  const [expandedYear, setExpandedYear] = useState<number | null>(2025);
  const [isTourMode, setIsTourMode] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const lastWheelTimeRef = useRef(0);
  const { language } = useLanguage();

  // Calculate totals
  const worldsChampions = 2; // 2014 Samsung White, 2017 Samsung Galaxy
  const lckChampions = 7; // 2014 Spring(1), 2022 Summer(1), 2023 Spring(1), 2024 Spring(1), 2024 Summer(1), 2025 Regular(=2 old cups)
  const msiChampions = 2; // 2024, 2025
  const ewcChampions = 1; // 2025
  const internationalTitles = worldsChampions + msiChampions + ewcChampions; // Total international majors (Worlds + MSI + EWC)
  const yearsActive = 13; // 2012-2025

  const milestones = language === "en" ? [
    { value: `${worldsChampions}x`, label: "Worlds Champions", icon: "worlds", color: "text-yellow-400" },
    { value: `${msiChampions}x`, label: "MSI Champions", icon: "msi", color: "text-blue-400" },
    { value: `${lckChampions}x`, label: "LCK Champions", icon: "lck", color: "text-gold" },
    { value: `${internationalTitles}x`, label: "International Titles", icon: Medal, color: "text-purple-400" },
    { value: `${yearsActive}`, label: "Years of Legacy", icon: Calendar, color: "text-white" },
  ] : [
    { value: `${worldsChampions}x`, label: "Vô địch Thế giới", icon: "worlds", color: "text-yellow-400" },
    { value: `${msiChampions}x`, label: "Vô địch MSI", icon: "msi", color: "text-blue-400" },
    { value: `${lckChampions}x`, label: "Vô địch LCK", icon: "lck", color: "text-gold" },
    { value: `${internationalTitles}x`, label: "Danh hiệu Quốc tế", icon: Medal, color: "text-purple-400" },
    { value: `${yearsActive}`, label: "Năm Lịch sử", icon: Calendar, color: "text-white" },
  ];

  const getTitle = (item: { title: string; titleVi: string }) => {
    return language === "en" ? item.title : item.titleVi;
  };

  // Tour mode uses existing year sections to highlight/scroll
  const tourStops = [
    {
      year: 2014,
      title: language === "en" ? "Origins & Worlds 2014" : "Khởi nguồn & CKTG 2014",
      note: language === "en"
        ? "Samsung White peak: Worlds 2014 champions, Mata MVP."
        : "Đỉnh cao Samsung White: Vô địch CKTG 2014, Mata MVP.",
      highlights: language === "en"
        ? ["Worlds 2014 Champion", "Mata Worlds MVP", "Era-defining dominance"]
        : ["Vô địch CKTG 2014", "Mata MVP CKTG", "Thống trị kỷ nguyên"],
    },
    {
      year: 2017,
      title: language === "en" ? "2017: Ending SKT Dynasty" : "2017: Chấm dứt triều đại SKT",
      note: language === "en"
        ? "Samsung Galaxy 3-0 SKT in finals, Ruler/CoreJJ shine."
        : "Samsung Galaxy 3-0 SKT ở chung kết, Ruler/CoreJJ tỏa sáng.",
      highlights: language === "en"
        ? ["Worlds 2017 Champion", "3-0 vs SKT", "Ruler/CoreJJ finals MVP-level play"]
        : ["Vô địch CKTG 2017", "3-0 SKT", "Ruler/CoreJJ chơi như MVP"],
    },
    {
      year: 2022,
      title: language === "en" ? "Chovy Joins — New Era" : "Chovy gia nhập — kỷ nguyên mới",
      note: language === "en"
        ? "Gen.G rebuilds around Chovy for sustained contention."
        : "Gen.G tái thiết quanh Chovy, duy trì vị thế top.",
      highlights: language === "en"
        ? ["LCK titles resume", "Mid lane excellence", "Foundation for dynasty"]
        : ["Trở lại vô địch LCK", "Mid lane đỉnh cao", "Nền móng triều đại"],
    },
    {
      year: 2024,
      title: language === "en" ? "4 LCKs & First International (MSI)" : "4 LCK liên tiếp & MSI đầu tiên",
      note: language === "en"
        ? "Back-to-back LCK streak plus MSI 2024 — first global trophy as Gen.G."
        : "Chuỗi LCK liên tiếp và MSI 2024 — cúp quốc tế đầu tiên với tên Gen.G.",
      highlights: language === "en"
        ? ["MSI 2024 Champion", "LCK streak", "Peyz/Lehends breakout"]
        : ["Vô địch MSI 2024", "Chuỗi LCK liên tiếp", "Peyz/Lehends bùng nổ"],
    },
    {
      year: 2025,
      title: language === "en" ? "2025 Triple Crowns" : "2025: Bộ ba danh hiệu",
      note: language === "en"
        ? "MSI + EWC + Regular — asserting global supremacy."
        : "MSI + EWC + Regular — khẳng định vị thế toàn cầu.",
      highlights: language === "en"
        ? ["MSI 2025 Champion", "EWC 2025 Champion", "Regular Season title"]
        : ["Vô địch MSI 2025", "Vô địch EWC 2025", "Vô địch Regular"],
    },
  ];

  const tourYears = tourStops.map((s) => s.year);
  const currentTourYear = tourYears[tourIndex] ?? null;

  const scrollToYear = (year: number) => {
    const el = document.getElementById(`year-${year}`);
    if (!el) return;
    const doScroll = () => {
      const top = el.getBoundingClientRect().top + window.scrollY - 160; // offset for header + breathing room
      window.scrollTo({ top, behavior: "smooth" });
    };
    doScroll();
    // retry after layout settles (accordion expand)
    requestAnimationFrame(() => {
      setTimeout(doScroll, 80);
    });
  };

  const startTour = () => {
    setIsTourMode(true);
    setTourIndex(0);
    setExpandedYear(tourYears[0] ?? null);
    scrollToYear(tourYears[0]);
  };

  const goTour = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(tourYears.length - 1, nextIndex));
    setTourIndex(clamped);
    setExpandedYear(tourYears[clamped] ?? null);
    scrollToYear(tourYears[clamped]);
  };

  const endTour = () => {
    setIsTourMode(false);
    setTourIndex(0);
  };

  // Scroll wheel navigation while tour mode on
  useEffect(() => {
    if (!isTourMode) return;
    const handler = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 500) return;
      if (Math.abs(e.deltaY) < 20) return;
      lastWheelTimeRef.current = now;
      if (e.deltaY > 0) {
        goTour(tourIndex + 1);
      } else {
        goTour(tourIndex - 1);
      }
    };
    window.addEventListener("wheel", handler, { passive: true });
    return () => window.removeEventListener("wheel", handler);
  }, [isTourMode, tourIndex, tourYears]);

  // Helper function to get tournament logo component from achievement title
  const getTournamentLogo = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("worlds") || titleLower.includes("cktg") || titleLower.includes("thế giới")) {
      return <WorldsLogo className="w-8 h-8 text-yellow-400" />;
    }
    if (titleLower.includes("msi")) {
      return <MSILogo className="w-8 h-8 text-blue-400" />;
    }
    if (titleLower.includes("ewc")) {
      return <EWCLogo className="w-8 h-8 text-white" />;
    }
    if (titleLower.includes("lck") || titleLower.includes("ogn") || titleLower.includes("champions")) {
      return <img src={tournamentLogos.lck} alt="LCK" className="w-8 h-8 object-contain" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ minHeight: '400px' }}>
        {/* Background Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.img
            src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/518937717_1168409358430330_4592867484714323039_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=xC5cIKq-6aIQ7kNvwHfBqLV&_nc_oc=AdkMRSNVq5QcNvJC803lSVSt1eFX9YtyF7KOL4ryu8jlWtbxaPHCwPD8QeV0uIpEcsA&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=GpxXF9ZUc40z5Mp6ec_bGw&oh=00_AfkkXEB8qOdc4i_Mholmg-L-uAHAHM2rzluZKkKZcopcZA&oe=6940F229"
            alt="Achievements Banner"
            className="object-cover"
            style={{ 
              width: '720px',
              height: '900px',
              maxWidth: '90%',
              maxHeight: '70vh',
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Animated Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          {/* Floating particles effect */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold/30 rounded-full"
              initial={{
                x: `${20 + i * 15}%`,
                y: `${30 + i * 10}%`,
                opacity: 0,
              }}
              animate={{
                y: [`${30 + i * 10}%`, `${20 + i * 10}%`, `${30 + i * 10}%`],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <motion.h1 
              className="font-heading text-5xl sm:text-7xl mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <motion.span 
                className="text-gradient-gold inline-block"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                {language === "en" ? "ACHIEVEMENTS" : "THÀNH TÍCH"}
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-gray-300 max-w-xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {language === "en" 
                ? "From Samsung Galaxy's golden era to Gen.G's modern dominance. A legacy spanning over a decade."
                : "Từ kỷ nguyên vàng của Samsung Galaxy đến sự thống trị của Gen.G. Di sản kéo dài hơn một thập kỷ."
              }
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
            >
              <button
                onClick={startTour}
                className="btn-gold flex items-center gap-2 text-base px-5 py-3"
              >
                🗺️ {language === "en" ? "History Tour" : "Tham quan lịch sử"}
              </button>
              <span className="text-gray-400 text-sm">
                {language === "en"
                  ? "Walk through our eras on this page."
                  : "Đi qua các kỷ nguyên ngay trên trang này."}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Legacy Banner */}
      <section className="py-8 bg-gradient-to-r from-blue-900/20 via-gold/10 to-blue-900/20 border-y border-gold/20 relative overflow-hidden">
        {/* Animated background shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.img 
                src={eraLogos["Samsung Galaxy"]} 
                alt="Samsung Galaxy"
                className="w-10 h-10 object-contain"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              />
              <div className="text-left">
                <div className="text-blue-400 font-bold">SAMSUNG</div>
                <div className="text-gray-400 text-xs">2012 - 2017</div>
              </div>
            </motion.div>
            <motion.div 
              className="text-xl text-gold"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.3
              }}
            >
              →
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-left">
                <div className="text-purple-400 font-bold">KSV<span className="text-gold">*</span></div>
                <div className="text-gray-400 text-xs">2018</div>
              </div>
            </motion.div>
            <motion.div 
              className="text-xl text-gold"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut", 
                delay: 0.5
              }}
            >
              →
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.img 
                src={eraLogos["Gen.G"]} 
                alt="Gen.G"
                className="w-10 h-10 object-contain"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              />
              <div className="text-left">
                <div className="text-gold font-bold">GEN.G</div>
                <div className="text-gray-400 text-xs">2018 - {language === "en" ? "Present" : "Hiện tại"}</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Legacy Explanation */}
          <motion.p 
            className="text-center text-gray-500 text-xs mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {language === "en" 
              ? "* In 2017, KSV eSports acquired the entire League of Legends roster of Samsung Galaxy (players, coaching staff, inheriting the legacy, and officially RECOGNIZED BY RIOT GAMES). KSV then rebranded as Gen.G in 2018, which is its current name."
              : "* Năm 2017, KSV eSports mua lại toàn bộ đội hình LMHT của Samsung Galaxy (tuyển thủ, ban huấn luyện,kế thừa di sản, và ĐƯỢC RIOT CÔNG NHẬN). KSV sau đó đổi tên thành Gen.G vào năm 2018, tên gọi như hiện tại."
            }
          </motion.p>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-12 border-b border-black-charcoal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {milestones.map((milestone, i) => {
              const Icon = typeof milestone.icon === "string" ? null : milestone.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-dark text-center"
                >
                  {milestone.icon === "worlds" ? (
                    <div className="flex justify-center mb-2">
                      <WorldsLogo className={`w-8 h-8 ${milestone.color}`} />
                    </div>
                  ) : milestone.icon === "msi" ? (
                    <div className="flex justify-center mb-2">
                      <MSILogo className={`w-8 h-8 ${milestone.color}`} />
                    </div>
                  ) : milestone.icon === "lck" ? (
                    <div className="flex justify-center mb-2">
                      <img src={tournamentLogos.lck} alt="LCK" className="w-8 h-8 object-contain" />
                    </div>
                  ) : Icon ? (
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${milestone.color}`} />
                  ) : null}
                  <div className={`font-heading text-3xl sm:text-4xl mb-1 ${milestone.color} flex items-center justify-center gap-1`}>
                    {milestone.value}
                    {milestone.icon === "lck" && <span className="text-gold text-lg">*</span>}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">{milestone.label}</div>
                  {milestone.icon === "lck" && (
                    <div className="text-gray-500 text-xs mt-1">
                      {language === "en" 
                        ? "LCK Regular 2025 = Spring + Summer combined (counts as 2 titles)"
                        : "LCK Regular 2025 = Xuân + Hè gộp (tính 2 danh hiệu)"
                      }
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Worlds Champions Highlight */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-yellow-900/30 via-black-light to-yellow-900/30 
                      border border-yellow-500/30 rounded-2xl p-8 relative overflow-hidden group"
          >
            {/* Animated background effects */}
            <motion.div 
              className="absolute inset-0 bg-gradient-radial-gold opacity-10"
              animate={{ 
                opacity: [0.1, 0.15, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Sparkle particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
            
            <div className="relative z-10 text-center">
              {/* Worlds Logo */}
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <WorldsLogo className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                </motion.div>
              </motion.div>
              <motion.h2 
                className="font-heading text-3xl text-yellow-400 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {language === "en" ? "WORLDS CHAMPIONS" : "VÔ ĐỊCH THẾ GIỚI"}
              </motion.h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* 2014 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black/50 rounded-xl p-6 border border-yellow-500/20 relative overflow-hidden group/item"
                >
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover/item:from-yellow-500/20 group-hover/item:to-transparent rounded-xl"
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="flex justify-center mb-4"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <WorldsLogo className="w-12 h-12 text-yellow-400 opacity-80" />
                    </motion.div>
                    <motion.div 
                      className="font-heading text-4xl text-yellow-400 mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      2014
                    </motion.div>
                    <div className="text-white font-bold text-xl mb-2">Samsung White</div>
                    <div className="text-gray-400 text-sm">
                      {language === "en" 
                        ? "The most dominant Worlds run in history. 15-1 record."
                        : "Hành trình CKTG thống trị nhất lịch sử. Tỉ số 15-1."
                      }
                    </div>
                    <div className="mt-4 flex justify-center gap-2 flex-wrap">
                      <motion.span 
                        className="bg-gradient-to-r from-yellow-500/40 to-yellow-600/40 text-yellow-200 border border-yellow-400/50 shadow-lg shadow-yellow-500/30 text-xs px-2 py-1 rounded inline-flex items-center gap-1 font-bold"
                        whileHover={{ scale: 1.1 }}
                      >
                        Mata<span className="text-yellow-300">⭐</span>
                      </motion.span>
                      {["imp", "PawN", "DanDy", "Looper"].map((player, idx) => (
                        <motion.span 
                          key={player}
                          className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(234, 179, 8, 0.3)" }}
                        >
                          {player}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* 2017 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black/50 rounded-xl p-6 border border-yellow-500/20 relative overflow-hidden group/item"
                >
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover/item:from-yellow-500/20 group-hover/item:to-transparent rounded-xl"
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="flex justify-center mb-4"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <WorldsLogo className="w-12 h-12 text-yellow-400 opacity-80" />
                    </motion.div>
                    <motion.div 
                      className="font-heading text-4xl text-yellow-400 mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                      2017
                    </motion.div>
                    <div className="text-white font-bold text-xl mb-2">Samsung Galaxy</div>
                    <div className="text-gray-400 text-sm">
                      {language === "en" 
                        ? "Revenge against SKT in finals. Perfect redemption."
                        : "Trả thù SKT trong trận chung kết. Sự cứu chuộc hoàn hảo."
                      }
                    </div>
                    <div className="mt-4 flex justify-center gap-2 flex-wrap">
                      <motion.span 
                        className="bg-gradient-to-r from-yellow-500/40 to-yellow-600/40 text-yellow-200 border border-yellow-400/50 shadow-lg shadow-yellow-500/30 text-xs px-2 py-1 rounded inline-flex items-center gap-1 font-bold"
                        whileHover={{ scale: 1.1 }}
                      >
                        Ruler<span className="text-yellow-300">⭐</span>
                      </motion.span>
                      {["CoreJJ", "Crown", "Ambition", "CuVee", "Haru"].map((player, idx) => (
                        <motion.span 
                          key={player}
                          className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(234, 179, 8, 0.3)" }}
                        >
                          {player}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl text-gold mb-8 text-center">
              {language === "en" ? "FULL TIMELINE" : "LỊCH SỬ ĐẦY ĐỦ"}
            </h2>

            {/* Notes - Bottom right, below title */}
            <div className="mb-8 flex justify-end pr-8">
              <div className="text-right text-gray-500 text-xs">
                <p>
                  <span className="text-gold">⭐</span> {language === "en" 
                    ? "FMVP or Tournament MVP"
                    : "FMVP hoặc MVP giải đấu"
                  }
                </p>
              </div>
            </div>

            {achievements.map((yearData, yearIndex) => {
              // Calculate cups for this year
              const lckCups = yearData.items.filter(i => 
                (i.title.toLowerCase().includes("lck") || i.title.toLowerCase().includes("champions")) && 
                (i.type === "gold" || i.type === "legendary")
              ).length;
              const msiCups = yearData.items.filter(i => 
                i.title.toLowerCase().includes("msi") && 
                (i.type === "gold" || i.type === "legendary")
              ).length;
              const worldsCups = yearData.items.filter(i => 
                (i.title.toLowerCase().includes("worlds") || i.title.toLowerCase().includes("cktg")) && 
                i.type === "legendary"
              ).length;
              const ewcCups = yearData.items.filter(i => 
                i.title.toLowerCase().includes("ewc") && 
                (i.type === "gold" || i.type === "legendary")
              ).length;
              const totalCups = lckCups + msiCups + worldsCups + ewcCups;

              return (
              <motion.div
                key={yearData.year}
                id={`year-${yearData.year}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: yearIndex * 0.05 }}
                className={`mb-4 scroll-mt-32 ${isTourMode && currentTourYear === yearData.year ? 'ring-2 ring-gold/60 shadow-gold-glow rounded-2xl' : ''}`}
              >
                {/* Year Header */}
                <motion.button
                  onClick={() => setExpandedYear(expandedYear === yearData.year ? null : yearData.year)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-black-light border rounded-xl p-4 
                           flex items-center justify-between hover:border-gold/50 transition-all relative overflow-hidden group
                           ${yearData.era === "Samsung" ? 'border-blue-500/30' : 
                             yearData.era === "Samsung Galaxy" ? 'border-blue-400/30' : 
                             yearData.era === "MVP Ozone" ? 'border-green-500/30' :
                             'border-black-charcoal'}`}
                >
                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-heading text-3xl text-gold">{yearData.year}</span>
                    {/* Era Logo + Name */}
                    <div className={`flex items-center gap-2 px-2 py-1 rounded ${
                      yearData.era === "Samsung" ? 'bg-blue-500/20' :
                      yearData.era === "Samsung Galaxy" ? 'bg-blue-400/20' :
                      yearData.era === "KSV" ? 'bg-purple-500/20' :
                      yearData.era === "MVP Ozone" ? 'bg-green-500/20' :
                      'bg-gold/20'
                    }`}>
                      {eraLogos[yearData.era] && (
                        <img 
                          src={eraLogos[yearData.era]} 
                          alt={yearData.era}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span className={`text-xs ${
                        yearData.era === "Samsung" ? 'text-blue-400' :
                        yearData.era === "Samsung Galaxy" ? 'text-blue-300' :
                        yearData.era === "KSV" ? 'text-purple-400' :
                        yearData.era === "MVP Ozone" ? 'text-green-400' :
                        'text-gold'
                      }`}>
                        {yearData.era}
                      </span>
                    </div>
                    {/* Cups count by type */}
                    {totalCups > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        {worldsCups > 0 && (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <WorldsLogo className="w-4 h-4" />
                            {worldsCups}
                          </span>
                        )}
                        {msiCups > 0 && (
                          <span className="flex items-center gap-1 text-blue-400">
                            <MSILogo className="w-4 h-4" />
                            {msiCups}
                          </span>
                        )}
                        {ewcCups > 0 && (
                          <span className="flex items-center gap-1 text-white">
                            <EWCLogo className="w-4 h-4" />
                            {ewcCups}
                          </span>
                        )}
                        {lckCups > 0 && (
                          <span className="flex items-center gap-1 text-gold">
                            <img src={tournamentLogos.lck} alt="LCK" className="w-4 h-4 object-contain" />
                            {lckCups}
                          </span>
                        )}
                        <span className="text-gray-400 ml-1">
                          ({totalCups} {language === "en" ? "cups" : "cup"})
                        </span>
                      </div>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: expandedYear === yearData.year ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="text-gold" />
                  </motion.div>
                </motion.button>

      {/* Achievements List */}
                <AnimatePresence>
                  {expandedYear === yearData.year && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="py-4 space-y-3 pl-8 border-l-2 border-gold/30 ml-4 mt-2 relative">
                        {/* Animated timeline line */}
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-transparent"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                        
                        {[...yearData.items].sort((a, b) => {
                          // Sort priority: legendary > gold > silver > bronze > info
                          const priority = { legendary: 0, gold: 1, silver: 2, bronze: 3, info: 4 };
                          const aPriority = priority[a.type as keyof typeof priority] ?? 5;
                          const bPriority = priority[b.type as keyof typeof priority] ?? 5;
                          return aPriority - bPriority;
                        }).map((achievement, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ 
                              delay: i * 0.08,
                              type: "spring",
                              stiffness: 100,
                              damping: 12
                            }}
                            whileHover={{ 
                              scale: 1.02, 
                              x: 5,
                              transition: { duration: 0.2 }
                            }}
                            className={`flex items-center gap-4 p-4 rounded-xl relative overflow-hidden group/item ${
                              achievement.type === 'legendary'
                                ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-700/20 border-2 border-yellow-500/50'
                                : achievement.type === 'gold' 
                                ? 'bg-yellow-500/10 border border-yellow-500/30' 
                                : achievement.type === 'silver'
                                ? 'bg-gray-400/10 border border-gray-400/30'
                                : achievement.type === 'info'
                                ? 'bg-blue-500/10 border border-blue-500/30'
                                : 'bg-amber-700/10 border border-amber-700/30'
                            }`}
                          >
                            {/* Hover glow effect */}
                            <motion.div
                              className={`absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ${
                                achievement.type === 'legendary' || achievement.type === 'gold'
                                  ? 'bg-gradient-to-r from-yellow-500/10 to-transparent'
                                  : 'bg-gradient-to-r from-white/5 to-transparent'
                              }`}
                            />
                            
                            {/* Shimmer effect for legendary/gold */}
                            {(achievement.type === 'legendary' || achievement.type === 'gold') && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "200%" }}
                                transition={{ duration: 0.8 }}
                              />
                            )}
                            <div className="relative z-10 flex items-center gap-4 w-full">
                              {getTournamentLogo(achievement.title) ? (
                                <motion.div 
                                  className="flex-shrink-0"
                                  whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  {getTournamentLogo(achievement.title)}
                                </motion.div>
                              ) : (
                                <motion.span 
                                  className="text-3xl"
                                  animate={achievement.type === 'legendary' ? {
                                    rotate: [0, 5, -5, 0],
                                  } : {}}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  {achievement.icon}
                                </motion.span>
                              )}
                              <div className="flex-1">
                                <motion.h3 
                                  className={`font-semibold mb-2 ${
                                    achievement.type === 'legendary' ? 'text-yellow-300 text-lg' :
                                    achievement.type === 'gold' ? 'text-yellow-400' :
                                    achievement.type === 'silver' ? 'text-gray-300' :
                                    achievement.type === 'info' ? 'text-blue-300' :
                                    'text-amber-600'
                                  }`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: i * 0.08 + 0.1 }}
                                >
                                  {getTitle(achievement)}
                                </motion.h3>
                                {achievement.players && achievement.players.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {achievement.players.map((player, idx) => {
                                      const isMVP = 'mvp' in achievement && achievement.mvp === player;
                                      return (
                                        <motion.div 
                                          key={idx}
                                          initial={{ opacity: 0, scale: 0 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ 
                                            delay: i * 0.08 + idx * 0.05 + 0.2,
                                            type: "spring",
                                            stiffness: 200
                                          }}
                                          whileHover={{ scale: 1.15, y: -2 }}
                                          className={`text-xs px-2 py-0.5 rounded inline-flex items-center gap-1 cursor-pointer ${
                                            isMVP 
                                              ? achievement.type === 'legendary' 
                                                ? 'bg-gradient-to-r from-yellow-500/40 to-yellow-600/40 text-yellow-200 border border-yellow-400/50 shadow-lg shadow-yellow-500/30' 
                                                : achievement.type === 'gold'
                                                ? 'bg-gradient-to-r from-yellow-500/40 to-yellow-600/40 text-yellow-200 border border-yellow-400/50 shadow-lg shadow-yellow-500/30'
                                                : 'bg-gradient-to-r from-yellow-500/40 to-yellow-600/40 text-yellow-200 border border-yellow-400/50 shadow-lg shadow-yellow-500/30'
                                              : achievement.type === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                                              achievement.type === 'gold' ? 'bg-yellow-500/20 text-yellow-400' :
                                              achievement.type === 'silver' ? 'bg-gray-400/20 text-gray-300' :
                                              achievement.type === 'info' ? 'bg-blue-500/20 text-blue-300' :
                                              'bg-amber-700/20 text-amber-600'
                                          }`}
                                        >
                                          <span className={isMVP ? 'font-bold' : ''}>{player}</span>
                                          {isMVP && (
                                            <motion.span 
                                              className="text-yellow-300"
                                              animate={{ rotate: [0, 10, -10, 0] }}
                                              transition={{ duration: 1, repeat: Infinity }}
                                            >
                                              ⭐
                                            </motion.span>
                                          )}
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2025 Highlight */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gold/20 via-black-light to-gold/20 
                      border border-gold/30 rounded-2xl p-8 text-center relative overflow-hidden"
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            {/* Fire emoji animation */}
            <motion.h2 
              className="font-heading text-3xl text-gold mb-4 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                🔥
              </motion.span>
              {" "}
              {language === "en" ? "2025 - TRIPLE CROWN YEAR" : "2025 - NĂM BA CÚP"}
              {" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="inline-block"
              >
                🔥
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-gray-400 mb-8 relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {language === "en" 
                ? "The most successful international year in organization history"
                : "Năm quốc tế thành công nhất trong lịch sử tổ chức"
              }
            </motion.p>
            
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 relative z-10">
              {/* MSI */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0, duration: 0.8, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.15, y: -10, rotateY: 5 }}
                className="bg-black/50 rounded-xl p-6 relative overflow-hidden group/item border border-blue-500/20"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover/item:from-blue-500/20 group-hover/item:to-transparent rounded-xl"
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div 
                    className="flex justify-center mb-3"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MSILogo className="w-16 h-16 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  </motion.div>
                  <div className="text-gold font-heading text-lg">MSI</div>
                  <div className="text-gold font-heading text-sm">2025</div>
                </div>
              </motion.div>
              
              {/* EWC */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.15, y: -10, rotateY: 5 }}
                className="bg-black/50 rounded-xl p-6 relative overflow-hidden group/item border border-white/20"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/item:from-white/20 group-hover/item:to-transparent rounded-xl"
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div 
                    className="flex justify-center mb-3"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <EWCLogo className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                  </motion.div>
                  <div className="text-gold font-heading text-lg">EWC</div>
                  <div className="text-gold font-heading text-sm">2025</div>
                </div>
              </motion.div>
              
              {/* LCK */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.15, y: -10, rotateY: 5 }}
                className="bg-black/50 rounded-xl p-6 relative overflow-hidden group/item border border-gold/20"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover/item:from-gold/20 group-hover/item:to-transparent rounded-xl"
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div 
                    className="flex justify-center mb-3"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <img src={tournamentLogos.lck} alt="LCK" className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                  </motion.div>
                  <div className="text-gold font-heading text-lg">LCK Regular</div>
                  <div className="text-gold font-heading text-sm">2025</div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="text-gray-400 text-sm relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {language === "en" 
                ? "Win Rate: 85% • First Korean team to win MSI & EWC in same year"
                : "Tỉ lệ thắng: 85% • Đội Hàn Quốc đầu tiên vô địch MSI & EWC cùng năm"
              }
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CEO Quote */}
      <section className="py-12 bg-black-light border-t border-black-charcoal">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-black/50 border border-gold/20 rounded-2xl p-6 md:p-8">
              <div className="text-gold text-sm font-medium mb-4">
                {language === "en" ? "FROM GEN.G CEO" : "TỪ CEO GEN.G"}
              </div>
              <blockquote className="text-gray-300 italic mb-4 leading-relaxed">
                {language === "en" 
                  ? "\"Verified with Riot official: '14, '17 yes. Trophies: we do not own them and cannot control where they are. Good idea here though: we'll make a replica of them if we win worlds as a sign that we've partially lived up to the incredible legacy of those teams.\""
                  : "\"Đã được Riot xác nhận: '14, '17 có. Chiếc cúp thật: chúng tôi không sở hữu được nó. Một ý tưởng đáng cân nhắc: Gen.G sẽ làm một bản sao của 2 chiếc cúp cũ nếu chúng tôi vô địch, đó là dấu hiệu cho việc xứng đáng với di sản của 2 đội tuyển tiền nhiệm.\""
                }
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                  A
                </div>
                <div>
                  <div className="text-white font-semibold">Arnold Hur</div>
                  <div className="text-gray-500 text-sm">CEO, Gen.G Esports</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Legacy Quote */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl text-gray-400 italic max-w-3xl mx-auto"
          >
            {language === "en" 
              ? "\"We will strive to prove that Gen.G is worthy of the legacy of our two predecessor teams.\""
              : "\"Chúng tôi sẽ cố gắng chứng minh cho việc Gen.G xứng đáng với di sản của 2 đội tuyển tiền nhiệm.\""
            }
          </motion.blockquote>
          <div className="mt-4 text-gold font-heading">— Gen.G Esports</div>
        </div>
      </section>

      {/* Tour Controls (in-page, highlight existing sections) */}
      {isTourMode && (
        <div className="fixed bottom-4 right-4 z-[90]">
          <div className="bg-black/85 border border-gold/30 rounded-2xl shadow-lg p-4 flex flex-col gap-3 backdrop-blur-md max-w-sm">
            <div>
              <div className="text-gold text-xs font-semibold uppercase tracking-wide">
                {language === "en" ? "History Tour" : "Tham quan lịch sử"}
              </div>
              <div className="text-white font-heading text-lg">
                {tourStops[tourIndex]?.title}
              </div>
              <div className="text-gray-400 text-sm">
                {tourStops[tourIndex]?.note}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {tourStops[tourIndex]?.highlights.map((h, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-full bg-gold/10 text-gold text-xs">
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                {tourYears.map((year, idx) => (
                  <button
                    key={year}
                    onClick={() => goTour(idx)}
                    className={`h-2 rounded-full transition-all ${currentTourYear === year ? 'w-6 bg-gold' : 'w-2 bg-gray-600'}`}
                    aria-label={`Year ${year}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goTour(tourIndex - 1)}
                  disabled={tourIndex === 0}
                  className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
                    tourIndex === 0
                      ? "border-gray-700 text-gray-600 cursor-not-allowed"
                      : "border-gold/40 text-white hover:border-gold"
                  }`}
                >
                  {language === "en" ? "Back" : "Trước"}
                </button>
                <button
                  onClick={() => {
                    if (tourIndex === tourYears.length - 1) {
                      endTour();
                    } else {
                      goTour(tourIndex + 1);
                    }
                  }}
                  className="btn-gold px-3 py-2 text-xs"
                >
                  {tourIndex === tourYears.length - 1
                    ? language === "en" ? "Finish" : "Kết thúc"
                    : language === "en" ? "Next" : "Tiếp"}
                </button>
                <button
                  onClick={endTour}
                  className="text-gray-400 hover:text-white text-sm px-2"
                  aria-label="Close tour"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
