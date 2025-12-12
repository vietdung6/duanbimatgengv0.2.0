"use client";

import { useState } from "react";
import { Lock, Layout, CalendarRange, Images, UserSquare2, ExternalLink } from "lucide-react";
import Link from "next/link";

const PASSWORD = "geng2025";

const adminModules = [
  {
    title: "Quản lý banner",
    description: "Cấu hình banner cho từng trang (coming soon).",
    href: "#",
    disabled: true,
    icon: Layout,
  },
  {
    title: "Lịch thi đấu & Kết quả",
    description: "Cập nhật lịch và kết quả trận đấu.",
    href: "/admin/schedule",
    disabled: false,
    icon: CalendarRange,
  },
  {
    title: "Thư viện (Gallery)",
    description: "Quản lý hình ảnh / video (coming soon).",
    href: "#",
    disabled: true,
    icon: Images,
  },
  {
    title: "Thông tin cá nhân",
    description: "Quản lý profile/giới thiệu (coming soon).",
    href: "#",
    disabled: true,
    icon: UserSquare2,
  },
];

export default function AdminHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Check localStorage once (client only)
  useState(() => {
    if (typeof window !== "undefined") {
      const authed = localStorage.getItem("adminAuthed") === "1";
      if (authed) setIsAuthenticated(true);
    }
  });

  const handleLogin = () => {
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthed", "1");
      setMessage("");
    } else {
      setMessage("Sai mật khẩu. Vui lòng thử lại.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="card-dark p-8 max-w-md w-full">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-gold" />
            <h1 className="font-heading text-2xl text-white">Admin</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Nhập mật khẩu"
            className="w-full bg-black-charcoal border border-gray-700 rounded-lg px-4 py-3 text-white mb-4 focus:border-gold focus:outline-none"
          />
          <button onClick={handleLogin} className="btn-gold w-full">
            Đăng nhập
          </button>
          {message && <p className="text-red-400 text-sm mt-4 text-center">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-white">Admin Control</h1>
          <p className="text-gray-400 mt-2">Chọn module để quản lý.</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {adminModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className={`card-dark bg-black/50 border border-gray-800 hover:border-gold/40 transition-colors ${
                  mod.disabled ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6 text-gold" />
                  <h3 className="font-heading text-xl text-white">{mod.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">{mod.description}</p>
                {mod.disabled ? (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    Coming soon
                  </span>
                ) : (
                  <Link
                    href={mod.href}
                    className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors text-sm"
                  >
                    Mở quản lý <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
