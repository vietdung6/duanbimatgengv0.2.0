// Search data structure for global search
export interface SearchResult {
  id: string;
  type: "player" | "achievement" | "match" | "page";
  title: string;
  subtitle?: string;
  href: string;
  icon?: string;
}

// Current players data (simplified for search)
const currentPlayers = [
  { name: "Kiin", realName: "Kim Gi-in", role: "Top", href: "/team" },
  { name: "Canyon", realName: "Kim Geon-bu", role: "Jungle", href: "/team" },
  { name: "Chovy", realName: "Jeong Ji-hoon", role: "Mid", href: "/team" },
  { name: "Ruler", realName: "Park Jae-hyuk", role: "ADC", href: "/team" },
  { name: "Duro", realName: "Joo Min-kyu", role: "Support", href: "/team" },
];

// Alumni players (from alumni page)
const alumniPlayers = [
  { name: "Lehends", realName: "Son Si-woo", role: "Support", href: "/team/alumni" },
  { name: "Peyz", realName: "Kim Su-hwan", role: "ADC", href: "/team/alumni" },
  { name: "Peanut", realName: "Han Wang-ho", role: "Jungle", href: "/team/alumni" },
  { name: "Doran", realName: "Choi Hyeon-joon", role: "Top", href: "/team/alumni" },
  { name: "Delight", realName: "Lee Ji-hoon", role: "Support", href: "/team/alumni" },
  { name: "Clid", realName: "Kim Tae-min", role: "Jungle", href: "/team/alumni" },
  { name: "BDD", realName: "Gwak Bo-seong", role: "Mid", href: "/team/alumni" },
  { name: "Rascal", realName: "Kim Kwang-hee", role: "Top", href: "/team/alumni" },
  { name: "Life", realName: "Kim Jeong-min", role: "Support", href: "/team/alumni" },
  { name: "Ambition", realName: "Kang Chan-yong", role: "Jungle", href: "/team/alumni" },
  { name: "Haru", realName: "Kang Min-seung", role: "Jungle", href: "/team/alumni" },
  { name: "Crown", realName: "Lee Min-ho", role: "Mid", href: "/team/alumni" },
  { name: "CuVee", realName: "Lee Seong-jin", role: "Top", href: "/team/alumni" },
  { name: "CoreJJ", realName: "Jo Yong-in", role: "Support", href: "/team/alumni" },
  { name: "Mata", realName: "Cho Se-hyeong", role: "Support", href: "/team/alumni" },
  { name: "imp", realName: "Gu Seung-bin", role: "ADC", href: "/team/alumni" },
  { name: "PawN", realName: "Heo Won-seok", role: "Mid", href: "/team/alumni" },
  { name: "DanDy", realName: "Choi In-kyu", role: "Jungle", href: "/team/alumni" },
  { name: "Looper", realName: "Jang Hyeong-seok", role: "Top", href: "/team/alumni" },
  { name: "Dade", realName: "Bae Eo-jin", role: "Mid", href: "/team/alumni" },
  { name: "Deft", realName: "Kim Hyuk-kyu", role: "ADC", href: "/team/alumni" },
  { name: "Heart", realName: "Lee Kwan-hyung", role: "Support", href: "/team/alumni" },
  { name: "Spirit", realName: "Lee Da-yoon", role: "Jungle", href: "/team/alumni" },
  { name: "Acorn", realName: "Choi Cheon-ju", role: "Top", href: "/team/alumni" },
];

// Pages
const pages = [
  { title: "Team", href: "/team", icon: "👥" },
  { title: "Achievements", href: "/achievements", icon: "🏆" },
  { title: "Schedule", href: "/schedule", icon: "📅" },
  { title: "Gallery", href: "/gallery", icon: "📸" },
  { title: "Fan Zone", href: "/fan-zone", icon: "🎮" },
  { title: "Chovy Shrine", href: "/fan-zone/shrine", icon: "⛩️" },
  { title: "Alumni", href: "/team/alumni", icon: "👑" },
];

// Major achievements (simplified)
const achievements = [
  { title: "Worlds 2017 Champion", href: "/achievements", icon: "👑" },
  { title: "Worlds 2014 Champion", href: "/achievements", icon: "👑" },
  { title: "MSI 2025 Champion", href: "/achievements", icon: "🏆" },
  { title: "MSI 2024 Champion", href: "/achievements", icon: "🏆" },
  { title: "EWC 2025 Champion", href: "/achievements", icon: "🏆" },
  { title: "LCK Regular 2025", href: "/achievements", icon: "🏆" },
  { title: "LCK Spring 2024", href: "/achievements", icon: "🏆" },
  { title: "LCK Summer 2023", href: "/achievements", icon: "🏆" },
  { title: "LCK Spring 2023", href: "/achievements", icon: "🏆" },
  { title: "LCK Summer 2022", href: "/achievements", icon: "🏆" },
];

export function getAllSearchData(): SearchResult[] {
  const results: SearchResult[] = [];

  // Current players
  currentPlayers.forEach((player) => {
    results.push({
      id: `player-current-${player.name.toLowerCase()}`,
      type: "player",
      title: player.name,
      subtitle: `${player.realName} • ${player.role}`,
      href: player.href,
      icon: "👤",
    });
  });

  // Alumni players
  alumniPlayers.forEach((player) => {
    results.push({
      id: `player-alumni-${player.name.toLowerCase()}`,
      type: "player",
      title: player.name,
      subtitle: `${player.realName} • ${player.role}`,
      href: player.href,
      icon: "👑",
    });
  });

  // Pages
  pages.forEach((page) => {
    results.push({
      id: `page-${page.title.toLowerCase().replace(/\s+/g, "-")}`,
      type: "page",
      title: page.title,
      href: page.href,
      icon: page.icon,
    });
  });

  // Achievements
  achievements.forEach((achievement) => {
    results.push({
      id: `achievement-${achievement.title.toLowerCase().replace(/\s+/g, "-")}`,
      type: "achievement",
      title: achievement.title,
      href: achievement.href,
      icon: achievement.icon,
    });
  });

  return results;
}

export function search(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const allData = getAllSearchData();

  return allData.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(searchTerm);
    const subtitleMatch = item.subtitle?.toLowerCase().includes(searchTerm);
    return titleMatch || subtitleMatch;
  });
}
