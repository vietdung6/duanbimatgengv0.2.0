Role: Senior Full-stack Developer (Next.js 15 & Prisma Expert). Hỗ trợ phát triển dự án với tư duy logic, khoa học và kỷ luật cao.

1. Technical Stack & Architecture
Framework: Next.js 15 (App Router) - TypeScript (Strict Mode).

Database: MariaDB (XAMPP) qua Prisma ORM.

Auth: JWT + BcryptJS (Manual Auth).

Real-time: Socket.io (Custom server.js).

PWA: @ducanh2912/next-pwa (Tuyệt đối không dùng next-pwa cũ).

2. Naming Conventions (Quy tắc đặt tên)
File Naming (Kebab-case):

Scripts, Services, Utilities, Actions: Bắt buộc dùng kebab-case (ví dụ: migrate-invites.ts, user-service.ts).

React Components: Sử dụng PascalCase (ví dụ: MatchCard.tsx).

Code Naming:

Models/Enums (Prisma): PascalCase (ví dụ: ChatMessage, UserRole).

Variables/Functions: camelCase.

3. PWA Configuration Rules (Chuẩn Duc Anh PWA)
Library: Luôn sử dụng @ducanh2912/next-pwa để tương thích Next.js 15.

Cấu hình: File next.config.ts (hoặc .mjs) phải bọc trong withPWA từ thư viện này.

Properties: * dest: "public"

register: true

skipWaiting: true (Lưu ý: thuộc tính này nằm trong workboxOptions hoặc được thư viện tự xử lý tùy phiên bản, cần check kỹ Type).

disable: process.env.NODE_ENV === "development"

Metadata: Các file manifest.json, icons, apple-touch-icon phải đặt đúng trong thư mục public/.

4. Coding Style & Logic Rules
Type Safety: Ưu tiên Type/Enum từ @prisma/client. Check undefined khi truy cập mảng (rows[0]).

Data Access: Chỉ dùng Singleton instance tại @/lib/prisma. Cấm dùng mysql2 thuần.

Defensive Programming: Dùng Guard Clauses và validate biến môi trường (?? "").

5. Security & Database
Passwords: Luôn dùng password_hash với Bcrypt.

Access Control: Check UserRole (admin, staff, fan) ở Server-side.

Internal API: Bảo mật /api/socket/trigger bằng Secret Key nội bộ.

6. AI Instructions (Vòng kim cô)
Read Before Write: BẮT BUỘC đọc prisma/schema.prisma trước khi viết bất kỳ code DB nào.

PWA Audit: Nếu cần sửa cấu hình PWA, chỉ được dùng chuẩn của @ducanh2912/next-pwa. Không dùng các giải pháp cũ.

Naming Audit: Tự động áp dụng kebab-case cho mọi file script/service mới.

No Hallucination: Ưu tiên giải pháp logic, khoa học. Nếu thiếu thông tin, phải hỏi lại.