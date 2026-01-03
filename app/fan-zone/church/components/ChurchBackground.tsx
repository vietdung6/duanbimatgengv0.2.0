"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ChurchBackgroundProps {
  mounted: boolean;
}

export default function ChurchBackground({ mounted }: ChurchBackgroundProps) {
  // Pre-generate particle positions for SSR consistency
  // Reduced from 40 to 15 for better performance
  const particles = useMemo(() =>
    [...Array(15)].map((_, i) => ({
      id: i,
      left: `${(i * 6.66) % 100}%`,
      top: `${(i * 6.66) % 100}%`,
      delay: (i * 0.3) % 5,
      duration: 4 + (i % 4),
      size: i % 3 === 0 ? 2 : 1,
    }))
    , []);

  // Light rays data
  const rays = useMemo(() => [
    { left: "20%", rotate: -15, opacity: 0.15, delay: 0 },
    { left: "35%", rotate: -8, opacity: 0.2, delay: 0.5 },
    { left: "50%", rotate: 0, opacity: 0.25, delay: 1 },
    { left: "65%", rotate: 8, opacity: 0.2, delay: 1.5 },
    { left: "80%", rotate: 15, opacity: 0.15, delay: 2 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Stained glass pattern overlay */}
      <div className="absolute inset-0">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0808] via-[#1a1412] to-black" />

        {/* Stained glass color patches */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-to-br from-amber-900/40 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-red-900/30 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 bg-gradient-to-b from-gold/20 via-yellow-500/10 to-transparent blur-lg" />
          <div className="absolute bottom-0 left-1/3 w-1/3 h-1/3 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />
        </div>

        {/* Cathedral window arch shape */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20">
          <div className="w-full h-full bg-gradient-to-b from-gold/30 via-amber-500/10 to-transparent"
            style={{ clipPath: "ellipse(50% 80% at 50% 0%)" }} />
        </div>
      </div>

      {/* Volumetric light rays */}
      {mounted && rays.map((ray, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-32 h-[120vh] origin-top"
          style={{
            left: ray.left,
            transform: `rotate(${ray.rotate}deg) translateZ(0)`,
            background: "linear-gradient(to bottom, rgba(212,175,55,0.3), rgba(212,175,55,0.05) 50%, transparent 100%)",
            opacity: ray.opacity,
            willChange: 'opacity',
          }}
          animate={{
            opacity: [ray.opacity * 0.5, ray.opacity, ray.opacity * 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: ray.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central divine glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px]">
        <motion.div
          className="w-full h-full rounded-full bg-gradient-radial from-gold/20 via-gold/5 to-transparent blur-xl"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-amber-950/20 via-gold/5 to-transparent" />

      {/* Floating golden particles */}
      {mounted && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            filter: "blur(0.5px)",
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, (p.id % 2 === 0 ? 10 : -10), 0],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
