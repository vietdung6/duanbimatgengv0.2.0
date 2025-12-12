"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, Flame } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const choviImage = "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/31/GEN_Chovy_2025_Split_1.png";

export default function ShrinePage() {
  const { t } = useLanguage();
  const [candlesLit, setCandlesLit] = useState(0);
  const [showBlessing, setShowBlessing] = useState(false);

  const lightCandle = () => {
    const newCount = candlesLit + 1;
    setCandlesLit(newCount);
    
    if (newCount === 10) {
      setShowBlessing(true);
      setTimeout(() => setShowBlessing(false), 5000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          {/* Shrine Gate Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              filter: ["drop-shadow(0 0 20px rgba(212,175,55,0.5))", 
                       "drop-shadow(0 0 40px rgba(212,175,55,0.8))",
                       "drop-shadow(0 0 20px rgba(212,175,55,0.5))"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            ⛩️
          </motion.div>

          {/* Chovy Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-48 h-48 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-gradient-radial-gold opacity-30 blur-xl rounded-full" />
            <img 
              src={choviImage}
              alt="Chovy"
              className="relative w-full h-full object-cover rounded-full border-4 border-gold shadow-gold-glow"
            />
          </motion.div>


          <h1 className="font-heading text-6xl sm:text-8xl mb-4">
            <span className="text-gradient-gold">{t.shrine.title}</span>
          </h1>
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 
                        rounded-full px-6 py-2 mb-4">
            <Crown className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">{t.shrine.highPriest}</span>
          </div>
          <p className="text-gray-400 text-xl mb-2">{t.shrine.realName}</p>
          <p className="text-gold font-heading text-2xl">{t.shrine.role}</p>
        </motion.section>

        {/* Candle Lighting Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-12"
        >
          <div className="card-dark max-w-2xl mx-auto text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial-gold opacity-10" />
            
            <div className="relative z-10">
              <Flame className="w-12 h-12 text-gold mx-auto mb-4" />
              <h2 className="font-heading text-2xl text-gold mb-2">{t.shrine.lightCandleTitle}</h2>
              <p className="text-gray-400 text-sm mb-6">
                {t.shrine.lightCandleDesc}
              </p>

              {/* Candles Display */}
              <div className="flex justify-center gap-3 mb-6 flex-wrap">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={i < candlesLit ? {
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 0.5, repeat: i < candlesLit ? Infinity : 0, repeatDelay: 1 }}
                    className={`text-3xl transition-all duration-300 ${
                      i < candlesLit ? 'filter drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'opacity-30'
                    }`}
                  >
                    {i < candlesLit ? '🕯️' : '🕯️'}
                  </motion.div>
                ))}
              </div>

              <p className="text-gold font-heading text-xl mb-4">
                {candlesLit} {t.shrine.candlesCount} {t.shrine.candlesLit}
              </p>

              <button
                onClick={lightCandle}
                disabled={candlesLit >= 10}
                className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Flame className="inline mr-2" size={18} />
                {candlesLit >= 10 ? t.shrine.allCandlesLit : t.shrine.lightCandle}
              </button>

              {/* Blessing Effect when 10 candles */}
              <AnimatePresence>
                {showBlessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-20 bg-black/90 backdrop-blur-sm rounded-xl"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="text-center px-8"
                    >
                      {/* Sparkles animation */}
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-gold rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                          }}
                        />
                      ))}
                      
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 360, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-8xl mb-6 relative z-10"
                      >
                        ✨
                      </motion.div>
                      <h2 className="font-heading text-4xl sm:text-5xl text-gold mb-4 relative z-10">
                        {t.shrine.blessingTitle}
                      </h2>
                      <p className="text-white text-lg sm:text-xl mb-2 relative z-10">
                        {t.shrine.blessingMessage}
                      </p>
                      <p className="text-gold text-base sm:text-lg relative z-10">
                        {t.shrine.blessingWish} 🏆
                      </p>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          filter: ["drop-shadow(0 0 20px rgba(212,175,55,0.5))", 
                                  "drop-shadow(0 0 40px rgba(212,175,55,0.8))",
                                  "drop-shadow(0 0 20px rgba(212,175,55,0.5))"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-8 text-6xl relative z-10"
                      >
                        👑
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}


