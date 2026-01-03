import { PlayerStat, SquadPlayer } from "./playerStats.types";
import { DEFAULT_SPELLS, POSITION_TO_ROLE } from "./playerStats.constants";

// Default empty stat for a player
const createEmptyStat = (role: PlayerStat["role"], team: PlayerStat["team"], playerName: string = ""): PlayerStat => ({
    player_name: playerName,
    role,
    team,
    champion: "",
    kills: 0,
    deaths: 0,
    assists: 0,
    cs: 0,
    gold: 0,
    summoner1: DEFAULT_SPELLS[role].spell1,
    summoner2: DEFAULT_SPELLS[role].spell2,
    damage_dealt: 0,
    damage_taken: 0,
});

// Default empty stats for all 10 players, optionally filling Gen.G names from squad
export const createEmptyGameStats = (squad?: SquadPlayer[] | null): PlayerStat[] => {
    // Get player IGN by role from squad
    const getPlayerByRole = (role: PlayerStat["role"]): string => {
        if (!squad || !Array.isArray(squad)) return "";
        const player = squad.find(p => POSITION_TO_ROLE[p.position.toLowerCase()] === role);
        return player?.ign || "";
    };

    return [
        createEmptyStat("TOP", "gen", getPlayerByRole("TOP")),
        createEmptyStat("JUG", "gen", getPlayerByRole("JUG")),
        createEmptyStat("MID", "gen", getPlayerByRole("MID")),
        createEmptyStat("ADC", "gen", getPlayerByRole("ADC")),
        createEmptyStat("SUP", "gen", getPlayerByRole("SUP")),
        createEmptyStat("TOP", "opp"),
        createEmptyStat("JUG", "opp"),
        createEmptyStat("MID", "opp"),
        createEmptyStat("ADC", "opp"),
        createEmptyStat("SUP", "opp"),
    ];
};
