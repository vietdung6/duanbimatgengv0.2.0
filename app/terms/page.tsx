"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ScrollText, Shield, UserCheck, AlertTriangle, FileText, Globe, Gavel } from "lucide-react";

export default function TermsOfServicePage() {
    const { language } = useLanguage();

    const icons = {
        intro: Globe,
        ip: ScrollText,
        conduct: UserCheck,
        account: Shield,
        disclaimer: AlertTriangle,
        changes: FileText,
        contact: Gavel
    };

    const content = {
        vi: {
            title: "Điều Khoản Sử Dụng",
            updated: "Cập nhật lần cuối: 04/01/2026",
            subtitle: "Quy định và quyền lợi khi tham gia cộng đồng",
            sections: [
                {
                    id: "intro",
                    title: "1. Giới thiệu",
                    icon: icons.intro,
                    content: (
                        <>
                            <p className="mb-4">
                                Chào mừng bạn đến với <strong className="text-gold">Gen.G Fandom</strong>.
                                Đây là cộng đồng fan được xây dựng <strong>chủ yếu dành cho người hâm mộ Gen.G tại Việt Nam</strong>,
                                nơi kết nối những trái tim cùng nhịp đập với đội tuyển Vàng Đen.
                            </p>
                            <div className="bg-gold/20 border-l-4 border-black p-4">
                                <p className="text-sm text-black italic font-bold">
                                    * Lưu ý: Đây là trang web của người hâm mộ (Fan Site), hoạt động phi lợi nhuận và không phải trang web chính thức của tổ chức Gen.G Esports.
                                </p>
                            </div>
                        </>
                    )
                },
                {
                    id: "ip",
                    title: "2. Quyền Sở Hữu Trí Tuệ",
                    icon: icons.ip,
                    content: (
                        <>
                            <p className="mb-4">
                                Tất cả tài sản trí tuệ bao gồm logo, thương hiệu, hình ảnh cầu thủ của <strong>Gen.G Esports</strong> đều thuộc quyền sở hữu của tổ chức và các đối tác.
                                Chúng tôi chỉ sử dụng các tài liệu này nhằm mục đích tôn vinh và lan tỏa tình yêu đội tuyển.
                            </p>
                            <p>
                                Nội dung do fans đóng góp (fanart, bài viết) thuộc về người tạo ra. Khi đăng tải, bạn cấp cho chúng tôi quyền hiển thị phi độc quyền trên nền tảng này.
                            </p>
                        </>
                    )
                },
                {
                    id: "conduct",
                    title: "3. Quy Tắc Ứng Xử",
                    icon: icons.conduct,
                    content: (
                        <>
                            <p className="mb-2">Để duy trì một cộng đồng văn minh, vui lòng KHÔNG:</p>
                            <ul className="space-y-2 ml-1">
                                {[
                                    "Sử dụng ngôn từ thù địch, xúc phạm thành viên hoặc tuyển thủ.",
                                    "Spam, quảng cáo trái phép hoặc phát tán mã độc.",
                                    "Giả mạo nhân viên Gen.G hoặc ban quản trị.",
                                    "Gây chia rẽ nội bộ hoặc kích động mâu thuẫn giữa các cộng đồng fan.",
                                    "Vi phạm pháp luật Việt Nam và các quy định quốc tế."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-black font-bold">
                                        <span className="text-black mt-1">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )
                },
                {
                    id: "account",
                    title: "4. Tài Khoản & Bảo Mật",
                    icon: icons.account,
                    content: (
                        <p>
                            Bảo mật tài khoản là trách nhiệm của mỗi thành viên. Hãy giữ kín mật khẩu và thông báo ngay cho Admin nếu phát hiện dấu hiệu xâm nhập bất thường.
                            Chúng tôi cam kết nỗ lực hết sức để bảo vệ dữ liệu của bạn.
                        </p>
                    )
                },
                {
                    id: "disclaimer",
                    title: "5. Từ Chối Trách Nhiệm",
                    icon: icons.disclaimer,
                    content: (
                        <p>
                            Website hoạt động trên tinh thần tự nguyện và phi lợi nhuận. Dịch vụ được cung cấp "như hiện có", chúng tôi có thể bảo trì hoặc thay đổi tính năng
                            mà không cần báo trước để phù hợp với định hướng phát triển.
                        </p>
                    )
                },
                {
                    id: "changes",
                    title: "6. Thay Đổi Điều Khoản",
                    icon: icons.changes,
                    content: (
                        <p>
                            Điều khoản này có thể được cập nhật để phù hợp với tình hình thực tế. Việc bạn tiếp tục sử dụng website đồng nghĩa với việc chấp thuận các thay đổi mới nhất.
                        </p>
                    )
                },
                {
                    id: "contact",
                    title: "7. Liên Hệ",
                    icon: icons.contact,
                    content: (
                        <p>
                            Mọi thắc mắc vui lòng liên hệ qua các kênh Social Media chính thức của Gen.G Fandom được liệt kê tại Footer.
                        </p>
                    )
                }
            ]
        },
        en: {
            title: "Terms of Service",
            updated: "Last updated: January 4, 2026",
            subtitle: "Rules and rights within the community",
            sections: [
                {
                    id: "intro",
                    title: "1. Introduction",
                    icon: icons.intro,
                    content: (
                        <>
                            <p className="mb-4">
                                Welcome to <strong className="text-gold">Gen.G Fandom</strong>.
                                This community is built <strong>primarily for Gen.G fans in Vietnam</strong>,
                                connecting hearts that beat for the Black & Gold team.
                            </p>
                            <div className="bg-gold/20 border-l-4 border-black p-4">
                                <p className="text-sm text-black italic font-bold">
                                    * Note: This is an unofficial Fan Site, operating non-profit and independently from the Gen.G Esports organization.
                                </p>
                            </div>
                        </>
                    )
                },
                {
                    id: "ip",
                    title: "2. Intellectual Property",
                    icon: icons.ip,
                    content: (
                        <>
                            <p className="mb-4">
                                All intellectual property including logos, trademarks, and player images belong to <strong>Gen.G Esports</strong> and its partners.
                                We use these materials solely to honor and spread love for the team.
                            </p>
                            <p>
                                Fan-contributed content (fanart, articles) remains with the creators. By posting, you grant us a non-exclusive right to display it here.
                            </p>
                        </>
                    )
                },
                {
                    id: "conduct",
                    title: "3. Code of Conduct",
                    icon: icons.conduct,
                    content: (
                        <>
                            <p className="mb-2">To maintain a civilized community, please DO NOT:</p>
                            <ul className="space-y-2 ml-1">
                                {[
                                    "Use hate speech, insult members or players.",
                                    "Spam, unauthorized advertising, or distributing malware.",
                                    "Impersonate Gen.G staff or administrators.",
                                    "Instigate conflict between fan communities.",
                                    "Violate Vietnamese laws or international regulations."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-black font-bold">
                                        <span className="text-black mt-1">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )
                },
                {
                    id: "account",
                    title: "4. Account & Security",
                    icon: icons.account,
                    content: (
                        <p>
                            Account security is your responsibility. Keep your password safe and notify Admins immediately of any suspicious activity.
                            We represent our best efforts to protect your data.
                        </p>
                    )
                },
                {
                    id: "disclaimer",
                    title: "5. Disclaimer",
                    icon: icons.disclaimer,
                    content: (
                        <p>
                            Dimensions of the service are provided "as is". We may maintain or modify features without prior notice to align with development goals.
                        </p>
                    )
                },
                {
                    id: "changes",
                    title: "6. Changes to Terms",
                    icon: icons.changes,
                    content: (
                        <p>
                            These terms may be updated from time to time. Continued use of the website signifies your acceptance of the latest changes.
                        </p>
                    )
                },
                {
                    id: "contact",
                    title: "7. Contact",
                    icon: icons.contact,
                    content: (
                        <p>
                            For inquiries, please contact us via the official Gen.G Fandom Social Media channels listed in the Footer.
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
                    <div className="inline-block neo-badge mb-4 transform -rotate-1 bg-black text-gold border-none">
                        TERMS OF USE // ĐIỀU KHOẢN
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
                                <div className="absolute -top-6 -left-4 bg-black text-white px-4 py-2 font-black text-xl border-4 border-white transform -rotate-2">
                                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
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
                    <div className="inline-block border-4 border-black bg-white px-6 py-4 font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_#AA8A00] transform rotate-1 hover:rotate-0 transition-transform">
                        Gen.G Fandom &copy; 2026
                    </div>
                </div>
            </div>
        </div>
    );
}
