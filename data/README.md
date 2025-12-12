# 📁 Data Management

Thư mục này chứa các file dữ liệu JSON để bạn dễ dàng cập nhật nội dung website mà không cần chỉnh sửa code.

## 📋 Các file dữ liệu

### `players.json` - Dữ liệu tuyển thủ
- Thông tin cá nhân (tên, nickname, số áo)
- Stats (KDA, CS/M, số trận)
- Ảnh đại diện
- Champions signature
- Social media links

### `schedule.json` - Lịch thi đấu
- `upcomingMatches`: Các trận sắp tới
- `recentResults`: Kết quả gần đây

### `achievements.json` - Thành tích
- `summary`: Tổng số danh hiệu
- `timeline`: Chi tiết từng năm

---

## 🔧 Cách chỉnh sửa

### Cách 1: Chỉnh sửa trực tiếp file JSON
1. Mở file `.json` cần chỉnh sửa
2. Cập nhật dữ liệu theo format có sẵn
3. Save file
4. Refresh website

### Cách 2: Tạo Admin Page (khuyến nghị)

Để quản lý dữ liệu chuyên nghiệp hơn, bạn có thể:

#### Option A: Local Admin (đơn giản)
- Tạo trang `/admin` với form để edit JSON files
- Lưu trực tiếp vào file system
- Chỉ hoạt động trên localhost

#### Option B: Database + CMS (nâng cao)
- **Supabase** (free tier, realtime)
- **Firebase** (free tier, Google ecosystem)
- **MongoDB Atlas** (free tier, flexible schema)
- **Prisma + PostgreSQL** (full control)

#### Option C: Headless CMS
- **Strapi** (self-hosted, free)
- **Sanity** (cloud, generous free tier)
- **Contentful** (cloud, limited free)

---

## 📝 TODO: Admin Page Features

```
[ ] Authentication (password protect)
[ ] Players CRUD
[ ] Schedule management
[ ] Achievements editor
[ ] Image upload
[ ] Preview before publish
[ ] Version history
```

---

## 🚀 Quick Setup cho Database (tương lai)

### Với Supabase:
```bash
npm install @supabase/supabase-js
```

### Với Firebase:
```bash
npm install firebase
```

### Với Prisma:
```bash
npm install prisma @prisma/client
npx prisma init
```

---

## 📞 Liên hệ

Nếu cần hỗ trợ tạo admin page hoặc setup database, hãy yêu cầu!

