 "use client";

import { motion } from "framer-motion";
import { Users, Heart, ShoppingBag, ExternalLink, Facebook } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LoginCheck } from "@/components/shared/LoginCheck";
import {
  playerSupportData,
  teamSupportData,
  otherCommunitiesData,
  officialMerchData,
  CommunityLink,
  LocalizedString,
} from "@/lib/data/community";

export default function CommunityPage() {
  const { language } = useLanguage();

  const getLocalizedValue = (value: LocalizedString | string) => {
    if (typeof value === "string") return value;
    return language === "en" ? value.en : value.vi;
  };

  const renderCommunityCard = (item: CommunityLink, index: number, iconColor: string, IconComponent: any) => (
    <motion.a
      key={index}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="card-dark group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center transition-colors`}>
            <IconComponent className={`w-6 h-6 ${iconColor.replace("bg-", "text-").replace("/20", "-400")}`} />
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gold transition-colors" />
        </div>
        <h3 className="font-heading text-xl text-white mb-2 group-hover:text-gold transition-colors">
          {getLocalizedValue(item.name)}
        </h3>
        <p className="text-gray-400 text-sm">{getLocalizedValue(item.description)}</p>
      </div>
    </motion.a>
  );

  return (
    <LoginCheck>
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
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
              <Users className="w-12 h-12 text-gold" />
            </div>
          </motion.div>

          <h1 className="font-heading text-5xl sm:text-6xl mb-4">
            <span className="text-gradient-gold">
              {language === "en" ? "COMMUNITY" : "CỘNG ĐỒNG"}
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            {language === "en"
              ? "Join the Gen.G community. Connect with fellow fans, support players, and get official merchandise."
              : "Tham gia cộng đồng Gen.G. Kết nối với các fan, hỗ trợ tuyển thủ và mua merch chính hãng."}
          </p>
        </motion.section>

        {/* Support Players Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4">
              <Heart className="w-5 h-5 text-gold" />
              <span className="text-gold font-semibold">
                {language === "en" ? "SUPPORT PLAYERS" : "HỖ TRỢ TUYỂN THỦ"}
              </span>
            </div>
            <h2 className="font-heading text-3xl text-white mb-2">
              {language === "en"
                ? "Player Fan Pages"
                : "Trang Fan Của Tuyển Thủ"}
            </h2>
            <p className="text-gray-400">
              {language === "en"
                ? "Follow and support your favorite players on Facebook"
                : "Theo dõi và hỗ trợ các tuyển thủ yêu thích trên Facebook"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {playerSupportData.length > 0 ? (
              playerSupportData.map((item, i) =>
                renderCommunityCard(item, i, "bg-blue-500/20", Facebook)
              )
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>{language === "en" ? "Links coming soon..." : "Liên kết sắp có..."}</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Support Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4">
              <Users className="w-5 h-5 text-gold" />
              <span className="text-gold font-semibold">
                {language === "en" ? "SUPPORT TEAM" : "HỖ TRỢ ĐỘI TUYỂN"}
              </span>
            </div>
            <h2 className="font-heading text-3xl text-white mb-2">
              {language === "en"
                ? "Team Fan Communities"
                : "Cộng Đồng Fan Đội Tuyển"}
            </h2>
            <p className="text-gray-400">
              {language === "en"
                ? "Join Gen.G fan communities on Facebook"
                : "Tham gia các cộng đồng fan Gen.G trên Facebook"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {teamSupportData.length > 0 ? (
              teamSupportData.map((item, i) =>
                renderCommunityCard(item, i, "bg-green-500/20", Facebook)
              )
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>{language === "en" ? "Links coming soon..." : "Liên kết sắp có..."}</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Other Communities Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4">
              <Users className="w-5 h-5 text-gold" />
              <span className="text-gold font-semibold">
                {language === "en" ? "OTHER COMMUNITIES" : "CỘNG ĐỒNG KHÁC"}
              </span>
            </div>
            <h2 className="font-heading text-3xl text-white mb-2">
              {language === "en"
                ? "Other Fan Communities"
                : "Các cộng đồng fan khác"}
            </h2>
            <p className="text-gray-400">
              {language === "en"
                ? "More Gen.G fan spaces managed by the community"
                : "Các không gian fan Gen.G do cộng đồng quản lý"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {otherCommunitiesData.length > 0 ? (
              otherCommunitiesData.map((item, i) =>
                renderCommunityCard(item, i, "bg-blue-500/20", Facebook)
              )
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>{language === "en" ? "Links coming soon..." : "Liên kết sắp có..."}</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Official Merchandise Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <span className="text-gold font-semibold">
                {language === "en" ? "OFFICIAL MERCHANDISE" : "MERCH CHÍNH HÃNG"}
              </span>
            </div>
            <h2 className="font-heading text-3xl text-white mb-2">
              {language === "en"
                ? "Official Gen.G Stores"
                : "Cửa Hàng Chính Hãng Gen.G"}
            </h2>
            <p className="text-gray-400">
              {language === "en"
                ? "Purchase official Gen.G merchandise and support the team"
                : "Mua merch chính hãng Gen.G và hỗ trợ đội tuyển"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {officialMerchData.length > 0 ? (
              officialMerchData.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="card-dark group cursor-pointer relative overflow-hidden border-2 border-gold/20 group-hover:border-gold/50 transition-colors"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                        <ShoppingBag className="w-6 h-6 text-gold" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gold transition-colors" />
                    </div>
                    <h3 className="font-heading text-xl text-white mb-2 group-hover:text-gold transition-colors">
                      {getLocalizedValue(item.name)}
                    </h3>
                    <p className="text-gray-400 text-sm">{getLocalizedValue(item.description)}</p>
                  </div>
                </motion.a>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>{language === "en" ? "Links coming soon..." : "Liên kết sắp có..."}</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
    </LoginCheck>
  );
}

