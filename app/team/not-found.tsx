"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto px-4"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <img 
            src="/images/Genrang.png"
            alt="Genrang"
            className="w-48 h-48 mx-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </motion.div>

        <h1 className="font-heading text-6xl sm:text-8xl text-gold mb-6">
          404
        </h1>
        <p className="text-gray-300 text-xl mb-4">
          {language === "en"
            ? "Sorry, this content is not available or has been removed."
            : "Xin lỗi, nội dung không có hoặc đã bị xóa."}
        </p>
        <p className="text-gray-400 mb-8">
          {language === "en"
            ? "Please return to the previous page."
            : "Vui lòng trở về trang trước."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold inline-flex items-center gap-2"
            >
              <Home size={18} />
              {language === "en" ? "Go Home" : "Về Trang Chủ"}
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="btn-outline-gold inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            {language === "en" ? "Go Back" : "Quay Lại"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

