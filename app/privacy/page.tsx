"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Lock, Eye, Cookie, Share2, ShieldCheck, UserCog } from "lucide-react";

export default function PrivacyPolicyPage() {
    const { language } = useLanguage();

    const icons = {
        collection: Eye,
        usage: UserCog,
        cookies: Cookie,
        sharing: Share2,
        security: Lock,
        rights: ShieldCheck
    };

    const content = {
        vi: {
            title: "Chính Sách Riêng Tư",
            updated: "Cập nhật lần cuối: 04/01/2026",
            subtitle: "Cam kết bảo vệ dữ liệu người dùng",
            sections: [
                {
                    id: "collection",
                    title: "1. Thu Thập Thông Tin",
                    icon: icons.collection,
                    content: (
                        <>
                            <p className="mb-2">Chúng tôi thu thập các thông tin cần thiết để vận hành:</p>
                            <ul className="space-y-2">
                                <li className="flex gap-2">
                                    <span className="text-gold">•</span>
                                    <span><strong>Thông tin cá nhân:</strong> Tên hiển thị, email, ảnh đại diện (khi đăng nhập Social hoặc đăng ký).</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-gold">•</span>
                                    <span><strong>Thông tin kỹ thuật:</strong> IP, loại thiết bị, lịch sử truy cập (dùng cho analytics và bảo mật).</span>
                                </li>
                            </ul>
                        </>
                    )
                },
                {
                    id: "usage",
                    title: "2. Sử Dụng Thông Tin",
                    icon: icons.usage,
                    content: (
                        <>
                            <p className="mb-2">Dữ liệu được sử dụng để:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="bg-[#1a1a1a] text-white p-3 rounded border border-[#333] font-mono">Duy trì tính năng (Bình luận, Minigame)</div>
                                <div className="bg-[#1a1a1a] text-white p-3 rounded border border-[#333] font-mono">Cải thiện trải nghiệm người dùng</div>
                                <div className="bg-[#1a1a1a] text-white p-3 rounded border border-[#333] font-mono">Ngăn chặn spam & phá hoại</div>
                                <div className="bg-[#1a1a1a] text-white p-3 rounded border border-[#333] font-mono">Liên hệ hỗ trợ khi cần thiết</div>
                            </div>
                        </>
                    )
                },
                {
                    id: "cookies",
                    title: "3. Cookies & Local Storage",
                    icon: icons.cookies,
                    content: (
                        <p>
                            Hệ thống sử dụng Cookies để lưu trạng thái đăng nhập và các tùy chọn cá nhân (ngôn ngữ, giao diện).
                            Bạn có thể tắt Cookies trong trình duyệt, nhưng một số tính năng có thể không hoạt động ổn định.
                        </p>
                    )
                },
                {
                    id: "sharing",
                    title: "4. Chia Sẻ Thông Tin",
                    icon: icons.sharing,
                    content: (
                        <>
                            <p className="text-black font-black mb-2 uppercase border-b-2 border-black inline-block">
                                Chúng tôi CAM KẾT KHÔNG bán thông tin người dùng.
                            </p>
                            <p>
                                Thông tin chỉ được chia sẻ với các đối tác hạ tầng tối thiểu (như Cloudflare, Google Analytics) để phục vụ vận hành,
                                tuân thủ nghiêm ngặt các tiêu chuẩn bảo mật.
                            </p>
                        </>
                    )
                },
                {
                    id: "security",
                    title: "5. Bảo Mật Dữ Liệu",
                    icon: icons.security,
                    content: (
                        <p>
                            Chúng tôi áp dụng mã hóa SSL/TLS và các biện pháp Hash mật khẩu tiêu chuẩn.
                            Tuy nhiên, người dùng cần tự bảo vệ thiết bị và không chia sẻ mật khẩu để đảm bảo an toàn tuyệt đối.
                        </p>
                    )
                },
                {
                    id: "rights",
                    title: "6. Quyền Của Bạn",
                    icon: icons.rights,
                    content: (
                        <p>
                            Bạn có toàn quyền yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân của mình.
                            Vui lòng liên hệ Admin qua kênh Discord hoặc Email hỗ trợ để thực hiện quyền này.
                        </p>
                    )
                }
            ]
        },
        en: {
            title: "Privacy Policy",
            updated: "Last updated: January 4, 2026",
            subtitle: "Commitment to user data protection",
            sections: [
                {
                    id: "collection",
                    title: "1. Information Collection",
                    icon: icons.collection,
                    content: (
                        <>
                            <p className="mb-2">We collect necessary information for operation:</p>
                            <ul className="space-y-2">
                                <li className="flex gap-2">
                                    <span className="text-gold">•</span>
                                    <span><strong>Personal Info:</strong> Display name, email, avatar (via Social login or registration).</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-gold">•</span>
                                    <span><strong>Technical Info:</strong> IP, device type, access logs (for analytics & security).</span>
                                </li>
                            </ul>
                        </>
                    )
                },
                {
                    id: "usage",
                    title: "2. Information Usage",
                    icon: icons.usage,
                    content: (
                        <>
                            <p className="mb-2">Data is used to:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="bg-[#1a1a1a] text-white p-3 rounded border border-[#333] font-mono">Maintain features (Comments, Games)</div>
                                <div className="bg-[#1a1a1a] text-white p-3 rounded border border-[#333] font-mono">Improve user experience</div>
                                <div className="bg-[#1a1a1a] text-white p-3 rounded border border-[#333] font-mono">Prevent spam & abuse</div>
                                <div className="bg-[#1a1a1a] text-white p-3 rounded border border-[#333] font-mono">Contact for support</div>
                            </div>
                        </>
                    )
                },
                {
                    id: "cookies",
                    title: "3. Cookies & Local Storage",
                    icon: icons.cookies,
                    content: (
                        <p>
                            We use Cookies to save login status and personal preferences (language, theme).
                            You can disable Cookies in your browser, but some features may not function properly.
                        </p>
                    )
                },
                {
                    id: "sharing",
                    title: "4. Information Sharing",
                    icon: icons.sharing,
                    content: (
                        <>
                            <p className="text-black font-black mb-2 uppercase border-b-2 border-black inline-block">
                                We COMMIT NOT to sell user data.
                            </p>
                            <p>
                                Information is only shared with essential infrastructure partners (like Cloudflare, Google Analytics) for operation,
                                strictly adhering to security standards.
                            </p>
                        </>
                    )
                },
                {
                    id: "security",
                    title: "5. Data Security",
                    icon: icons.security,
                    content: (
                        <p>
                            We apply SSL/TLS encryption and standard password Hashing.
                            However, users must protect their own devices and not share passwords to ensure absolute safety.
                        </p>
                    )
                },
                {
                    id: "rights",
                    title: "6. Your Rights",
                    icon: icons.rights,
                    content: (
                        <p>
                            You have the full right to view, edit, or delete your personal data.
                            Please contact Admin via Discord or Support Email to exercise this right.
                        </p>
                    )
                }
            ]
        }
    };

    const t = content[language];

    return (
        <div className="min-h-screen bg-[#F5F5F0] text-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-mono">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-16 border-b-[6px] border-black pb-8">
                    <div className="inline-block neo-badge mb-4 transform rotate-1 bg-black text-gold border-none">
                        PRIVACY MATTERS // RIÊNG TƯ
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 drop-shadow-[6px_6px_0px_#AA8A00] text-black">
                        {t.title}
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-[6px] border-black pl-6 bg-white p-6 shadow-[8px_8px_0px_0px_#000000]">
                        <p className="text-xl font-bold max-w-2xl uppercase tracking-tight">
                            {t.subtitle}
                        </p>
                        <p className="text-sm font-bold bg-gold text-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
                            {t.updated}
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {t.sections.map((section, index) => {
                        const Icon = section.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <div
                                key={index}
                                className={`p-8 relative border-4 border-black transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[12px_-12px_0px_0px_#000000] ${isEven ? 'bg-white shadow-[8px_8px_0px_0px_#AA8A00]' : 'bg-[#FFD700] shadow-[8px_8px_0px_0px_#000000]'
                                    }`}
                            >
                                <div className="absolute -top-6 -right-4 bg-black text-white px-4 py-2 font-black text-xl border-4 border-white transform rotate-3">
                                    #{index + 1}
                                </div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000000]">
                                        <Icon size={28} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mt-1">
                                        {section.title.split('. ')[1] || section.title}
                                    </h2>
                                </div>
                                <div className="text-base md:text-lg font-bold leading-normal border-t-4 border-black pt-6">
                                    {section.content}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-20 text-center">
                    <div className="inline-block border-4 border-black bg-white px-6 py-4 font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_#AA8A00] transform -rotate-1 hover:rotate-0 transition-transform">
                        Gen.G Fandom &copy; 2026
                    </div>
                </div>
            </div>
        </div>
    );
}
