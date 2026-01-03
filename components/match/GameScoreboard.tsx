"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Clock, ExternalLink } from "lucide-react";

// ============ TYPES ============
interface PlayerStat {
    id: number;
    player_name: string | null;
    role: string;
    team: string;
    champion: string;
    kills: number;
    deaths: number;
    assists: number;
    cs: number;
    gold: number;
    summoner1: string | null;
    summoner2: string | null;
    damage_dealt: number | null;
    damage_taken: number | null;
}

interface Game {
    id: number;
    game_number: number;
    result: "win" | "loss";
    side: "blue" | "red";
    patch: string | null;
    vod_url: string | null;
    duration: string | null;
    player_stats?: PlayerStat[];
}

interface GameScoreboardProps {
    games: Game[];
    homeTeamName: string;
    homeTeamLogo: string;
    opponentName: string;
    opponentLogo: string | null;
}

// ============ CONSTANTS ============
const ROLE_ORDER = ["TOP", "JUG", "MID", "ADC", "SUP"];

// Summoner spell images from LoL Wiki
const SPELL_IMAGES: Record<string, string> = {
    "Flash": "https://wiki.leagueoflegends.com/en-us/images/Flash.png",
    "Ignite": "https://wiki.leagueoflegends.com/en-us/images/Ignite.png",
    "Teleport": "https://wiki.leagueoflegends.com/en-us/images/Teleport.png",
    "Heal": "https://wiki.leagueoflegends.com/en-us/images/Heal.png",
    "Exhaust": "https://wiki.leagueoflegends.com/en-us/images/Exhaust.png",
    "Barrier": "https://wiki.leagueoflegends.com/en-us/images/Barrier.png",
    "Smite": "https://wiki.leagueoflegends.com/en-us/images/Smite.png",
    "Cleanse": "https://wiki.leagueoflegends.com/en-us/images/Cleanse.png",
    "Ghost": "https://wiki.leagueoflegends.com/en-us/images/Ghost.png",
    "Mark": "",
};

// Grid layout constants
const GRID_LEFT = "grid-cols-[auto_1fr_60px_45px_50px_50px]";
const GRID_RIGHT = "grid-cols-[50px_50px_45px_60px_1fr_auto]";

// ============ UTILITIES ============
const formatGold = (gold: number): string => (gold / 1000).toFixed(1) + "k";
const formatDamage = (damage: number | null): string => damage ? (damage / 1000).toFixed(1) + "k" : "-";
const getSummonerSpellImage = (spell: string | null): string | null => spell ? SPELL_IMAGES[spell] || null : null;

// ============ SUB-COMPONENTS ============

