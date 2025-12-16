"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Trophy, Users, Calendar, Image, Gamepad2, Globe, Search, Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SearchModal from "@/components/search/SearchModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPwaInfoOpen, setIsPwaInfoOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: "/team", label: t.nav.team, icon: Users },
    { href: "/achievements", label: t.nav.achievements, icon: Trophy },
    { href: "/schedule", label: t.nav.schedule, icon: Calendar },
    { href: "/gallery", label: t.nav.gallery, icon: Image },
    { href: "/fan-zone", label: t.nav.fanZone, icon: Gamepad2 },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "vi" : "en");
  };

  // Detect platform (iOS / Android) and standalone mode
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform("ios");
    } else if (/android/.test(ua)) {
      setPlatform("android");
    } else {
      setPlatform("other");
    }

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-ignore - iOS Safari specific
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
  }, []);

  // Capture beforeinstallprompt event for Android / supported browsers
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store event so we can trigger it later
      setDeferredPrompt(e as any);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
    };
  }, []);

  const handleInstallClick = async () => {
    // If already installed, just show info
    if (isStandalone) {
      setIsPwaInfoOpen(true);
      return;
    }

    // Android / supported browsers: trigger native prompt
    if (deferredPrompt) {
      // Some browsers require calling prompt on the stored event
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const promptEvent: any = deferredPrompt;
      promptEvent.prompt();
      try {
        await promptEvent.userChoice;
      } finally {
        setDeferredPrompt(null);
      }
      return;
    }

    // Fallback: show manual instructions (especially for iOS)
    setIsPwaInfoOpen(true);
  };

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-black-charcoal">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              className="w-12 h-12 flex items-center justify-center 
                        group-hover:shadow-gold-glow transition-all duration-300 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png" 
                alt="Gen.G Logo" 
                className="w-12 h-12 object-contain"
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-2xl text-gold uppercase tracking-wider">Gen.G</h1>
              <p className="text-xs text-gray-400 -mt-1">FANDOM</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-heading text-lg text-white/80 hover:text-gold 
                         transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold 
                               group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right side: Search + Language + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 
                       hover:border-gold/50 transition-colors text-sm group"
              aria-label="Search"
            >
              <Search size={16} className="text-gray-400 group-hover:text-gold transition-colors" />
              <kbd className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 text-xs 
                             bg-black-charcoal rounded border border-gray-700 text-gray-400">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 
                       hover:border-gold/50 transition-colors text-sm"
            >
              <Globe size={16} className="text-gold" />
              <span className="text-white font-medium">
                {language === "en" ? "EN" : "VI"}
              </span>
            </button>

            {/* Install PWA Button */}
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gold/70 
                       bg-black/40 hover:bg-gold/10 transition-colors text-sm"
              type="button"
            >
              <Download size={16} className="text-gold" />
              <span className="text-white font-medium">
                {isStandalone ? t.pwa.installedLabel : t.pwa.installButton}
              </span>
            </button>

            {/* CTA Button */}
            <Link href="/fan-zone/shrine" className="btn-gold text-sm flex items-center gap-2">
              <span>⛩️</span> {t.nav.enterShrine}
            </Link>
          </div>

          {/* Mobile: Search + Menu Buttons */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gold p-2 hover:bg-gold/10 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search size={24} />
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gold p-2 hover:bg-gold/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black-light border-t border-black-charcoal overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-white/80 hover:text-gold 
                               transition-colors py-2 border-b border-black-charcoal"
                    >
                      <Icon size={20} className="text-gold" />
                      <span className="font-heading text-xl">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 text-white/80 hover:text-gold 
                           transition-colors py-2 border-b border-black-charcoal w-full"
                >
                  <Search size={20} className="text-gold" />
                  <span className="font-heading text-xl">
                    {language === "en" ? "Search" : "Tìm kiếm"}
                  </span>
                </button>
              </motion.div>

              {/* Mobile Language Switcher */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 text-white/80 hover:text-gold 
                           transition-colors py-2 border-b border-black-charcoal w-full"
                >
                  <Globe size={20} className="text-gold" />
                  <span className="font-heading text-xl">
                    {language === "en" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
                  </span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/fan-zone/shrine"
                  onClick={() => setIsOpen(false)}
                  className="btn-gold text-center mt-4 block"
                >
                  ⛩️ {t.nav.enterShrine}
                </Link>
              </motion.div>

              {/* Mobile Install PWA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <button
                  onClick={() => {
                    handleInstallClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-3 mt-2 w-full px-4 py-3 rounded-lg border border-gold/70 
                           bg-black/40 text-white font-heading text-lg"
                  type="button"
                >
                  <Download size={20} className="text-gold" />
                  <span>{isStandalone ? t.pwa.installedLabel : t.pwa.installButton}</span>
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* PWA Info Modal */}
      <AnimatePresence>
        {isPwaInfoOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black-light border border-gold/40 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl text-gold tracking-wide">
                  {t.pwa.title}
                </h2>
                <button
                  onClick={() => setIsPwaInfoOpen(false)}
                  className="text-gray-400 hover:text-gold transition-colors"
                  type="button"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-200 leading-relaxed">
                {platform === "ios"
                  ? t.pwa.iosDescription
                  : platform === "android"
                  ? t.pwa.androidDescription
                  : t.pwa.otherDescription}
              </p>

              <div className="mt-4 border-t border-black-charcoal pt-4">
                <h3 className="font-heading text-sm text-gold mb-2 uppercase tracking-wider">
                  {t.pwa.howItWorksTitle}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {t.pwa.howItWorksText}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsPwaInfoOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition-colors"
                  type="button"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
