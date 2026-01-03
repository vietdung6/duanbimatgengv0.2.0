// Story slides data for HistoryTour
export interface StorySlide {
    year: 2014 | 2017 | 2022 | 2024 | 2025;
    bgImage: string;
    bgGradient: string;
    accentColor: string;
    players: string[];
    mvp: string;
    logo: string; // Logo path for header
}

// Team logos
const logos = {
    ssg: "/images/logo_teams/Samsung_Galaxylogo.webp",
    ssw: "/images/logo_teams/Samsung_Whitelogo.webp",
    ksv: "/images/logo_teams/KSV_eSportslogo_square.webp",
    geng: "/images/logo_teams/GenG_logo.webp",
};

export const storySlides: StorySlide[] = [
    {
        year: 2014,
        bgImage: "https://thanhnien.mediacdn.vn/Uploaded/game/st.game.thanhnien.com.vn/image/22/2014/10-2014/pre-ck/thanh-nien-game-esports-lmht-danh-gia-cap-dau-ssw-shrc-01.png",
        bgGradient: "from-blue-900/90 via-blue-800/80 to-black/90",
        accentColor: "text-blue-400",
        players: ["PawN", "DanDy", "Looper", "imp", "Mata"],
        mvp: "Mata",
        logo: logos.ssw,
    },
    {
        year: 2017,
        bgImage: "https://genk.mediacdn.vn/2019/10/1/samsung-galaxy-15699254962561528440106.jpg",
        bgGradient: "from-blue-900/90 via-slate-900/80 to-black/90",
        accentColor: "text-cyan-300",
        players: ["CuVee", "Ambition", "Crown", "Ruler", "CoreJJ"],
        mvp: "Ruler",
        logo: logos.ssg,
    },
    {
        year: 2022,
        bgImage: "https://gamek.mediacdn.vn/133514250583805952/2021/11/24/chovy-1-1637746121902459819878.jpg",
        bgGradient: "from-slate-900/90 via-gray-800/80 to-black/90",
        accentColor: "text-white",
        players: ["Doran", "Peanut", "Chovy", "Ruler", "Lehends"],
        mvp: "Chovy",
        logo: logos.geng,
    },
    {
        year: 2024,
        bgImage: "https://kenh14cdn.com/203336854389633024/2024/5/20/53731990415c7fc25b9ack-0953-17161832933322084945724.jpg",
        bgGradient: "from-yellow-800/90 via-gold/60 to-black/90",
        accentColor: "text-gold",
        players: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"],
        mvp: "Lehends",
        logo: logos.geng,
    },
    {
        year: 2025,
        bgImage: "https://admin.esports.gg/wp-content/uploads/2025/07/GENG-won-MSI-2025.jpg",
        bgGradient: "from-gold/80 via-yellow-900/70 to-black/95",
        accentColor: "text-gold",
        players: ["Kiin", "Canyon", "Chovy", "Ruler", "Duro"],
        mvp: "Chovy",
        logo: logos.geng,
    }
];

export const SLIDE_DURATION = 8000; // 8 seconds per slide