// Champion icon with summoner spells
function ChampionWithSpells({ champion, summoner1, summoner2, reverse = false }: {
    champion: string;
    summoner1: string | null;
    summoner2: string | null;
    reverse?: boolean;
}) {
    return (
        <div className={`flex items-center gap-1 ${reverse ? "flex-row-reverse ml-2" : "mr-2"}`}>
            <div className="w-8 h-8 rounded bg-gray-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] text-gray-500">{champion.slice(0, 3)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
                {[summoner1, summoner2].map((spell, idx) => {
                    const spellImg = getSummonerSpellImage(spell);
                    return (
                        <div key={idx} className="w-4 h-4 rounded-sm bg-gray-800 border border-white/10 flex items-center justify-center overflow-hidden">
                            {spellImg ? (
                                <img src={spellImg} alt={spell || ""} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[7px] text-gray-600">{spell?.slice(0, 1) || "-"}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Player info (name + champion)
function PlayerInfo({ playerName, champion, align }: {
    playerName: string | null;
    champion: string;
    align: "left" | "right";
}) {
    return (
        <div className={`text-${align}`}>
            <div className="text-xs text-white font-medium truncate">{playerName || "-"}</div>
            <div className="text-[10px] text-gray-500">{champion}</div>
        </div>
    );
}

// KDA display
function KDADisplay({ kills, deaths, assists }: { kills: number; deaths: number; assists: number }) {
    return (
        <div className="text-center">
            <span className="text-green-400">{kills}</span>
            <span className="text-gray-600">/</span>
            <span className="text-red-400">{deaths}</span>
            <span className="text-gray-600">/</span>
            <span className="text-blue-400">{assists}</span>
        </div>
    );
}

// Player row component
function PlayerRow({ player, side }: { player: PlayerStat; side: "left" | "right" }) {
    const isLeft = side === "left";

    return (
        <div className={`grid py-2 px-3 hover:bg-white/5 transition-colors items-center text-xs ${isLeft ? GRID_LEFT : GRID_RIGHT}`}>
            {isLeft ? (
                <>
                    <ChampionWithSpells champion={player.champion} summoner1={player.summoner1} summoner2={player.summoner2} />
                    <PlayerInfo playerName={player.player_name} champion={player.champion} align="left" />
                    <KDADisplay kills={player.kills} deaths={player.deaths} assists={player.assists} />
                    <div className="text-center text-gray-400">{player.cs}</div>
                    <div className="text-center text-yellow-400">{formatGold(player.gold)}</div>
                    <div className="text-center text-orange-400">{formatDamage(player.damage_dealt)}</div>
                </>
            ) : (
                <>
                    <div className="text-center text-orange-400">{formatDamage(player.damage_dealt)}</div>
                    <div className="text-center text-yellow-400">{formatGold(player.gold)}</div>
                    <div className="text-center text-gray-400">{player.cs}</div>
                    <KDADisplay kills={player.kills} deaths={player.deaths} assists={player.assists} />
                    <PlayerInfo playerName={player.player_name} champion={player.champion} align="right" />
                    <ChampionWithSpells champion={player.champion} summoner1={player.summoner1} summoner2={player.summoner2} reverse />
                </>
            )}
        </div>
    );
}

// Table header row
function StatsHeader({ side }: { side: "left" | "right" }) {
    const isLeft = side === "left";
    const gridClass = isLeft ? GRID_LEFT : GRID_RIGHT;

    return (
        <div className={`grid ${gridClass} px-3 py-2 bg-white/5 border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-wider items-center`}>
            {isLeft ? (
                <>
                    <div className="mr-2">CHAMP</div>
                    <div>Player</div>
                    <div className="text-center">KDA</div>
                    <div className="text-center">CS</div>
                    <div className="text-center">Gold</div>
                    <div className="text-center">Dmg</div>
                </>
            ) : (
                <>
                    <div className="text-center">Dmg</div>
                    <div className="text-center">Gold</div>
                    <div className="text-center">CS</div>
                    <div className="text-center">KDA</div>
                    <div className="text-right">Player</div>
                    <div className="ml-2 text-right">CHAMP</div>
                </>
            )}
        </div>
    );
}

// Team stats section
function TeamStatsSection({ players, side, emptyMessage }: {
    players: PlayerStat[];
    side: "left" | "right";
    emptyMessage: string;
}) {
    return (
        <div className={side === "left" ? "border-r border-white/5" : ""}>
            <StatsHeader side={side} />
            {players.map((player, idx) => (
                <PlayerRow key={idx} player={player} side={side} />
            ))}
            {players.length === 0 && (
                <div className="p-4 text-center text-gray-600 text-xs">{emptyMessage}</div>
            )}
        </div>
    );
}

// Game tab button
function GameTab({ game, isActive, onClick }: {
    game: Game;
    isActive: boolean;
    onClick: () => void;
}) {
    const isWin = game.result === "win";

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-heading uppercase tracking-wider transition-all border-b-2
                ${isActive ? "text-white border-gold bg-white/5" : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5"}`}
        >
            <div className="flex items-center gap-2">
                <span>Game {game.game_number}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isWin ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {isWin ? "W" : "L"}
                </span>
            </div>
        </button>
    );
}

// Team logo with side indicator
function TeamLogo({ logo, name, side, isHome }: {
    logo: string | null;
    name: string;
    side: "blue" | "red";
    isHome: boolean;
}) {
    const bgColor = side === "blue" ? "bg-blue-500/10 border-blue-500/30" : "bg-red-500/10 border-red-500/30";
    const textColor = side === "blue" ? "text-blue-400" : "text-red-400";

    return (
        <div className={`flex items-center gap-3 ${isHome ? "" : "flex-row-reverse"}`}>
            <div className={`w-12 h-12 rounded-lg p-2 flex items-center justify-center border ${bgColor}`}>
                {logo ? (
                    <img src={logo} alt={name} className="w-full h-full object-contain" />
                ) : (
                    <span className="text-gray-500 text-xs">{name.slice(0, 2)}</span>
                )}
            </div>
            <div className={isHome ? "" : "text-right"}>
                <div className="text-white font-heading uppercase text-lg">{name}</div>
                <div className={`text-xs ${textColor}`}>{side.toUpperCase()} SIDE</div>
            </div>
        </div>
    );
}

// Game result display
function GameResult({ game }: { game: Game }) {
    return (
        <div className="text-center">
            <div className={`text-2xl font-heading uppercase ${game.result === "win" ? "text-green-500" : "text-red-500"}`}>
                {game.result === "win" ? "VICTORY" : "DEFEAT"}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-1">
                {game.duration && (
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{game.duration}</span>
                    </div>
                )}
                {game.patch && <div>Patch {game.patch}</div>}
                {game.vod_url && (
                    <a href={game.vod_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold hover:underline">
                        <ExternalLink size={12} />
                        VOD
                    </a>
                )}
            </div>
        </div>
    );
}

// ============ MAIN COMPONENT ============
export function GameScoreboard({ games, homeTeamName, homeTeamLogo, opponentName, opponentLogo }: GameScoreboardProps) {
    const [activeGameIndex, setActiveGameIndex] = useState(0);
    const activeGame = games[activeGameIndex];

    if (!games || games.length === 0 || !activeGame) {
        return (
            <div className="bg-[#0A0A0A] border border-white/5 border-dashed rounded-xl p-12 text-center">
                <p className="text-gray-500 font-heading uppercase tracking-widest text-sm">Chưa có thông tin chi tiết từng ván</p>
            </div>
        );
    }

    const genStats = (activeGame.player_stats || [])
        .filter(ps => ps.team === "gen")
        .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));

    const oppStats = (activeGame.player_stats || [])
        .filter(ps => ps.team === "opp")
        .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));

    const hasStats = genStats.length > 0 || oppStats.length > 0;
    const homeSide = activeGame.side;
    const oppSide = homeSide === "blue" ? "red" : "blue";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
            {/* Game Tabs */}
            <div className="flex items-center border-b border-white/5 bg-black/50 overflow-x-auto">
                {games.map((game, index) => (
                    <GameTab key={game.id} game={game} isActive={index === activeGameIndex} onClick={() => setActiveGameIndex(index)} />
                ))}
            </div>

            {/* Game Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <TeamLogo logo={homeTeamLogo} name={homeTeamName} side={homeSide} isHome />
                    <GameResult game={activeGame} />
                    <TeamLogo logo={opponentLogo} name={opponentName} side={oppSide} isHome={false} />
                </div>
            </div>

            {/* Player Stats - Two Columns */}
            {hasStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <TeamStatsSection players={genStats} side="left" emptyMessage="Chưa có dữ liệu" />
                    <TeamStatsSection players={oppStats} side="right" emptyMessage="Chưa có dữ liệu" />
                </div>
            ) : (
                <div className="p-8 text-center text-gray-600 text-sm">Chưa có thông tin chi tiết player cho ván này</div>
            )}
        </motion.div>
    );
}
