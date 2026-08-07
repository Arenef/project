# Dự án: Hôm nay ăn gì (What to eat today?)

Dự án này là một ứng dụng web giúp người dùng giải quyết câu hỏi nan giải mỗi ngày: "Hôm nay ăn gì?". Ứng dụng sẽ gợi ý ngẫu nhiên hoặc theo bộ lọc các món ăn, nhà hàng để người dùng dễ dàng lựa chọn.

## Đề xuất công nghệ
- **Backend:** Node.js + Express
- **Frontend:** HTML/CSS/JavaScript thuần (Vanilla JS) đặt trong thư mục `public` để phục vụ trực tiếp.

## Cấu trúc dự án đề xuất

### 1. Khởi tạo dự án & Backend Core (Node.js/Express)
- **`package.json`**: Chứa thông tin các dependencies (express, cors, ...).
- **`src/server.js`**: Điểm khởi chạy ứng dụng (Entry point), cấu hình server và middleware.

### 2. Dữ liệu & Xử lý Logic (Service)
- **`src/data/food.json`**: (Phiên bản v1) Chứa danh sách các món ăn mặc định (VD: Cơm tấm, Phở bò, Bún đậu mắm tôm...).
- **`src/service/food.service.js`**: Xử lý logic nghiệp vụ, như đọc dữ liệu món ăn, thuật toán chọn ngẫu nhiên.

### 3. API & Routes (Controller & Routes)
- **`src/controller/food.controller.js`**: Tiếp nhận request từ client, gọi qua Service xử lý và trả về response.
- **`src/routes/food.routes.js`**: Định nghĩa các router (ví dụ `GET /api/food/random`).

### 4. Giao diện Frontend (Public)
- **`public/index.html`**: Giao diện chính của ứng dụng.
- **`public/style.css`**: Chứa các style thiết kế (cần thiết kế đẹp, màu sắc hấp dẫn, có hiệu ứng hover/click).
- **`public/app.js`**: Mã JavaScript thực hiện việc gọi API từ Backend và cập nhật giao diện (ví dụ: tạo vòng quay ngẫu nhiên, hay random card).

## Kế hoạch kiểm thử
- Sử dụng công cụ (Postman/cURL) để test API `GET /api/food/random`.
- Mở `index.html` hoặc chạy server và truy cập `http://localhost:3000` để test luồng từ giao diện đến backend.
- Kiểm tra tính ngẫu nhiên của chức năng.

---

**Câu hỏi cần xác nhận:**
1. Bạn muốn thiết kế giao diện đơn giản dạng Card hiện ra ngẫu nhiên hay một "Vòng quay may mắn"?
2. Ở bản đầu tiên, chúng ta có cần làm tính năng tự thêm món không, hay dùng danh sách cố định trước?
3. Bạn muốn bắt đầu code Backend hay Frontend trước?
