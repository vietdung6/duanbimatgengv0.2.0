"use client";

import { useState, useEffect } from "react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  LogOut,
  Settings,
  Shield,
  ExternalLink,
  Users,
  AlertTriangle,
  Bug,
  Terminal,
  Server,
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import Loading from "@/components/ui/Loading";



// Mock Data for Bug Reports
const MOCK_REPORTS = [
  { id: 101, title: "Chat không hiển thị emoji", reporter: "user123", status: "open", priority: "medium", created_at: "2024-03-19" },
  { id: 102, title: "Lỗi đăng nhập bằng Google", reporter: "fan_boy_99", status: "in_progress", priority: "high", created_at: "2024-03-18" },
  { id: 103, title: "Sai màu background ở trang About", reporter: "staff_member", status: "resolved", priority: "low", created_at: "2024-03-15" },
];

export default function AdminPage() {
  const ready = useRequireAdmin();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"setup" | "logs" | "reports">("setup");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Setup State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(true);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Logs State
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Fetch Config on Load
  useEffect(() => {
    setLoadingConfig(true);
    fetch('/api/admin/system/config')
      .then(res => res.json())
      .then(data => {
        if (data.maintenance_mode !== undefined) setMaintenanceMode(data.maintenance_mode === 'true');
        if (data.registration_enabled !== undefined) setRegistrationEnabled(data.registration_enabled === 'true');
      })
      .catch(err => console.error("Failed to load config", err))
      .finally(() => setLoadingConfig(false));
  }, []);

  // Fetch Logs when tab changes
  useEffect(() => {
    if (activeTab === "logs") {
      setLoadingLogs(true);
      fetch('/api/admin/system/logs')
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server Error: ${res.status} ${text}`);
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setLogs(data);
          }
        })
        .catch(err => {
          console.error("Failed to fetch logs", err);
          // Optional: Set logs to empty or show error state
          setLogs([]);
        })
        .finally(() => setLoadingLogs(false));
    }
  }, [activeTab]);

  const toggleMaintenance = async () => {
    const newValue = !maintenanceMode;
    setMaintenanceMode(newValue); // Optimistic update
    try {
      await fetch('/api/admin/system/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'maintenance_mode', value: newValue.toString() }),
      });
    } catch (e) {
      console.error("Failed to update maintenance mode", e);
      setMaintenanceMode(!newValue); // Revert
    }
  };

  const toggleRegistration = async () => {
    const newValue = !registrationEnabled;
    setRegistrationEnabled(newValue);
    try {
      await fetch('/api/admin/system/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'registration_enabled', value: newValue.toString() }),
      });
    } catch (e) {
      console.error("Failed to update registration status", e);
      setRegistrationEnabled(!newValue);
    }
  };

  if (!ready) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-gold/30">
      <div className="flex h-screen overflow-hidden flex-col md:flex-row">

        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#050505] relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-black shadow-gold-glow">
              <Terminal size={16} strokeWidth={2.5} />
            </div>
            <span className="font-heading text-lg text-white tracking-wider">ADMIN</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gold hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE SIDEBAR OVERLAY */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-[#050505] border-r border-white/10 flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex items-center gap-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-black shadow-gold-glow">
                  <Terminal size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="font-heading text-xl text-white tracking-wider">QUẢN TRỊ VIÊN</h1>
                  <p className="text-xs text-gold/80 font-medium tracking-widest uppercase">System Admin</p>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                <div className="px-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Công Cụ Hệ Thống</div>
                <button
                  onClick={() => { setActiveTab("setup"); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 ${activeTab === "setup"
                    ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                >
                  <Settings size={20} />
                  Cấu Hình Hệ Thống
                </button>
                <button
                  onClick={() => { setActiveTab("logs"); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 ${activeTab === "logs"
                    ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                >
                  <AlertTriangle size={20} />
                  Nhật Ký Lỗi
                </button>
                <button
                  onClick={() => { setActiveTab("reports"); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 ${activeTab === "reports"
                    ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                >
                  <Bug size={20} />
                  Báo Cáo Lỗi
                </button>
                <Link
                  href="/admin/finance"
                  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                >
                  <DollarSign size={20} />
                  Quản Lý Donate
                </Link>
                <div className="my-4 border-t border-white/10"></div>
                <Link
                  href="/staff"
                  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                >
                  <ExternalLink size={20} />
                  Cổng Staff (CMS)
                </Link>
              </nav>

              <div className="p-4 border-t border-white/10">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-white hover:bg-red-500/80 border border-red-500/20 hover:border-red-500/50 px-4 py-3 rounded-lg transition-all duration-300 text-xs font-bold uppercase tracking-wider"
                >
                  <LogOut size={16} />
                  Đăng Xuất
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar (Desktop) */}
        <aside className="w-72 bg-[#050505] border-r border-white/10 hidden md:flex flex-col relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

          <div className="p-8 flex items-center gap-4 z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-black shadow-gold-glow">
              <Terminal size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading text-xl text-white tracking-wider">QUẢN TRỊ VIÊN</h1>
              <p className="text-xs text-gold/80 font-medium tracking-widest uppercase">System Admin</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 z-10 mt-4">
            <div className="px-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Công Cụ Hệ Thống</div>

            <button
              onClick={() => setActiveTab("setup")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 group ${activeTab === "setup"
                ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
            >
              <Settings size={20} className={`transition-transform duration-300 ${activeTab === "setup" ? "scale-110" : "group-hover:scale-110"}`} />
              Cấu Hình Hệ Thống
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 group ${activeTab === "logs"
                ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
            >
              <AlertTriangle size={20} className={`transition-transform duration-300 ${activeTab === "logs" ? "scale-110" : "group-hover:scale-110"}`} />
              Nhật Ký Lỗi
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 group ${activeTab === "reports"
                ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
            >
              <Bug size={20} className={`transition-transform duration-300 ${activeTab === "reports" ? "scale-110" : "group-hover:scale-110"}`} />
              Báo Cáo Lỗi
            </button>

            <Link
              href="/admin/finance"
              className="w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 group text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            >
              <DollarSign size={20} className="group-hover:scale-110 transition-transform duration-300" />
              Quản Lý Donate
            </Link>

            <div className="my-4 border-t border-white/10"></div>

            <Link
              href="/staff"
              className="w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 group text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            >
              <ExternalLink size={20} className="group-hover:scale-110 transition-transform duration-300" />
              Cổng Staff (CMS)
            </Link>
          </nav>

          <div className="p-4 z-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 overflow-hidden ring-2 ring-gold/20">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Users size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.displayName}</p>
                  <p className="text-[10px] text-gold uppercase tracking-wider font-bold truncate">DEV_ADMIN</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-white hover:bg-red-500/80 border border-red-500/20 hover:border-red-500/50 px-4 py-2 rounded-lg transition-all duration-300 text-xs font-bold uppercase tracking-wider"
              >
                <LogOut size={14} />
                Đăng Xuất
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-black relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

          <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-10">
            <header className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-4xl font-heading text-white mb-2 uppercase tracking-wide">
                  {activeTab === "setup" && <span className="text-gradient-gold">Cấu Hình Hệ Thống</span>}
                  {activeTab === "logs" && <span className="text-gradient-gold">Nhật Ký Hệ Thống</span>}
                  {activeTab === "reports" && <span className="text-gradient-gold">Báo Cáo Lỗi</span>}
                </h2>
                <p className="text-gray-400 font-light">
                  {activeTab === "setup" && "Quản lý biến môi trường, tính năng và trạng thái hệ thống."}
                  {activeTab === "logs" && "Theo dõi lỗi hệ thống, cảnh báo và sự kiện vận hành."}
                  {activeTab === "reports" && "Theo dõi và xử lý các vấn đề được người dùng báo cáo."}
                </p>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">MÔI TRƯỜNG</div>
                <div className="font-mono text-gold text-sm flex items-center gap-2 justify-end">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  PRODUCTION
                </div>
              </div>
            </header>

            {/* TAB: SYSTEM SETUP */}
            {activeTab === "setup" && (
              <div className="space-y-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card-dark bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold">Chế Độ Bảo Trì</h3>
                        <Server size={20} className={maintenanceMode ? "text-red-500" : "text-gray-500"} />
                      </div>
                      <p className="text-sm text-gray-400 mb-6">Vô hiệu hóa truy cập người dùng. Chỉ admin mới có thể đăng nhập.</p>
                    </div>
                    <button
                      onClick={toggleMaintenance}
                      className={`w-full py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${maintenanceMode
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {maintenanceMode ? "Hủy Kích Hoạt" : "Kích Hoạt"}
                    </button>
                  </div>

                  <div className="card-dark bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold">Chế Độ Debug</h3>
                        <Terminal size={20} className={debugMode ? "text-gold" : "text-gray-500"} />
                      </div>
                      <p className="text-sm text-gray-400 mb-6">Hiển thị chi tiết lỗi và công cụ nhà phát triển.</p>
                    </div>
                    <button
                      onClick={() => setDebugMode(!debugMode)}
                      className={`w-full py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${debugMode
                        ? "bg-gold text-black hover:bg-gold-light"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {debugMode ? "Đã Bật" : "Đã Tắt"}
                    </button>
                  </div>

                  <div className="card-dark bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold">Đăng Ký Thành Viên</h3>
                        <Users size={20} className={registrationEnabled ? "text-green-500" : "text-red-500"} />
                      </div>
                      <p className="text-sm text-gray-400 mb-6">Cho phép người dùng mới đăng ký qua link mời.</p>
                    </div>
                    <button
                      onClick={() => setRegistrationEnabled(!registrationEnabled)}
                      className={`w-full py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${registrationEnabled
                        ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/50"
                        : "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50"
                        }`}
                    >
                      {registrationEnabled ? "Cho Phép" : "Chặn"}
                    </button>
                  </div>
                </div>

                {/* Environment Variables (Mocked) */}
                <div className="card-dark bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                  <h3 className="font-heading text-lg text-white mb-6 flex items-center gap-2">
                    <Database size={18} className="text-gold" />
                    Cấu Hình Môi Trường
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: "NEXT_PUBLIC_API_URL", value: "https://api.gen-g-fandom.com/v1" },
                      { key: "DATABASE_URL", value: "postgres://********:5432/geng_db" },
                      { key: "JWT_SECRET", value: "********************************" },
                      { key: "CLOUDFLARE_ZONE_ID", value: "892347******************" }
                    ].map((env, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-gold/20 transition-colors">
                        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">{env.key}</span>
                        <span className="font-mono text-sm text-white bg-black px-2 py-1 rounded border border-white/10">{env.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ERROR LOGS */}
            {activeTab === "logs" && (
              <div className="space-y-6">
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="Tìm kiếm log..." className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-gold/50 outline-none" />
                  </div>
                  <button className="px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-gold/30 transition-colors">
                    <Filter size={18} />
                  </button>
                  <button className="px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-gold hover:bg-gold/10 transition-colors">
                    <RefreshCw size={18} />
                  </button>
                </div>

                <div className="card-dark bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mức Độ</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời Gian</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nguồn</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nội Dung</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingLogs ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500 italic">Đang tải dữ liệu...</td>
                          </tr>
                        ) : logs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500 italic">Chưa có nhật ký nào.</td>
                          </tr>
                        ) : (
                          logs.map((log) => (
                            <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                {log.level === 'ERROR' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-500 text-[10px] font-bold uppercase"><XCircle size={12} /> Error</span>}
                                {log.level === 'WARN' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase"><AlertCircle size={12} /> Warn</span>}
                                {log.level === 'INFO' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 text-blue-500 text-[10px] font-bold uppercase"><CheckCircle size={12} /> Info</span>}
                                {/* Fallback for lowercase or other levels if needed, though Prisma enum is usually uppercase */}
                                {log.level === 'error' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-500 text-[10px] font-bold uppercase"><XCircle size={12} /> Error</span>}
                                {log.level === 'warn' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase"><AlertCircle size={12} /> Warn</span>}
                                {log.level === 'info' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 text-blue-500 text-[10px] font-bold uppercase"><CheckCircle size={12} /> Info</span>}
                              </td>
                              <td className="p-4 font-mono text-xs text-gray-400">
                                {new Date(log.created_at).toLocaleString('vi-VN')}
                              </td>
                              <td className="p-4 text-xs text-gray-300">{log.type}</td>
                              <td className="p-4 text-sm text-white max-w-xs truncate">{log.message}</td>
                              <td className="p-4">
                                <button className="text-xs text-gold hover:underline">Chi tiết</button>
                              </td>
                            </tr>
                          )))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BUG REPORTS */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_REPORTS.map((report) => (
                    <div key={report.id} className="card-dark bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl group hover:border-gold/30 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${report.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                          report.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                          Ưu tiên {report.priority === 'high' ? 'Cao' : report.priority === 'medium' ? 'TB' : 'Thấp'}
                        </span>
                        <span className="text-xs text-gray-500">{report.created_at}</span>
                      </div>
                      <h3 className="text-white font-bold mb-2 group-hover:text-gold transition-colors">#{report.id} - {report.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">Báo cáo bởi: <span className="text-white">{report.reporter}</span></p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className={`text-xs font-bold uppercase ${report.status === 'resolved' ? 'text-green-500' : 'text-gray-400'}`}>
                          {report.status.replace('_', ' ').replace('open', 'Mở').replace('in progress', 'Đang xử lý').replace('resolved', 'Đã xong')}
                        </span>
                        <button className="text-xs bg-white/10 hover:bg-gold hover:text-black text-white px-3 py-1.5 rounded-lg transition-colors">
                          Xem Luồng
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
