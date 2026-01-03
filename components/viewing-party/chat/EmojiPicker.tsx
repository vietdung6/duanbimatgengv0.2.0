"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const DEFAULT_EMOJIS = [
  // Emotions
  "😀", "😂", "🤣", "😊", "🥰", "😍", "😎", "🤔", "😐", "😑",
  "🙄", "😣", "😥", "😮", "😫", "🥱", "😴", "😭", "😤", "😠",
  "😡", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "🤡", "👻",
  
  // Gestures & Body
  "👍", "👎", "👋", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "🦵",
  "👀", "👄", "💋", "💔", "❤️", "🧡", "💛", "💚", "💙", "💜",
  
  // Gen.G / Gaming / Events
  "🐯", "🏆", "🎮", "🕹️", "🎲", "🎯", "🎉", "🎊", "✨", "🔥",
  "💯", "💥", "💢", "💫", "⭐", "🌟", "⚡", "🌙", "☀️", "👑",
  "🥇", "🥈", "🥉", "🇰🇷", "⚔️", "🛡️", "📢", "📣", "🔔", "🎵"
];

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const { t } = useLanguage();
  
  return (
    <div className="absolute bottom-full left-0 mb-3 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl w-72 flex flex-col z-50 overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-white/5">
        <span className="text-sm text-gray-200 font-semibold tracking-wide">{t.viewingParty.chat.emotes}</span>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      {/* Emoji Grid */}
      <div className="p-3 grid grid-cols-6 gap-2 h-64 overflow-y-auto custom-scrollbar">
        {DEFAULT_EMOJIS.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            className="w-9 h-9 flex items-center justify-center text-xl hover:bg-white/10 rounded-lg transition-all hover:scale-110 active:scale-95"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {/* Footer hint */}
      <div className="px-3 py-2 bg-black/20 text-[10px] text-gray-500 text-center border-t border-white/5">
        Gen.G Fandom Emotes
      </div>
    </div>
  );
}
