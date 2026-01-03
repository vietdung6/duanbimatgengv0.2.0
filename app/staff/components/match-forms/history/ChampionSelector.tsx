"use client";

import { useState, useRef, useEffect } from "react";
import { CHAMPIONS, getChampionImageUrl, findChampionByName } from "@/lib/data/champions";
import { Search, X } from "lucide-react";

interface ChampionSelectorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function ChampionSelector({ value, onChange, placeholder = "Champion" }: ChampionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Find current champion
    const currentChampion = findChampionByName(value);
    const currentImage = currentChampion ? getChampionImageUrl(currentChampion.id) : null;

    // Filter champions by search
    const filteredChampions = CHAMPIONS.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

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

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (championId: string) => {
        onChange(championId);
        setIsOpen(false);
        setSearch("");
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
                className="flex items-center gap-1 w-24 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-white hover:border-gold focus:border-gold outline-none text-left"
            >
                {currentImage ? (
                    <>
                        <img
                            src={currentImage}
                            alt={currentChampion?.name}
                            className="w-5 h-5 rounded"
                        />
                        <span className="text-xs truncate flex-1">{currentChampion?.name}</span>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-gray-500 hover:text-red-400"
                        >
                            <X size={10} />
                        </button>
                    </>
                ) : (
                    <span className="text-xs text-gray-500 flex-1">{placeholder}</span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-700">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm tướng..."
                                className="w-full bg-gray-800 border border-gray-700 rounded pl-7 pr-2 py-1.5 text-xs text-white focus:border-gold outline-none"
                            />
                        </div>
                    </div>

                    {/* Champion Grid */}
                    <div className="max-h-48 overflow-y-auto p-2">
                        <div className="grid grid-cols-6 gap-1">
                            {filteredChampions.map((champion) => (
                                <button
                                    key={champion.id}
                                    type="button"
                                    onClick={() => handleSelect(champion.id)}
                                    className={`relative group p-0.5 rounded transition-all ${value === champion.id
                                            ? "ring-2 ring-gold bg-gold/20"
                                            : "hover:bg-gray-800"
                                        }`}
                                    title={champion.name}
                                >
                                    <img
                                        src={getChampionImageUrl(champion.id)}
                                        alt={champion.name}
                                        className="w-8 h-8 rounded"
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                        {filteredChampions.length === 0 && (
                            <p className="text-xs text-gray-500 text-center py-4">
                                Không tìm thấy tướng
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
