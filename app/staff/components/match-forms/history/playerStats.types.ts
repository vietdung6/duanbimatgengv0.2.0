// Player stat entry for a single player in a game
export interface PlayerStat {
    player_name: string;
    role: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
    team: "gen" | "opp";
    champion: string;
    kills: number;
    deaths: number;
    assists: number;
    cs: number;
    gold: number;
    summoner1: string;
    summoner2: string;
    damage_dealt: number;
    damage_taken: number;
}

// Squad item type
export type SquadPlayer = {
    player_id: number;
    position: string;
    ign: string;
};

// Component props
export interface GamePlayerStatsProps {
    gameIndex: number;
    stats: PlayerStat[];
    squad?: SquadPlayer[] | null | undefined;
    onChange: (stats: PlayerStat[]) => void;
}
