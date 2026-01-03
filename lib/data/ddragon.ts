// Data Dragon API utilities
// Version: 15.24.1

export const DDRAGON_VERSION = "15.24.1";

// Get champion image URL from Data Dragon CDN
export const getChampionImageUrl = (championId: string): string => {
    return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championId}.png`;
};

// Get summoner spell image URL from Data Dragon CDN
export const getSummonerSpellImageUrl = (spellName: string): string => {
    return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/Summoner${spellName}.png`;
};

// Get item image URL from Data Dragon CDN
export const getItemImageUrl = (itemId: number): string => {
    return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`;
};
