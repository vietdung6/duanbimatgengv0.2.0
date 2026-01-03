import playersData from "@/data/players.json";

export type PlayerRoleKey = "top" | "jungle" | "mid" | "adc" | "support" | "mascot" | string;

export interface PlayerStats {
  kda?: string;
  cs?: string;
  games?: string;
}

export interface Player {
  id: string;
  name: string;
  realName?: string;
  roleKey: PlayerRoleKey;
  flag: string;
  number?: string;
  featured?: boolean;
  color?: string;
  animalIcon?: string;
  champions?: string[];
  stats?: PlayerStats;
  image?: string;
  favorites?: string[];
  socials?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitch?: string;
  };
}

interface PlayersJson {
  roster: Player[];
  cl_roster: Player[];
}

const typedData = playersData as PlayersJson;

export function getCurrentRoster(): Player[] {
  return typedData.roster.filter((p) => p.roleKey !== "mascot");
}

export function getCLRoster(): Player[] {
  return typedData.cl_roster;
}

export function getMascot(): Player | undefined {
  return typedData.roster.find((p) => p.roleKey === "mascot");
}

export function getPlayerById(id: string): Player | undefined {
  const mainRoster = typedData.roster.find((p) => p.id === id);
  if (mainRoster) return mainRoster;
  return typedData.cl_roster.find((p) => p.id === id);
}

