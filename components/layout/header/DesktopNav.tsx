"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export default function DesktopNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {items.map((item) => (
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
  );
}
