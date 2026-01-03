"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "vi" : "en");
  };

  if (mobile) {
      return (
        <div className="flex items-center gap-3 py-2 border-b border-black-charcoal w-full">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-gold" />
            <span className="font-heading text-lg text-white/80">{t.common.language}</span>
          </div>
          <div className="flex items-center bg-black-charcoal/50 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setLanguage('vi')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                language === 'vi' 
                  ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              VN
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                language === 'en' 
                  ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      );
    }

  return (
    <div className="flex items-center bg-black-charcoal/50 border border-gray-700/50 rounded-lg p-1 backdrop-blur-sm hover:border-gold/30 transition-colors">
      <button
        onClick={() => setLanguage('vi')}
        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all min-w-[32px] ${
          language === 'vi' 
            ? 'bg-gold text-black shadow-[0_0_8px_rgba(212,175,55,0.4)]' 
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        VN
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all min-w-[32px] ${
          language === 'en' 
            ? 'bg-gold text-black shadow-[0_0_8px_rgba(212,175,55,0.4)]' 
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
}
