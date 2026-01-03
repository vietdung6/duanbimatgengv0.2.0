"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex flex-col items-center justify-center">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-black/50 to-black pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Tiger Logo with Glow */}
        <motion.div
          animate={{
            filter: [
              "drop-shadow(0 0 10px rgba(170, 128, 0, 0.3))",
              "drop-shadow(0 0 25px rgba(170, 128, 0, 0.6))",
              "drop-shadow(0 0 10px rgba(170, 128, 0, 0.3))",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gold/10 rounded-full blur-2xl animate-pulse" />
          <Image
            src="/images/Genrang.png"
            alt="Gen.G Loading"
            width={120}
            height={120}
            className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10"
            priority
          />
        </motion.div>

        {/* Text and Progress Bar */}
        <div className="flex flex-col items-center gap-4 w-64">
          <motion.h2
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="font-heading text-xl md:text-2xl text-gold tracking-[0.2em] uppercase"
          >
            Gen.G Fandom
          </motion.h2>

          {/* Progress Bar Container */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-transparent via-gold to-transparent w-1/2 rounded-full"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <p className="text-white/40 text-xs font-mono tracking-wider">LOADING RESOURCES...</p>
        </div>
      </div>
    </div>
  );
}
