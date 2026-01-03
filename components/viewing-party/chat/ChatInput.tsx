import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { UserRole } from "@/lib/types/viewing-party";
import Link from "next/link";
import { LogIn, Ban } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isBanned?: boolean;
  currentUser?: {
    id: number;
    username: string | null;
    role: UserRole;
  } | null;
  slowModeDuration?: number;
}

export default function ChatInput({ onSend, disabled = false, isBanned = false, currentUser, slowModeDuration = 0 }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const isStaff = currentUser?.role === "staff" || currentUser?.role === "admin";
  const isCooldownActive = cooldown > 0 && !isStaff;

  // Use readOnly for temporary blocks (sending/cooldown) to preserve focus
  // Use disabled only for permanent blocks (admin disabled chat)
  const isTemporaryBlocked = isCooldownActive || isSending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || (disabled && !isStaff) || isTemporaryBlocked || (isBanned && !isStaff)) return;

    setIsSending(true);
    setShowEmojiPicker(false);
    try {
      await onSend(message);
      setMessage("");

      // Use setTimeout to ensure focus is restored after state updates and re-renders
      // This is crucial because readOnly/disabled states might cause focus loss during the process
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);

      if (!isStaff && slowModeDuration > 0) {
        setCooldown(slowModeDuration);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    // Don't close picker immediately to allow multiple selections
  };

  return (
    <div className="p-4 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-white/5 bg-[#111] shrink-0 relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
        {currentUser ? (
          <>
            <div className="relative flex-1 flex items-center bg-black/40 rounded-full border border-white/10 focus-within:border-gold/50 focus-within:bg-black/60 focus-within:shadow-[0_0_15px_rgba(170,128,24,0.1)] transition-all duration-300">
              {/* Emoji Button */}
              <div className="relative" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  suppressHydrationWarning
                  className={`p-3 text-gray-400 hover:text-gold transition-colors ${showEmojiPicker ? 'text-gold' : ''}`}
                  disabled={disabled || isTemporaryBlocked}
                >
                  <Smile size={20} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2">
                    <EmojiPicker
                      onSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  </div>
                )}
              </div>

              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                suppressHydrationWarning
                placeholder={
                  (disabled && !isStaff)
                    ? t.viewingParty.chat.placeholderDisabled
                    : (isBanned && !isStaff)
                      ? t.viewingParty.chat.placeholderMuted
                      : isCooldownActive
                        ? t.viewingParty.chat.placeholderSlowMode.replace("{seconds}", cooldown.toString())
                        : t.viewingParty.chat.placeholder
                }
                disabled={(disabled && !isStaff) || isTemporaryBlocked || (isBanned && !isStaff)}
                readOnly={isTemporaryBlocked}
                className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:ring-0 px-2 py-3 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              suppressHydrationWarning
              disabled={!message.trim() || (disabled && !isStaff) || isTemporaryBlocked || (isBanned && !isStaff)}
              className={`
                h-11 w-11 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg
                ${!message.trim() || (disabled && !isStaff) || isTemporaryBlocked || (isBanned && !isStaff)
                  ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                  : "bg-gold text-black hover:bg-white hover:scale-110 border border-gold hover:border-white shadow-gold/20"
                }
              `}
              title={t.viewingParty.chat.send}
            >
              {(isBanned && !isStaff) ? (
                <Ban size={20} />
              ) : isSending ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 border-dashed">
            <p className="text-sm text-gray-400">{t.viewingParty.chat.placeholderLogin}</p>
            <Link
              href="/login?redirect=/fan-zone/viewing-party"
              className="flex items-center gap-2 px-4 py-1.5 bg-gold text-black text-xs font-bold rounded-full hover:bg-white transition-all shadow-lg hover:shadow-gold/20"
            >
              <LogIn size={14} />
              {t.auth.login}
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
