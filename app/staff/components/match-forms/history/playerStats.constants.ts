import { PlayerStat } from "./playerStats.types";

// Data Dragon version
export const DDRAGON_VERSION = "15.24.1";

// Helper to get spell image URL
export const getSpellUrl = (spellId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${spellId}.png`;

// Default spells by role
export const DEFAULT_SPELLS: Record<PlayerStat["role"], { spell1: string; spell2: string }> = {
    TOP: { spell1: "Flash", spell2: "Teleport" },
    JUG: { spell1: "Flash", spell2: "Smite" },
    MID: { spell1: "Flash", spell2: "Ignite" },
    ADC: { spell1: "Flash", spell2: "Barrier" },
    SUP: { spell1: "Flash", spell2: "Heal" },
};

// Summoner spell options with Data Dragon images
export const SUMMONER_SPELLS = [
    { name: "Flash", id: "SummonerFlash", image: getSpellUrl("SummonerFlash") },
    { name: "Ignite", id: "SummonerDot", image: getSpellUrl("SummonerDot") },
    { name: "Teleport", id: "SummonerTeleport", image: getSpellUrl("SummonerTeleport") },
    { name: "Heal", id: "SummonerHeal", image: getSpellUrl("SummonerHeal") },
    { name: "Exhaust", id: "SummonerExhaust", image: getSpellUrl("SummonerExhaust") },
    { name: "Barrier", id: "SummonerBarrier", image: getSpellUrl("SummonerBarrier") },
    { name: "Smite", id: "SummonerSmite", image: getSpellUrl("SummonerSmite") },
    { name: "Cleanse", id: "SummonerBoost", image: getSpellUrl("SummonerBoost") },
    { name: "Ghost", id: "SummonerHaste", image: getSpellUrl("SummonerHaste") },
    { name: "Mark", id: "SummonerSnowball", image: getSpellUrl("SummonerSnowball") },
];

// Role display names
export const ROLE_NAMES: Record<string, string> = {
    TOP: "Top",
    JUG: "Jungle",
    MID: "Mid",
    ADC: "ADC",
    SUP: "Support"
};

// Map position from squad to role
export const POSITION_TO_ROLE: Record<string, PlayerStat["role"]> = {
    "top": "TOP",
    "jungle": "JUG",
    "mid": "MID",
    "adc": "ADC",
    "support": "SUP",
};
