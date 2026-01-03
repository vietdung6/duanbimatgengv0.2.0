"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

// Data Dragon API version
const DDRAGON_VERSION = "15.24.1";
const getSpellUrl = (spellId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${spellId}.png`;

// Summoner spells with Data Dragon IDs
const SUMMONER_SPELLS = [
    { name: "Flash", id: "SummonerFlash" },
    { name: "Ignite", id: "SummonerDot" },
    { name: "Teleport", id: "SummonerTeleport" },
    { name: "Heal", id: "SummonerHeal" },
    { name: "Exhaust", id: "SummonerExhaust" },
    { name: "Barrier", id: "SummonerBarrier" },
    { name: "Smite", id: "SummonerSmite" },
    { name: "Cleanse", id: "SummonerBoost" },
    { name: "Ghost", id: "SummonerHaste" },
    { name: "Mark", id: "SummonerSnowball" },
];

interface SpellSelectorProps {
    value: string;
    onChange: (value: string) => void;
    allowEmpty?: boolean;
}

export function SpellSelector({ value, onChange, allowEmpty = false }: SpellSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Find current spell
    const currentSpell = SUMMONER_SPELLS.find(s => s.name === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (spellName: string) => {
        onChange(spellName);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-8 h-8 bg-gray-800 border border-gray-700 rounded hover:border-gold focus:border-gold outline-none"
            >
                {currentSpell ? (
                    <img
                        src={getSpellUrl(currentSpell.id)}
                        alt={currentSpell.name}
                        className="w-6 h-6 rounded"
                    />
                ) : (
                    <span className="text-gray-500 text-xs">+</span>
                )}
            </button>

            {/* Dropdown - positioned to the right to avoid covering content */}
            {isOpen && (
                <div className="fixed z-[100] bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-2"
                    style={{
                        top: (containerRef.current?.getBoundingClientRect().bottom ?? 0) + 4 + 'px',
                        left: (containerRef.current?.getBoundingClientRect().left ?? 0) + 'px'
                    }}>
                    {/* Spell Grid - 2 rows of 5 */}
                    <div className="grid grid-cols-5 gap-1.5">
                        {allowEmpty && (
                            <button
                                type="button"
                                onClick={() => handleSelect("")}
                                className={`w-9 h-9 rounded flex items-center justify-center transition-all ${!value ? "ring-2 ring-gold bg-gold/20" : "hover:bg-gray-700"
                                    }`}
                            >
                                <X size={16} className="text-gray-500" />
                            </button>
                        )}
                        {SUMMONER_SPELLS.map((spell) => (
                            <button
                                key={spell.id}
                                type="button"
                                onClick={() => handleSelect(spell.name)}
                                className={`p-0.5 rounded transition-all ${value === spell.name
                                    ? "ring-2 ring-gold bg-gold/20"
                                    : "hover:bg-gray-700"
                                    }`}
                            >
                                <img
                                    src={getSpellUrl(spell.id)}
                                    alt=""
                                    className="w-8 h-8 rounded"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
