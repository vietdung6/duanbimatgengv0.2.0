"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Trophy, Users, Calendar, Image as ImageIcon, Gamepad2, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import SearchModal from "@/components/search/SearchModal";
import Logo from "./header/Logo";
import DesktopNav, { NavItem } from "./header/DesktopNav";
import LanguageSwitcher from "./header/LanguageSwitcher";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";
import { usePWAInstall } from "./header/usePWAInstall";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const { handleInstallClick } = usePWAInstall();

  // Hide header in Viewing Party Room (immersive mode) and Admin Dashboard
  const isViewingPartyRoom = pathname?.startsWith('/fan-zone/viewing-party/') && pathname !== '/fan-zone/viewing-party';
  const isAdminPage = pathname?.startsWith('/admin');

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

  // Hide header on Secret Pages
  if (pathname?.startsWith('/portal-login') || pathname?.startsWith('/faker-secret-fanpage') || pathname?.startsWith('/chovy-cs-hack')) return null;

  if (isViewingPartyRoom || isAdminPage) return null;

  const navItems: NavItem[] = [
    { href: "/team", label: t.nav.team, icon: Users },
    { href: "/achievements", label: t.nav.achievements, icon: Trophy },
    { href: "/schedule", label: t.nav.schedule, icon: Calendar },
    { href: "/gallery", label: t.nav.gallery, icon: ImageIcon },
    { href: "/fan-zone", label: t.nav.fanZone, icon: Gamepad2 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#3D3D3D]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNav items={navItems} />

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

            {!loading && !user && <LanguageSwitcher />}

            <UserMenu onInstallPWA={handleInstallClick} />

            {/* CTA Button */}
            <Link href="/fan-zone/church" className="btn-gold !px-3 !py-1.5 text-xs flex items-center gap-2 shadow-none hover:shadow-gold-glow">
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
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navItems={navItems}
        onInstallPWA={handleInstallClick}
      />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
