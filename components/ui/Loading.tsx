"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 flex flex-col items-center justify-center gap-6 z-50">
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div className="absolute -inset-4 bg-gold/20 rounded-full blur-xl animate-pulse" />
        <Image
          src="/images/Genrang.png"
          alt="Loading..."
          width={160}
          height={160}
          className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10"
          priority={false}
        />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="font-heading text-2xl md:text-3xl text-gold tracking-widest uppercase animate-pulse">
          Loading...
        </h2>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gold rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
