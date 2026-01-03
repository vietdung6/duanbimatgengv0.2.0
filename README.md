# ⚔️ Gen.G Fandom - Trang Web Fan Hâm Mộ LMHT

![Gen.G](https://img.shields.io/badge/Gen.G-Gold%20%26%20Black-D4AF37?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![Socket.io](https://img.shields.io/badge/Socket.io-4.0-010101?style=for-the-badge&logo=socket.io)

> 🏆 Điểm đến cuối cùng dành cho người hâm mộ đội tuyển Liên Minh Huyền Thoại Gen.G Esports

---

## 📖 Giới Thiệu

Dự án này là trang web dành riêng cho cộng đồng fan Gen.G Esports, được xây dựng bằng công nghệ Next.js 15 mới nhất. Đây là trung tâm để người hâm mộ cập nhật lịch thi đấu, xem hồ sơ tuyển thủ, theo dõi thành tích lịch sử và tương tác với các tính năng độc đáo như "Giáo hội Chovy" hay tham gia các buổi Viewing Party trực tiếp.

---

## ✨ Tính Năng

### 🏠 Cốt Lõi (Core)
- **Trang chủ**: Banner giới thiệu, tuyển thủ nổi bật, đếm ngược trận đấu sắp tới.
- **Đội tuyển**: Danh sách đầy đủ đội hình (Đội hình chính, Đội trẻ CL & Cựu tuyển thủ) với chỉ số chi tiết và tướng sở trường.
- **Lịch thi đấu**: Lịch thi đấu sắp tới, lịch sử kết quả và trạng thái trận đấu trực tiếp.
- **Thành tích**: Dòng thời gian tương tác lịch sử đội tuyển từ kỷ nguyên Samsung Galaxy đến nay.

### 🎮 Khu Vực Fan & Tương Tác
- **Viewing Party (Xem Chung)**: Tổ chức xem chung trực tiếp (Livestream) với tính năng chat thời gian thực, dự đoán cấm/chọn (Ban/Pick).
- **Giáo Hội Chovy**: Điện thờ tương tác ảo với cơ chế "ban phước" vui nhộn.
- **Góc Genrang**: Khu vực đặc biệt dành cho linh vật của đội.
- **Cộng đồng**: Khu vực giao lưu và tương tác giữa các fan.

### 🛡️ Hệ Thống & Quản Trị (Admin)
- **Dashboard Quản Lý**: Giao diện quản trị toàn diện dành cho Staff.
  - **Quản lý Lịch đấu**: Thêm, sửa, cập nhật kết quả trận đấu.
  - **Quản lý Người dùng**: Quản lý danh sách thành viên và mã mời (Invite Code).
  - **Kiểm soát Viewing Party**: Tạo sự kiện, gửi thông báo và kiểm duyệt chat.
- **Xác thực & Bảo mật**: Hệ thống đăng nhập/đăng ký an toàn sử dụng JWT & Bcrypt.
- **PWA (Progressive Web App)**: Hỗ trợ cài đặt trang web như một ứng dụng trên điện thoại/máy tính, hoạt động mượt mà.
- **Real-time**: Tích hợp Socket.io cho các tính năng chat và cập nhật trực tiếp.

---

## 📂 Cấu Trúc Dự Án

```bash
gen-g-fandom/
├── app/                        # Next.js App Router (Các trang & API)
│   ├── api/                    # Backend API routes (Auth, Staff, Church...)
│   ├── fan-zone/               # Tính năng Fan (Church, Viewing Party)
│   ├── staff/                  # Trang quản trị (Yêu cầu quyền Admin)
│   ├── team/                   # Trang thông tin đội tuyển
│   └── ...                     # Các trang khác (Trang chủ, Login...)
│
├── components/                 # React Components (Thành phần giao diện)
│   ├── viewing-party/          # Chat, Video Player, Công cụ Admin
│   ├── staff/                  # Các widget quản trị
│   ├── layout/                 # Header, Footer
│   └── ...
│
├── data/                       # Dữ liệu tĩnh (JSON)
│   ├── players.json            # Dữ liệu tuyển thủ
│   └── ...
│
├── lib/                        # Logic xử lý & Tiện ích
│   ├── auth/                   # Dịch vụ xác thực (Authentication)
│   ├── prisma/                 # Cấu hình Database
│   ├── realtime.ts             # Cấu hình Socket.io
│   └── ...
│
├── public/                     # Tài nguyên tĩnh (Ảnh, Icon...)
├── scripts/                    # Script chạy database & setup
└── prisma/                     # Sơ đồ cơ sở dữ liệu (Schema)
```

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Next.js** | 15.5.9 | Full-stack Framework (App Router) |
| **React** | 19.0.0 | UI Library |
| **TypeScript** | 5.7.2 | Type Safety & Developer Experience |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS Framework |
| **Framer Motion** | 11.15.0 | Animation Library |
| **Lucide React** | 0.468.0 | Icon Library |
| **TanStack Query** | 5.90.12 | Server State Management |

### Backend & Database
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Node.js** | 18+ | JavaScript Runtime |
| **Custom Server** | - | Express-like server với Next.js |
| **Socket.io** | 4.8.1 | Real-time Communication |
| **MySQL / MariaDB** | - | Relational Database |
| **Prisma** | 5.22.0 | Type-safe ORM |
| **bcryptjs** | 3.0.3 | Password Hashing |
| **JWT** | 9.0.3 | Authentication & Authorization |
| **Zod** | 4.2.1 | Schema Validation |

### Additional
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Next-PWA** | 10.2.9 | Progressive Web App |
| **dotenv** | 17.2.3 | Environment Variables |

---

## 🚀 Hướng Dẫn Cài Đặt

### ⚙️ Yêu Cầu
- **Node.js** 18 trở lên
- **XAMPP** hoặc **MySQL Server** (MariaDB/MySQL 8.0+)
- **npm** hoặc **yarn**

### 📥 Các Bước Cài Đặt

#### 1. Clone source code
```bash
git clone <repository-url>
cd gen-g-fandom
```

#### 2. Cài đặt dependencies
```bash
npm install
```

#### 3. Cấu hình Database (MySQL/MariaDB)

**Bước 3.1:** Khởi động MySQL trong XAMPP
- Mở XAMPP Control Panel
- Start **Apache** và **MySQL**

**Bước 3.2:** Tạo Database
- Mở phpMyAdmin: `http://localhost/phpmyadmin`
- Tạo database mới tên `geng_fandom`
- Collation: `utf8mb4_general_ci`

**Bước 3.3:** Import Schema
- Vào tab SQL trong database `geng_fandom`
- Chạy file `database_schema_dump.sql` hoặc sử dụng Prisma:
```bash
npx prisma generate
npx prisma db push
```

**Bước 3.4:** Tạo tài khoản mặc định (Optional)
Import file `INSERT_DEFAULT_USERS.sql` để tạo 3 tài khoản:
- **Admin**: `admin@geng.gg` / `admin`
- **Staff**: `staff@geng.gg` / `staff123`
- **Fan**: `fan@geng.gg` / `fan123`

#### 4. Cấu hình Environment Variables

Tạo file `.env.local` ở thư mục gốc:
```env
# Database
DATABASE_URL="mysql://root@localhost:3306/geng_fandom"

# Authentication
JWT_SECRET="your-super-secret-key-change-this-in-production"

# Socket.io
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"

# Optional: Disable PWA in development
NEXT_PUBLIC_PWA_DISABLE_DEV=true
```

#### 5. Chạy Development Server
```bash
npm run dev
```

Server sẽ khởi động tại: **http://localhost:3000**

#### 6. Build for Production (Optional)
```bash
npm run build
npm start
```

---

## 🔐 Tài Khoản Mặc Định

Sau khi import `INSERT_DEFAULT_USERS.sql`:

| Role | Email | Password | Quyền |
|------|-------|----------|-------|
| **Admin** | admin@geng.gg | admin | Toàn quyền quản trị |
| **Staff** | staff@geng.gg | staff123 | Quản lý nội dung |
| **Fan** | fan@geng.gg | fan123 | Người dùng thường |

> ⚠️ **Lưu ý**: Đổi password ngay khi đưa lên production!

---

## ⚠️ Tuyên Bố Miễn Trừ Trách Nhiệm

Đây là **trang web fan-made không chính thức** và không liên kết, được tài trợ hay được ủy quyền bởi Gen.G Esports dưới bất kỳ hình thức nào.

<p align="center">
  Được thực hiện với 💛 bởi Fan Gen.G, dành cho Fan Gen.G
</p>
