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
  animalIcon?: string;
  champions?: string[];
  stats?: PlayerStats;
  image?: string;
  favorites?: string[];
}

interface PlayersJson {
  roster: Player[];
}

const typedData = playersData as PlayersJson;

export function getCurrentRoster(): Player[] {
  return typedData.roster.filter((p) => p.roleKey !== "mascot");
}

export function getMascot(): Player | undefined {
  return typedData.roster.find((p) => p.roleKey === "mascot");
}

export function getPlayerById(id: string): Player | undefined {
  return typedData.roster.find((p) => p.id === id);
}

