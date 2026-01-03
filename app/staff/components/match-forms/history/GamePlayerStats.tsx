"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { ChampionSelector } from "./ChampionSelector";
import { SpellSelector } from "./SpellSelector";
import { PlayerStat, SquadPlayer, GamePlayerStatsProps } from "./playerStats.types";
import { SUMMONER_SPELLS, POSITION_TO_ROLE } from "./playerStats.constants";
import { createEmptyGameStats } from "./playerStats.helpers";

// Re-export for backward compatibility
export type { PlayerStat, SquadPlayer };
export { createEmptyGameStats };


export function GamePlayerStats({ gameIndex, stats, squad, onChange }: GamePlayerStatsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const updateStat = (index: number, field: keyof PlayerStat, value: any) => {
        const newStats = [...stats];
        const currentPlayer = newStats[index];

        // Guard: ensure player exists
        if (!currentPlayer) return;

        // Special handling for spell selection
        if (field === "summoner1" || field === "summoner2") {
            // Smite restriction: only JUG can select Smite
            if (value === "Smite" && currentPlayer.role !== "JUG") {
                return; // Don't allow non-JUG to select Smite
            }

            // Swap logic: if selecting the same spell as the other slot, swap them
            const otherField = field === "summoner1" ? "summoner2" : "summoner1";
            const otherSpell = currentPlayer[otherField] as string;

            if (value === otherSpell && otherSpell) {
                // Swap: put current spell in other slot, new spell in this slot
                const currentSpell = currentPlayer[field] as string;
                newStats[index] = {
                    ...currentPlayer,
                    [field]: value,
                    [otherField]: currentSpell
                } as PlayerStat;
                onChange(newStats);
                return;
            }
        }

        newStats[index] = { ...newStats[index], [field]: value } as PlayerStat;
        onChange(newStats);
    };

    const genStats = stats.filter(s => s.team === "gen");
    const oppStats = stats.filter(s => s.team === "opp");

    // Function to manually fill Gen.G player names from squad
    const fillSquadNames = () => {
        if (!squad) return;

        const newStats = [...stats];

        // Handle both array format and object format
        if (Array.isArray(squad)) {
            // Array format: [{ player_id, position, ign }]
            newStats.forEach((stat, index) => {
                if (stat.team === "gen") {
                    const squadPlayer = squad.find(p => POSITION_TO_ROLE[p.position.toLowerCase()] === stat.role);
                    if (squadPlayer && squadPlayer.ign) {
                        newStats[index] = { ...stat, player_name: squadPlayer.ign };
                    }
                }
            });
        } else {
            // Object format: { top: "Doran", jungle: "Canyon", ... }
            const roleMap: Record<PlayerStat["role"], string> = {
                TOP: (squad as any).top || "",
                JUG: (squad as any).jungle || "",
                MID: (squad as any).mid || "",
                ADC: (squad as any).ad || "",
                SUP: (squad as any).support || ""
            };

            newStats.forEach((stat, index) => {
                if (stat.team === "gen" && roleMap[stat.role]) {
                    newStats[index] = { ...stat, player_name: roleMap[stat.role] };
                }
            });
        }

        onChange(newStats);
    };

    return (
        <div className="mt-2 border border-gray-700 rounded-lg overflow-hidden">
            {/* Toggle Header */}
            <div className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-sm text-gray-400">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 flex-1 text-left"
                >
                    <User size={14} />
                    Chi tiết Player Stats (Game #{gameIndex + 1})
                </button>
                <div className="flex items-center gap-3">
                    {squad && (Array.isArray(squad) ? squad.length > 0 : Object.keys(squad).length > 0) && (
                        <button
                            type="button"
                            onClick={fillSquadNames}
                            className="px-3 py-1 text-xs bg-gold/20 hover:bg-gold/30 text-gold rounded border border-gold/30 transition-colors"
                        >
                            Điền đội hình
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1"
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="p-4 space-y-6 bg-gray-900/50">
                    {/* Gen.G Team */}
                    <div>
                        <h4 className="text-gold font-heading text-sm uppercase tracking-wider mb-3">Gen.G</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left text-gray-400">
                                <thead className="text-[10px] text-gray-500 uppercase bg-gray-800/30">
                                    <tr>
                                        <th className="px-2 py-2">Player</th>
                                        <th className="px-2 py-2">Champion</th>
                                        <th className="px-2 py-2">K/D/A</th>
                                        <th className="px-2 py-2">CS</th>
                                        <th className="px-2 py-2">Gold</th>
                                        <th className="px-2 py-2">Spells</th>
                                        <th className="px-2 py-2">Dmg</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {genStats.map((stat, idx) => {
                                        const realIndex = stats.findIndex(s => s === stat);
                                        return (
                                            <tr key={idx} className="border-b border-gray-800">
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={stat.player_name}
                                                        onChange={(e) => updateStat(realIndex, "player_name", e.target.value)}
                                                        placeholder="IGN"
                                                        className="w-20 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-white focus:border-gold outline-none"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <ChampionSelector
                                                        value={stat.champion}
                                                        onChange={(value) => updateStat(realIndex, "champion", value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div className="flex gap-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.kills}
                                                            onChange={(e) => updateStat(realIndex, "kills", parseInt(e.target.value) || 0)}
                                                            className="w-10 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-green-400 focus:border-gold outline-none"
                                                        />
                                                        <span className="text-gray-600">/</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.deaths}
                                                            onChange={(e) => updateStat(realIndex, "deaths", parseInt(e.target.value) || 0)}
                                                            className="w-10 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-red-400 focus:border-gold outline-none"
                                                        />
                                                        <span className="text-gray-600">/</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.assists}
                                                            onChange={(e) => updateStat(realIndex, "assists", parseInt(e.target.value) || 0)}
                                                            className="w-10 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-blue-400 focus:border-gold outline-none"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={stat.cs}
                                                        onChange={(e) => updateStat(realIndex, "cs", parseInt(e.target.value) || 0)}
                                                        className="w-14 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-white focus:border-gold outline-none"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={stat.gold}
                                                        onChange={(e) => updateStat(realIndex, "gold", parseInt(e.target.value) || 0)}
                                                        placeholder="0"
                                                        className="w-16 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-yellow-400 focus:border-gold outline-none"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div className="flex gap-1">
                                                        <SpellSelector
                                                            value={stat.summoner1}
                                                            onChange={(value) => updateStat(realIndex, "summoner1", value)}
                                                        />
                                                        <SpellSelector
                                                            value={stat.summoner2}
                                                            onChange={(value) => updateStat(realIndex, "summoner2", value)}
                                                            allowEmpty
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.damage_dealt}
                                                            onChange={(e) => updateStat(realIndex, "damage_dealt", parseInt(e.target.value) || 0)}
                                                            placeholder="Dealt"
                                                            className="w-16 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-[10px] text-orange-400 focus:border-gold outline-none"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.damage_taken}
                                                            onChange={(e) => updateStat(realIndex, "damage_taken", parseInt(e.target.value) || 0)}
                                                            placeholder="Taken"
                                                            className="w-16 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-[10px] text-purple-400 focus:border-gold outline-none"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Opponent Team */}
                    <div>
                        <h4 className="text-red-400 font-heading text-sm uppercase tracking-wider mb-3">Đối thủ</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left text-gray-400">
                                <thead className="text-[10px] text-gray-500 uppercase bg-gray-800/30">
                                    <tr>
                                        <th className="px-2 py-2">Player</th>
                                        <th className="px-2 py-2">Champion</th>
                                        <th className="px-2 py-2">K/D/A</th>
                                        <th className="px-2 py-2">CS</th>
                                        <th className="px-2 py-2">Gold</th>
                                        <th className="px-2 py-2">Spells</th>
                                        <th className="px-2 py-2">Dmg</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {oppStats.map((stat, idx) => {
                                        const realIndex = stats.findIndex(s => s === stat);
                                        return (
                                            <tr key={idx} className="border-b border-gray-800">
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={stat.player_name}
                                                        onChange={(e) => updateStat(realIndex, "player_name", e.target.value)}
                                                        placeholder="(optional)"
                                                        className="w-20 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-white focus:border-gold outline-none"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <ChampionSelector
                                                        value={stat.champion}
                                                        onChange={(value) => updateStat(realIndex, "champion", value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div className="flex gap-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.kills}
                                                            onChange={(e) => updateStat(realIndex, "kills", parseInt(e.target.value) || 0)}
                                                            className="w-10 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-green-400 focus:border-gold outline-none"
                                                        />
                                                        <span className="text-gray-600">/</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.deaths}
                                                            onChange={(e) => updateStat(realIndex, "deaths", parseInt(e.target.value) || 0)}
                                                            className="w-10 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-red-400 focus:border-gold outline-none"
                                                        />
                                                        <span className="text-gray-600">/</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.assists}
                                                            onChange={(e) => updateStat(realIndex, "assists", parseInt(e.target.value) || 0)}
                                                            className="w-10 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-blue-400 focus:border-gold outline-none"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={stat.cs}
                                                        onChange={(e) => updateStat(realIndex, "cs", parseInt(e.target.value) || 0)}
                                                        className="w-14 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-white focus:border-gold outline-none"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={stat.gold}
                                                        onChange={(e) => updateStat(realIndex, "gold", parseInt(e.target.value) || 0)}
                                                        placeholder="0"
                                                        className="w-16 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-center text-yellow-400 focus:border-gold outline-none"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div className="flex gap-1">
                                                        <SpellSelector
                                                            value={stat.summoner1}
                                                            onChange={(value) => updateStat(realIndex, "summoner1", value)}
                                                        />
                                                        <SpellSelector
                                                            value={stat.summoner2}
                                                            onChange={(value) => updateStat(realIndex, "summoner2", value)}
                                                            allowEmpty
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.damage_dealt}
                                                            onChange={(e) => updateStat(realIndex, "damage_dealt", parseInt(e.target.value) || 0)}
                                                            placeholder="Dealt"
                                                            className="w-16 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-[10px] text-orange-400 focus:border-gold outline-none"
                                                        />
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stat.damage_taken}
                                                            onChange={(e) => updateStat(realIndex, "damage_taken", parseInt(e.target.value) || 0)}
                                                            placeholder="Taken"
                                                            className="w-16 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-[10px] text-purple-400 focus:border-gold outline-none"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
