"use client";

import Link from "next/link";
import { Youtube, Instagram, Facebook, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// X (formerly Twitter) Logo Component
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { 
    icon: Globe, 
    href: "https://geng.gg/", 
    label: "Gen.G Official Website"
  },
  { 
    icon: XIcon, 
    href: "https://twitter.com/GenG", 
    label: "X (Twitter)"
  },
  { 
    icon: Youtube, 
    href: "https://www.youtube.com/@gengesports", 
    label: "YouTube" 
  },
  { 
    icon: Instagram, 
    href: "https://www.instagram.com/gengesports/", 
    label: "Instagram" 
  },
  { 
    icon: Facebook, 
    href: "https://www.facebook.com/GenGesports", 
    label: "Facebook" 
  },
];

export default function Footer() {
  const { t } = useLanguage();

  const exploreLinks = [
    { href: "/team", label: t.nav.team },
    { href: "/schedule", label: t.nav.schedule },
    { href: "/achievements", label: t.nav.achievements },
    { href: "/gallery", label: t.nav.gallery },
  ];

  const fanZoneLinks = [
    { href: "/fan-zone/predictions", label: t.footer.predictions },
    { href: "/fan-zone/shrine", label: t.footer.shrine },
    { href: "/fan-zone/quiz", label: t.footer.quiz },
    { href: "/fan-zone/community", label: t.footer.community },
  ];

  return (
    <footer className="bg-black border-t border-black-charcoal py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://am-a.akamaihd.net/image?resize=96:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1655210113163_GenG_logo_200407-05.png" 
                alt="Gen.G Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="font-heading text-xl text-gold uppercase tracking-wider">Gen.G</h3>
                <p className="text-xs text-gray-500">FANDOM</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-gold mb-4">{t.footer.explore}</h4>
            <ul className="space-y-2">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-gold transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fan Zone */}
          <div>
            <h4 className="font-heading text-lg text-gold mb-4">{t.footer.fanZone}</h4>
            <ul className="space-y-2">
              {fanZoneLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-gold transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-lg text-gold mb-4">{t.footer.officialGenG}</h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-black-light border border-black-charcoal 
                             rounded-lg flex items-center justify-center text-gray-400 
                             hover:text-gold hover:border-gold transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            <p className="text-gray-500 text-xs mt-4">
              {t.footer.followText}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-black-charcoal pt-8 flex flex-col md:flex-row 
                      justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            {t.footer.copyright}
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gold transition-colors">
              {t.footer.about}
            </Link>
            <Link href="/about/credits" className="hover:text-gold transition-colors">
              {t.footer.credits}
            </Link>
            <Link href="/about#contact" className="hover:text-gold transition-colors">
              {t.footer.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
