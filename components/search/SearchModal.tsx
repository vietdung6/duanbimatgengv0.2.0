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
  const { language } = useLanguage();

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
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] 
                     bg-black-light border border-black-charcoal rounded-xl shadow-2xl
                     max-h-[80vh] flex flex-col"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-black-charcoal">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === "en" ? "Search players, achievements, pages..." : "Tìm kiếm tuyển thủ, thành tích, trang..."}
                  className="w-full pl-10 pr-10 py-3 bg-black-charcoal border border-gray-700 
                           rounded-lg text-white placeholder-gray-500 focus:outline-none 
                           focus:border-gold transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-2">
              {query.trim().length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    {language === "en" 
                      ? "Start typing to search..." 
                      : "Bắt đầu gõ để tìm kiếm..."}
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">
                    {language === "en" 
                      ? "No results found" 
                      : "Không tìm thấy kết quả"}
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
                        className={`w-full text-left p-3 rounded-lg transition-all
                                 ${selectedIndex === index 
                                   ? "bg-gold/20 border border-gold/50" 
                                   : "bg-black-charcoal border border-transparent hover:bg-black-charcoal/80"}
                                 flex items-center gap-3 group`}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className={`flex-shrink-0 ${selectedIndex === index ? "text-gold" : "text-gray-400"}`}>
                          {result.icon ? (
                            <span className="text-xl">{result.icon}</span>
                          ) : (
                            getTypeIcon(result.type)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold ${selectedIndex === index ? "text-gold" : "text-white"}`}>
                              {result.title}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-700/50 text-gray-400">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          {result.subtitle && (
                            <p className="text-sm text-gray-400 truncate">{result.subtitle}</p>
                          )}
                        </div>
                        <ArrowRight 
                          size={16} 
                          className={`flex-shrink-0 transition-transform 
                                   ${selectedIndex === index ? "text-gold translate-x-1" : "text-gray-600 group-hover:text-gray-400"}`} 
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-black-charcoal text-xs text-gray-500 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-black-charcoal rounded">↑↓</kbd>
                  {language === "en" ? "Navigate" : "Điều hướng"}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-black-charcoal rounded">Enter</kbd>
                  {language === "en" ? "Select" : "Chọn"}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-black-charcoal rounded">Esc</kbd>
                  {language === "en" ? "Close" : "Đóng"}
                </span>
              </div>
              {results.length > 0 && (
                <span className="text-gold">
                  {results.length} {language === "en" ? "results" : "kết quả"}
                </span>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
