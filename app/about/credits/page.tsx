"use client";

import { motion } from "framer-motion";
import { Code, Sparkles, Database, Image as ImageIcon, Heart, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CreditsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-gradient-radial-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-gold" />
            </div>
          </motion.div>

          <h1 className="font-heading text-5xl sm:text-6xl mb-4">
            <span className="text-gradient-gold">{t.credits.title}</span>
          </h1>
          <p className="text-gray-400 text-xl">{t.credits.subtitle}</p>
        </motion.section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-dark"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-gold" />
              </div>
              <h2 className="font-heading text-2xl text-gold">{t.credits.techStack}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {t.credits.technologies.map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black-charcoal/50 border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-colors"
                >
                  <h3 className="font-heading text-lg text-white mb-1">{tech.name}</h3>
                  <p className="text-gray-400 text-sm">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Tools */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-dark"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <h2 className="font-heading text-2xl text-gold">{t.credits.aiTools}</h2>
            </div>
            <div className="space-y-4">
              {t.credits.aiToolsList.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black-charcoal/50 border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-colors"
                >
                  <h3 className="font-heading text-lg text-white mb-1">{tool.name}</h3>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-dark"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-gold" />
              </div>
              <h2 className="font-heading text-2xl text-gold">{t.credits.dataSources}</h2>
            </div>
            <div className="space-y-4">
              {t.credits.dataSourcesList.map((source, i) => (
                <motion.a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="bg-black-charcoal/50 border border-gold/10 rounded-lg p-4 
                           hover:border-gold/30 transition-all flex items-center justify-between group"
                >
                  <div>
                    <h3 className="font-heading text-lg text-white mb-1 group-hover:text-gold transition-colors">
                      {source.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{source.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-gold transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Image Sources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="card-dark"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gold" />
              </div>
              <h2 className="font-heading text-2xl text-gold">{t.credits.imageSources}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {t.credits.imageSourcesList.map((source, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black-charcoal/50 border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-colors text-center"
                >
                  <h3 className="font-heading text-base text-white mb-1">{source.name}</h3>
                  <p className="text-gray-400 text-xs">{source.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Special Thanks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="card-dark bg-gradient-to-br from-gold/10 to-transparent border-2 border-gold/30"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-gold" />
              </div>
              <h2 className="font-heading text-2xl text-gold">{t.credits.specialThanks}</h2>
            </div>
            <ul className="space-y-3">
              {t.credits.thanks.map((thank, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-gold mt-1">•</span>
                  <span>{thank}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 text-gray-500 text-sm"
          >
            <p>{t.footer.copyright}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

