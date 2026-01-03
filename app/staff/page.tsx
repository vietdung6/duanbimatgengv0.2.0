"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  History,
  MonitorPlay,
  Database,
  ArrowRight
} from "lucide-react";

const features = [
  {
    href: "/staff/users",
    title: "Quản lý Users & Invite",
    description: "Xem danh sách user, phân quyền và gửi lời mời gia nhập.",
    icon: Users,
    color: "from-blue-500/20",
  },
  {
    href: "/staff/schedule",
    title: "Lịch thi đấu",
    description: "Quản lý và cập nhật lịch thi đấu sắp tới của Gen.G.",
    icon: Calendar,
    color: "from-green-500/20",
  },
  {
    href: "/staff/history",
    title: "Lịch sử & Kết quả",
    description: "Thêm và chỉnh sửa kết quả các trận đấu đã qua.",
    icon: History,
    color: "from-purple-500/20",
  },
  {
    href: "/staff/viewing-party",
    title: "Viewing Party",
    description: "Tạo và quản lý các buổi xem chung online.",
    icon: MonitorPlay,
    color: "from-red-500/20",
  },
  {
    href: "/staff/resources",
    title: "Tài nguyên",
    description: "Quản lý hình ảnh, logo và các tài nguyên media.",
    icon: Database,
    color: "from-gold/20",
  },
];

export default function StaffDashboardPage() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={feature.href}>
              <div
                className={`
                  group relative overflow-hidden rounded-xl border border-white/10 
                  bg-gradient-to-br ${feature.color} to-transparent p-6
                  hover:border-gold/50 hover:shadow-[0_0_30px_rgba(170,128,24,0.15)]
                  transition-all duration-300 cursor-pointer min-h-[180px]
                `}
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-heading text-xl text-white group-hover:text-gold transition-colors mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  <span className="text-gold text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Truy cập <ArrowRight size={14} />
                  </span>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
