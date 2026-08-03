# Weather API - Hướng dẫn sử dụng chi tiết

Dự án này là một API lấy thông tin thời tiết, có sử dụng **Redis** để lưu trữ đệm (caching) và **Fetch API** để gọi dữ liệu từ OpenWeatherMap.

Dưới đây là các câu lệnh và hướng dẫn chi tiết nhất để bạn dễ dàng làm quen và ghi nhớ mỗi khi mở dự án lên.

---

## 1. Yêu cầu hệ thống và Cài đặt thư viện (NPM Install)

### Đối với Redis
Để kết nối Node.js với Redis, bạn cần cài đặt package `redis`.
Mở terminal tại thư mục dự án (`weather-api`) và chạy lệnh:

```bash
npm install redis
```

*Lưu ý: Mã nguồn chỉ là client kết nối. Bạn cần phải cài đặt và chạy server Redis trên máy tính của mình để ứng dụng không bị lỗi. Cách nhanh nhất là dùng Docker:*
```bash
docker run -d --name redis-server -p 6379:6379 redis:latest
```

### Đối với Fetch API
- Nếu bạn đang sử dụng **Node.js phiên bản 18 trở lên**, `fetch` đã được tích hợp sẵn mặc định. Bạn **KHÔNG CẦN** cài đặt thêm bất kỳ thư viện nào (như `npm install node-fetch`).
- Chỉ cần gọi `fetch()` trực tiếp trong code như bạn đang làm ở file service!

### Các thư viện phụ trợ khác
Thông thường bạn sẽ cần đọc biến môi trường để bảo mật API Key:
```bash
npm install dotenv
```

---

## 2. Giải thích & Câu lệnh mẫu trong Code (`weather.service.js`)

### A. Redis (Caching)
**Mục đích:** Khi người dùng tra cứu thời tiết của một thành phố (vd: Hà Nội), thay vì lần nào cũng gọi API của OpenWeatherMap (gây chậm và dễ bị khóa API nếu gọi quá nhiều), ta sẽ gọi 1 lần rồi lưu kết quả vào Redis. Các lần gọi sau trong vòng 1 tiếng sẽ lấy thẳng từ Redis ra cực kỳ nhanh.

**Các câu lệnh chuẩn:**

```javascript
// 1. LƯU DỮ LIỆU VÀO REDIS (Set Cache)
await redisClient.set(`weather:${city}`, JSON.stringify(data), {
    EX: 3600 // Tham số EX (Expire): Thời gian sống của cache tính bằng GIÂY. 3600s = 1 giờ.
});
// (Lưu ý: Redis chỉ lưu trữ chuỗi (string), nên bạn bắt buộc phải dùng JSON.stringify để biến object thành chuỗi trước khi lưu).

// 2. LẤY DỮ LIỆU TỪ REDIS (Get Cache)
const cached = await redisClient.get(`weather:${city}`);
if (cached) {
    // Vì lúc lưu ta đã ép thành chuỗi, lúc lấy ra phải parse ngược lại thành Object
    const dataObject = JSON.parse(cached); 
    return dataObject;
}
```

### B. Fetch API (Gọi API bên ngoài)
**Mục đích:** Gửi HTTP request đến server của OpenWeatherMap.

**Cấu hình trước khi chạy:**
Bạn cần có một file `.env` (như file `src/.env` bạn đang có) chứa key:
```env
API_KEY=Mã_API_Của_Bạn_Ở_Đây
```

**Các câu lệnh chuẩn:**

```javascript
// 1. Khai báo URL với các tham số truyền vào URL (query string)
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;

// 2. Thực hiện gọi API
const response = await fetch(url);

// 3. Kiểm tra xem request có thành công không (Mã HTTP Status từ 200-299)
// Nếu sai tên thành phố hoặc API key, response.ok sẽ là false
if (!response.ok) {
    throw new Error(`Weather API lỗi: ${response.statusText}`);
}

// 4. Bóc tách dữ liệu JSON từ phản hồi của server
const data = await response.json();
```

---

## 3. Lời khuyên để không phải nhớ lệnh Terminal

Để đỡ vất vả gõ lệnh mỗi khi chạy, bạn hãy mở file `package.json` của dự án `weather-api` và thêm cấu hình này vào phần `"scripts"`:

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "node --watch src/index.js" 
}
```
*(Lưu ý: Cờ `--watch` có sẵn từ Node 18+, nó tự động chạy lại server mỗi khi bạn lưu file code, bạn không cần phải cài `nodemon` nữa).*

Từ nay, bạn chỉ cần mở terminal và gõ một trong hai lệnh siêu ngắn này:
- **`npm run dev`**: Chạy dự án lúc đang code (server tự khởi động lại khi sửa code).
- **`npm start`**: Chạy dự án lúc triển khai lên môi trường thật.
