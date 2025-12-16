"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, Trophy, Calendar, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { search, SearchResult } from "@/lib/search/searchData";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { language, t } = useLanguage();
  const common = t.common;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const searchResults = search(query);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          router.push(selected.href);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  const handleResultClick = (href: string) => {
    router.push(href);
    onClose();
    setQuery("");
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    if (language === "vi") {
      switch (type) {
        case "player": return "Tuyển thủ";
        case "achievement": return "Thành tích";
        case "match": return "Trận đấu";
        case "page": return "Trang";
        default: return "";
      }
    } else {
      switch (type) {
        case "player": return "Player";
        case "achievement": return "Achievement";
        case "match": return "Match";
        case "page": return "Page";
        default: return "";
      }
    }
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "player": return <Users size={16} />;
      case "achievement": return <Trophy size={16} />;
      case "match": return <Calendar size={16} />;
      case "page": return <ArrowRight size={16} />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-16 sm:top-20 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 
                     w-full sm:w-[calc(100%-2rem)] sm:max-w-2xl z-[101] 
                     bg-black-light border border-black-charcoal rounded-t-2xl sm:rounded-xl shadow-2xl
                     max-h-[85vh] sm:max-h-[80vh] flex flex-col mx-0 sm:mx-4"
          >
            {/* Search Input */}
            <div className="p-3 sm:p-4 border-b border-black-charcoal">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={common.searchPlaceholder}
                  className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-black-charcoal border border-gray-700 
                           rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none 
                           focus:border-gold transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-2">
              {query.trim().length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-400">
                  <Search size={40} className="mx-auto mb-3 sm:mb-4 opacity-50 sm:w-12 sm:h-12" />
                  <p className="text-xs sm:text-sm px-4">
                    {common.searchStartTyping}
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-400">
                  <p className="text-xs sm:text-sm px-4">
                    {common.searchNoResults}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <button
                        onClick={() => handleResultClick(result.href)}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-lg transition-all
                                 ${selectedIndex === index 
                                   ? "bg-gold/20 border border-gold/50" 
                                   : "bg-black-charcoal border border-transparent hover:bg-black-charcoal/80"}
                                 flex items-center gap-2 sm:gap-3 group touch-manipulation`}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onTouchStart={() => setSelectedIndex(index)}
                      >
                        <div className={`flex-shrink-0 ${selectedIndex === index ? "text-gold" : "text-gray-400"}`}>
                          {result.icon ? (
                            <span className="text-lg sm:text-xl">{result.icon}</span>
                          ) : (
                            <div className="scale-90 sm:scale-100">
                              {getTypeIcon(result.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                            <span className={`font-semibold text-sm sm:text-base ${selectedIndex === index ? "text-gold" : "text-white"}`}>
                              {result.title}
                            </span>
                            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-gray-700/50 text-gray-400">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          {result.subtitle && (
                            <p className="text-xs sm:text-sm text-gray-400 truncate">{result.subtitle}</p>
                          )}
                        </div>
                        <ArrowRight 
                          size={14} 
                          className={`flex-shrink-0 transition-transform sm:w-4 sm:h-4
                                   ${selectedIndex === index ? "text-gold translate-x-1" : "text-gray-600 group-hover:text-gray-400"}`} 
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 sm:p-3 border-t border-black-charcoal text-[10px] sm:text-xs text-gray-500 
                          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span className="hidden sm:flex items-center gap-1">
                  <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black-charcoal rounded text-[10px] sm:text-xs">↑↓</kbd>
                  <span className="hidden md:inline">{common.navigate}</span>
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black-charcoal rounded text-[10px] sm:text-xs">Enter</kbd>
                  <span className="hidden md:inline">{common.select}</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black-charcoal rounded text-[10px] sm:text-xs">Esc</kbd>
                  <span className="hidden sm:inline">{common.close}</span>
                </span>
              </div>
              {results.length > 0 && (
                <span className="text-gold text-xs sm:text-sm font-medium">
                  {results.length} {common.searchResultsLabel}
                </span>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
