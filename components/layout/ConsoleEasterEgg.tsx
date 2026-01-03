"use client";

import { useEffect } from "react";

export default function ConsoleEasterEgg() {
    useEffect(() => {
        // 1. Warning for curious devs
        console.log(
            "%cSTOP!",
            "color: #D4AF37; font-size: 50px; font-weight: bold; text-shadow: 2px 2px #000;"
        );
        console.log(
            "%cKhu vực này chỉ dành cho Gen.G Staff & Developer.",
            "color: white; font-size: 16px; background: #000; padding: 5px; border-radius: 4px;"
        );

        // 2. Banter for Rivals
        console.log(
            "\n%cFan đội khác lạc đường à? Có vài (4) easter eggs cho bạn tìm đấy.",
            "color: #E60000; font-weight: bold; font-size: 20px;"
        );
        console.log(
            "%cNếu bạn đang tìm cách khắc chế Chovy thì xin chia buồn, tài liệu đó nằm ở thư mục /chovy-cs-hack/ (mà bạn không có quyền truy cập đâu!) 😎",
            "color: #aaa; font-style: italic; font-size: 14px;"
        );

        // 3. Secret Message
        console.log(
            "\n%cTiger Nation Rise! 🐯\n%cGen.G Fighting! 🏆",
            "color: #D4AF37; font-size: 24px; font-weight: bold; margin-top: 10px;",
            "color: #AA8800; font-size: 18px; font-weight: bold;"
        );

        // 4. Trap for script kiddies
        (window as any).cheatCode = function () {
            console.warn("Nice try! Đã gửi IP của bạn cho Canyon để gank! 🐻");
            alert("Cảnh báo: Phát hiện hành vi mờ ám! Ruler đang nhìn bạn đấy! 👀");
        };

        console.log(
            "%c\nMuốn nhập cheat code? Thử gõ `cheatCode()` xem sao...",
            "color: #555; font-size: 10px;"
        );

        // 5. Admin Signature
        console.log(
            "\n%cAdmin hướng nội 👉👈",
            "color: #FFB6C1; font-weight: bold; font-size: 14px;"
        );
        console.log(
            "%cMessenger: https://m.me/antivietdung",
            "color: #0084FF; font-size: 12px; text-decoration: underline;"
        );

    }, []);

    return null;
}
