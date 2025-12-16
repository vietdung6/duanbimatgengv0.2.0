"use client";

import { motion } from "framer-motion";
import { Download, Info, Smartphone, MonitorSmartphone } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PwaPage() {
  const { t } = useLanguage();
  const pageText = t.pwa.page;
  const stepsAndroid = pageText.androidSteps;
  const stepsIOS = pageText.iosSteps;
  const howItWorks = pageText.howItWorksList;

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4">
            <Download className="w-5 h-5 text-gold" />
            <span className="text-gold font-semibold">
              {pageText.badge}
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl text-white mb-4">
            {pageText.heading}
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            {pageText.intro}
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="card-dark border border-gold/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <MonitorSmartphone className="w-6 h-6 text-gold" />
              <h2 className="font-heading text-2xl text-white">
                {pageText.androidTitle}
              </h2>
            </div>
            <ol className="list-decimal list-inside text-gray-300 space-y-3 text-sm sm:text-base">
              {stepsAndroid.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-dark border border-gold/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-gold" />
              <h2 className="font-heading text-2xl text-white">
                {pageText.iosTitle}
              </h2>
            </div>
            <ol className="list-decimal list-inside text-gray-300 space-y-3 text-sm sm:text-base">
              {stepsIOS.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="card-dark border border-gold/30 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-5 h-5 text-gold" />
            <h3 className="font-heading text-xl text-white">
              {t.pwa.howItWorksTitle}
            </h3>
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm sm:text-base">
            {howItWorks.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="text-gray-400 text-sm mt-4">
            {pageText.tip}
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 btn-outline-gold text-sm sm:text-base"
            >
              {pageText.backToHome}
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

