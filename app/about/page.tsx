"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Sparkles, Code, Heart, Users, Coffee } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutPage() {
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
            <span className="text-gradient-gold">{t.about.title}</span>
          </h1>
          <p className="text-gray-400 text-xl">{t.about.subtitle}</p>
        </motion.section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* AI Product Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-dark mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Code className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-grow">
                <h2 className="font-heading text-2xl text-gold mb-2">{t.about.missionTitle}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {t.about.aiProduct}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Edited By Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-dark mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-grow">
                <h2 className="font-heading text-2xl text-gold mb-2">{t.about.communityTitle}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {t.about.editedBy}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contribute Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-dark mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-grow">
                <h2 className="font-heading text-2xl text-gold mb-2">{t.about.contributeTitle}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {t.about.contribute}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="card-dark bg-gradient-to-br from-gold/10 to-transparent border-2 border-gold/30 scroll-mt-24"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl text-gold mb-2">{t.about.contact}</h2>
              <div className="w-24 h-0.5 bg-gold mx-auto" />
            </div>

            <div className="space-y-6">
              {/* Contact Methods */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3 md:mt-5">
                {/* Fanpage */}
                <motion.a
                  href="https://www.facebook.com/profile.php?id=61584724361968"
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black-charcoal/50 border border-gold/20 rounded-xl p-6 
                           hover:border-gold/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center 
                                  group-hover:bg-gold/30 transition-colors">
                      <Users className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                        Fanpage
                      </p>
                      <p className="font-heading text-base text-white group-hover:text-gold transition-colors">
                        GenG LOL Fandom Vietnam
                      </p>
                    </div>
                  </div>
                </motion.a>

                {/* Zalo/Phone */}
                <motion.a
                  href="tel:0778876000"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black-charcoal/50 border border-gold/20 rounded-xl p-6 
                           hover:border-gold/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center 
                                  group-hover:bg-gold/30 transition-colors">
                      <Phone className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                        {t.about.zalo}
                      </p>
                      <p className="font-heading text-base text-white group-hover:text-gold transition-colors">
                        0778.876.000
                      </p>
                    </div>
                  </div>
                </motion.a>

                {/* Messenger */}
                <motion.a
                  href="https://www.m.me/61584724361968"
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black-charcoal/50 border border-gold/20 rounded-xl p-6 
                           hover:border-gold/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center 
                                  group-hover:bg-gold/30 transition-colors">
                      <Mail className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                        Messenger
                      </p>
                      <p className="font-heading text-base text-white group-hover:text-gold transition-colors break-all">
                        m.me/61584724361968
                      </p>
                    </div>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a
                  href="mailto:admin@gengfandom.fun"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black-charcoal/50 border border-gold/20 rounded-xl p-6 
                           hover:border-gold/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center 
                                  group-hover:bg-gold/30 transition-colors">
                      <Mail className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                        {t.about.email}
                      </p>
                      <p className="font-heading text-base text-white group-hover:text-gold transition-colors break-all">
                        admin@gengfandom.fun
                      </p>
                    </div>
                  </div>
                </motion.a>

                {/* GitHub (source code) */}
                <motion.a
                  href="https://github.com/vietdung6/gengfandomnew"
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black-charcoal/50 border border-gold/20 rounded-xl p-6 
                           hover:border-gold/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center 
                                  group-hover:bg-gold/30 transition-colors">
                      <Code className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                        GitHub
                      </p>
                      <p className="font-heading text-base text-white group-hover:text-gold transition-colors break-all">
                        gengfandomnew (v0.1)
                      </p>
                    </div>
                  </div>
                </motion.a>

                {/* Support / Donate */}
                <motion.a
                  href="/support"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black-charcoal/50 border border-gold/20 rounded-xl p-6 
                           hover:border-gold/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center 
                                  group-hover:bg-gold/30 transition-colors">
                      <Coffee className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                        {t.footer.support}
                      </p>
                      <p className="font-heading text-base text-white group-hover:text-gold transition-colors break-all">
                        {t.support.subtitle}
                      </p>
                    </div>
                  </div>
                </motion.a>
              </div>
            </div>
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

