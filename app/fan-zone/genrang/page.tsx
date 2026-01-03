 "use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { LoginCheck } from "@/components/shared/LoginCheck";

export default function GenrangPage() {
  return (
    <LoginCheck>
      <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-start"
        >
          <Image
            src="/images/Genrang.png"
            priority={false}
            alt="Genrang"
            width={1000}
            height={1000}
            className="max-w-full max-h-[80vh] object-contain"
            style={{ width: "auto", height: "auto" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </motion.div>
      </div>
    </div>
    </LoginCheck>
  );
}
