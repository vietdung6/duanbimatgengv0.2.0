"use client";

import { motion } from "framer-motion";

export function HeroSection() {
    return (
    <section className="relative py-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-heading text-4xl md:text-5xl mb-3 tracking-tighter">
            LỊCH SỬ <span className="text-gradient-gold">ĐẤU</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-widest text-[10px] md:text-xs">
            Lưu trữ mọi khoảnh khắc của Gen.G trên đấu trường Summoner's rift
          </p>
        </motion.div>
      </div>
    </section>
  );
}
