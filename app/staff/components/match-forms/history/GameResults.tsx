"use client";

import React, { useState, useEffect } from "react";
import { FormSection } from "../shared/FormSection";
import { GamePlayerStats, PlayerStat, createEmptyGameStats } from "./GamePlayerStats";

export interface Game {
  result: 'win' | 'loss';
  side: 'blue' | 'red';
  duration: string;
  vodUrl: string;
  playerStats?: PlayerStat[];
}

interface GameResultsProps {
  games: Game[];
  squad?: any;
  onChange: (games: Game[]) => void;
}

export function GameResults({ games, squad, onChange }: GameResultsProps) {
  // If no games, init with 2 empty games for BO3
  useEffect(() => {
    if (!games || games.length === 0) {
      onChange([
        { result: 'win', side: 'blue', duration: '', vodUrl: '', playerStats: createEmptyGameStats(squad) },
        { result: 'win', side: 'red', duration: '', vodUrl: '', playerStats: createEmptyGameStats(squad) }
      ]);
    }
  }, [squad]); // Re-run when squad changes too

  // Update Gen.G player names when squad changes
  useEffect(() => {
    if (!squad || !Array.isArray(squad) || squad.length === 0) return;
    if (!games || games.length === 0) return;

    const newStats = createEmptyGameStats(squad);
    const genPlayerNames = newStats.filter(s => s.team === 'gen').map(s => ({ role: s.role, name: s.player_name }));

    const updatedGames = games.map(game => {
      if (!game.playerStats) return { ...game, playerStats: createEmptyGameStats(squad) };

      const updatedStats = game.playerStats.map(stat => {
        if (stat.team === 'gen') {
          const squadPlayer = genPlayerNames.find(p => p.role === stat.role);
          // Always update Gen.G player name from squad
          if (squadPlayer && squadPlayer.name) {
            return { ...stat, player_name: squadPlayer.name };
          }
        }
        return stat;
      });

      return { ...game, playerStats: updatedStats };
    });

    // Only update if something changed
    const hasChanges = JSON.stringify(updatedGames) !== JSON.stringify(games);
    if (hasChanges) {
      onChange(updatedGames as Game[]);
    }
  }, [squad]);

  const updateGame = (index: number, field: keyof Game, value: string) => {
    const newGames = [...games];
    newGames[index] = { ...newGames[index], [field]: value } as Game;
    onChange(newGames);
  };

  const addGame = () => {
    onChange([...games, { result: 'win', side: 'blue', duration: '', vodUrl: '', playerStats: createEmptyGameStats(squad) }]);
  };

  const updatePlayerStats = (gameIndex: number, stats: PlayerStat[]) => {
    const newGames = [...games];
    newGames[gameIndex] = { ...newGames[gameIndex], playerStats: stats } as Game;
    onChange(newGames);
  };

  const removeGame = (index: number) => {
    const newGames = games.filter((_, i) => i !== index);
    onChange(newGames);
  };

  // Validation logic
  const getSeriesValidation = () => {
    const wins = games.filter(g => g.result === 'win').length;
    const losses = games.filter(g => g.result === 'loss').length;
    const total = games.length;

    // BO1
    if (total === 1) {
      return { valid: true, message: 'BO1: 1 ván' };
    }

    // BO3
    if (total >= 2 && total <= 3) {
      if (wins === 2 || losses === 2) {
        return { valid: true, message: `BO3: ${wins}-${losses} ✓` };
      }
      return { valid: false, message: `BO3: ${wins}-${losses} - Phải có người thắng 2 ván!` };
    }

    // BO5
    if (total >= 3 && total <= 5) {
      if (wins === 3 || losses === 3) {
        return { valid: true, message: `BO5: ${wins}-${losses} ✓` };
      }
      return { valid: false, message: `BO5: ${wins}-${losses} - Phải có người thắng 3 ván!` };
    }

    return { valid: false, message: `${total} ván - Không hợp lệ! (Tối đa 5 ván)` };
  };

  const validation = getSeriesValidation();

  return (
    <FormSection title="Kết quả thi đấu (Game by Game)" required>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-gray-800/50">
            <tr>
              <th className="px-4 py-3">Game</th>
              <th className="px-4 py-3">Kết quả</th>
              <th className="px-4 py-3">Side</th>
              <th className="px-4 py-3">Thời lượng</th>
              <th className="px-4 py-3">VOD Link</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <React.Fragment key={index}>
                <tr className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium text-white">#{index + 1}</td>
                  <td className="px-4 py-3">
                    <select
                      value={game.result}
                      onChange={(e) => updateGame(index, 'result', e.target.value as 'win' | 'loss')}
                      className="bg-gray-800 border border-gray-700 rounded p-1 text-white focus:border-gold outline-none"
                    >
                      <option value="win">Thắng</option>
                      <option value="loss">Thua</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={game.side}
                      onChange={(e) => updateGame(index, 'side', e.target.value as 'blue' | 'red')}
                      className="bg-gray-800 border border-gray-700 rounded p-1 text-white focus:border-gold outline-none"
                    >
                      <option value="blue">Blue</option>
                      <option value="red">Red</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="mm:ss"
                      value={game.duration}
                      onChange={(e) => updateGame(index, 'duration', e.target.value)}
                      className="w-20 bg-gray-800 border border-gray-700 rounded p-1 text-white focus:border-gold outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={game.vodUrl}
                      onChange={(e) => updateGame(index, 'vodUrl', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-white focus:border-gold outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => removeGame(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
                {/* Player Stats Row - Expandable */}
                < tr className="bg-gray-900/30" >
                  <td colSpan={6} className="px-2 py-1">
                    <GamePlayerStats
                      gameIndex={index}
                      stats={game.playerStats || createEmptyGameStats()}
                      squad={squad}
                      onChange={(stats) => updatePlayerStats(index, stats)}
                    />
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div >

      <div className="mt-4 flex gap-4 items-center">
        <button
          onClick={addGame}
          type="button"
          className="text-xs text-gold hover:underline"
        >
          + Thêm ván đấu
        </button>

        {/* Validation Message */}
        <div className={`text-sm font-medium ${validation.valid ? 'text-green-400' : 'text-red-400'}`}>
          {validation.message}
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-gray-500">
        <strong>BO1:</strong> 1 ván | <strong>BO3:</strong> 2-3 ván (thắng 2) | <strong>BO5:</strong> 3-5 ván (thắng 3)
      </div>
    </FormSection >
  );
}
