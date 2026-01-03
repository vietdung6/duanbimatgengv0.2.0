
# QUY TẮC LOGIC QUẢN LÝ TÀI NGUYÊN & DỮ LIỆU (GEN.G FANDOM)

Tài liệu này ghi lại các quy tắc logic đã thống nhất để xây dựng và nâng cấp hệ thống quản lý tài nguyên (Resource Hub) và nhập liệu trận đấu.

## 1. Quản lý Danh tính Đội nhà (Home Team Identity)
## 1. Quản lý Danh tính Đội nhà (Home Team Identity)

- **Cơ chế xác định:** Hệ thống sử dụng một `Date-Identity Map` cố định do User cung cấp.

- **Logic tự động:**

- Khi User chọn `Match Date`, hệ thống lập tức tra cứu Map và hiển thị một **Identity Badge** (Ví dụ: [SSG 2017]).

- Tên đội và Logo tương ứng sẽ được tự động điền vào các trường ẩn để lưu vào Database.

- **Phạm vi áp dụng:**

- `Samsung White/Ozone` (07/09/2013 - 28/11/2014) Bổ sung : (11/06/2014 đổi tên thành Samsung White từ tên Samsung Ozone)

- `Samsung Blue` (07/09/2013 - 28/11/2014) - *Cần chọn thủ công giữa White/Blue nếu cùng ngày.*

- `Samsung Galaxy` (29/11/2014 - 30/11/2017)

- 'KSV' (16/01/2018 - 31/03/2018)

- `Gen.G` (03/05/2018 - Hiện tại)

## 2. Cấu trúc Giải đấu & Nhóm Đối thủ (Tournament & Groups)
- **Phân cấp 3 tầng:**
    1. **Tournament Type (Loại giải):** LCK, Worlds, MSI... (Dùng để lọc khu vực/tầm cỡ).
    2. **Opponent Group (Nhóm đối thủ):** Một "pool" chứa các đội tuyển. Một nhóm có thể dùng cho nhiều giải đấu (Ví dụ: Nhóm "LCK Teams" dùng cho cả LCK Spring và LCK Summer).
    3. **Tournament Instance (Giải đấu cụ thể):** LCK Spring 2025. Liên kết với 1 Opponent Group.
- **Tính năng "Copy & Sync":** 
    - Cho phép copy danh sách đội từ một `Tournament Instance` cũ sang mới.
    - Hỗ trợ thêm/bớt đội linh hoạt cho từng giải mà không ảnh hưởng đến dữ liệu lịch sử.

## 3. Thể thức & Vòng đấu (Stages & Formats)
- **Logic linh hoạt:** 
    - Thể thức (BO1, BO3, BO5) được định nghĩa theo **Stage** (Vòng đấu).
    - Ví dụ: Trong giải Worlds 2024, Stage "Swiss" là BO1/BO3, Stage "Knockout" là BO5.
- **Tự động hóa Form:** Khi chọn Stage trong form nhập liệu, hệ thống tự động điều chỉnh số lượng ô nhập kết quả ván đấu (Game rows).

## 4. Đội hình mẫu & Quản lý Tuyển thủ (Squad Presets)
- **Cấu trúc Preset:** Lưu tên 5 vị trí (Top, Jg, Mid, Ad, Sup) + Tuyển thủ dự bị (nếu có).
- **Tính năng thông minh:** 
    - Khi chọn một Preset, nếu ngày thi đấu của trận nằm ngoài khoảng thời gian hoạt động của Preset đó, hệ thống sẽ đưa ra cảnh báo (Warning) nhưng vẫn cho phép lưu.
    - Cho phép chỉnh sửa nhanh (Override) từng vị trí ngay trên form nhập liệu trận đấu.

## 5. Staff Form: Trải nghiệm Nhập liệu (UI/UX)
- **Form Lịch sử (History):**
    - **Smart Search:** Ô chọn đối thủ phải hỗ trợ search theo tên hoặc viết tắt (Ví dụ: "T1" hoặc "SKT").
    - **Real-time Result:** Tự động tính Score tổng từ kết quả từng ván và gán trạng thái Win/Loss cho Đội nhà.
    - **Media Hierarchy:** Link VOD tổng sẽ tự động được gợi ý cho các ván lẻ nếu chưa có link riêng.
- **Form Lịch thi đấu (Schedule):**
    - Tự động gán `is_current: true` cho giải đấu được chọn.
    - Hiển thị thông báo nếu có 2 trận trùng giờ.

## 6. Bảo mật & An toàn Dữ liệu nâng cao
- **Hashids + Semantic Slug:** 
    - URL: `domain.com/match/geng-vs-t1-lck-spring-2025-aB8d2K`
    - `aB8d2K` là mã hóa của `match_id` trong DB. Khi server nhận request, nó sẽ giải mã để truy vấn.
- **Callback Link (Xác thực 2 lớp):**
    - Với các thao tác xóa hoặc sửa dữ liệu lịch sử (đã chốt), hệ thống sẽ gửi một link xác thực về email/token của Staff. Staff nhấn vào link (Callback) thì hành động mới được thực thi.
- **Data Versioning:** Lưu lại một bản log (History log) cho mỗi lần sửa đổi dữ liệu trận đấu để có thể khôi phục nếu nhập sai.

## 7. Lộ trình mở rộng (Future Roadmap)
- Xây dựng hệ thống thông số (Stats) chi tiết từng ván: Rồng, Sứ giả, Trụ, Gold Lead graph.
- Tích hợp tính năng lọc theo Khu vực đối thủ (LPL, LCP...) trên trang Match History của User.

## 10. Quy tắc Phát triển (Development Standards) - *Bắt buộc*
- **Giới hạn độ dài file:** Tối đa khoảng **300 dòng** code cho mỗi file.
- **Chia nhỏ Component:**
    - Nếu một Component quá lớn, bắt buộc phải tách thành các Sub-components nhỏ hơn (Ví dụ: `MatchForm` -> `MatchInfoSection`, `LineupSection`, `ResultSection`).
    - Logic phức tạp (xử lý dữ liệu, API call) nên tách ra thành `Custom Hooks` (Ví dụ: `useMatchData`, `useTeamResource`) hoặc `Utility Functions`.
- Mục tiêu: Dễ đọc, dễ bảo trì, dễ mở rộng và tái sử dụng.

## 11. Lộ trình Cập nhật Database (SQL Roadmap)
Để đảm bảo an toàn dữ liệu, việc cập nhật Schema sẽ được chia thành các bước nhỏ:

