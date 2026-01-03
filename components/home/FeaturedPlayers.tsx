"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getCurrentRoster } from "@/lib/data/players";

export default function FeaturedPlayers() {
  const { t } = useLanguage();

  const getRoleLabel = (roleKey: string) => {
    const roles = t.team.roles as Record<string, string>;
    return roles[roleKey] || roleKey;
  };

  return (
    <section className="section-divider relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"
            />
            <motion.h2
              className="font-heading text-4xl sm:text-5xl lg:text-6xl text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gradient-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                {t.home.roster.title}
              </span>
            </motion.h2>
            <motion.p
              className="text-gray-400 text-center max-w-lg mx-auto text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t.home.roster.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {getCurrentRoster().map((player, i) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className={`card-dark relative overflow-hidden group cursor-pointer
                            bg-gradient-to-t ${player.color} to-transparent
                            ${player.featured ? "ring-2 ring-gold/50" : ""}`}
              >
                {player.featured && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-gold text-black text-xs px-2 py-1 rounded font-bold">
                      👑 {t.common.franchise}
                    </span>
                  </div>
                )}

                <div
                  className="aspect-[3/4] bg-black-charcoal rounded-lg mb-4 
                                flex items-center justify-center relative overflow-hidden
                                shadow-2xl shadow-black/50 group-hover:shadow-gold/20"
                >
                  {player.image ? (
                    <Image
                      src={player.image}
                      alt={player.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 20vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`text-6xl group-hover:scale-110 transition-transform duration-300 ${
                      player.image ? "hidden" : ""
                    }`}
                  >
                    👤
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-all duration-300" />
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{player.flag}</span>
                  <h3
                    className="font-heading text-2xl text-white group-hover:text-gold 
                                 transition-colors flex items-center gap-2"
                  >
                    {player.name}
                    {player.animalIcon && (
                      <span className="text-xl">{player.animalIcon}</span>
                    )}
                  </h3>
                </div>
                <p className="text-gold text-sm flex items-center gap-2">
                  {/* Role icon removed here; will be reintroduced when role icons are centralized */}
                  {getRoleLabel(player.roleKey)}
                </p>

                <div
                  className="absolute inset-0 border-2 border-transparent 
                                group-hover:border-gold/50 rounded-xl transition-colors pointer-events-none"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/team"
              className="btn-outline-gold inline-flex items-center gap-2"
            >
              {t.home.roster.viewFull} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

