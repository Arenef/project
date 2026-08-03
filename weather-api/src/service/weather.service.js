const redis = require('redis');

// Khởi tạo Redis Client
const redisClient = redis.createClient({});

// Bắt lỗi nếu Redis server không chạy (để ứng dụng không sập)
redisClient.on('error', (err) => {
    // Chỉ in ra dòng cảnh báo thay vì in toàn bộ mã lỗi dài dòng
});

// Kết nối với Redis Server (Nếu kết nối không được, in ra cảnh báo màu vàng)
redisClient.connect().catch(() => {
    console.log('⚠️ CẢNH BÁO: Không thể kết nối Redis. Ứng dụng sẽ tự động chuyển sang chế độ gọi trực tiếp API mà không dùng Cache.');
});

// Hàm lấy dữ liệu từ Cache
const cachedData = async (city) => {
    // Nếu Redis chưa sẵn sàng hoặc kết nối lỗi, bỏ qua Cache
    if (!redisClient.isReady) return null;

    try {
        const cacheKey = `weather:${city}`;
        const data = await redisClient.get(cacheKey);

        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.log('Lỗi đọc Cache:', error.message);
        return null; // Bỏ qua lỗi và trả về null để luồng chính vẫn tiếp tục
    }
}

// Hàm lưu dữ liệu vào Cache
const setRedisData = async (city, data) => {
    // Nếu Redis chưa sẵn sàng, bỏ qua việc lưu
    if (!redisClient.isReady) return;

    try {
        await redisClient.set(`weather:${city}`, JSON.stringify(data), {
            EX: 3600 // Lưu trong 1 tiếng
        });
    } catch (error) {
        console.log('Lỗi lưu Cache:', error.message);
    }
};

// Hàm chính xử lý logic
const getWeather = async (city) => {
    // 1. Kiểm tra cache trước
    const cached = await cachedData(city);
    if (cached) {
        console.log(`[Cache Hit] Trả về dữ liệu thời tiết của ${city} từ Redis`);
        return cached;
    }

    const APIKEY = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`;

    try {
        console.log(`[Cache Miss] Gọi API bên ngoài cho thành phố ${city}...`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API lỗi: ${response.statusText}`);
        }

        const data = await response.json();

        // 2. Gọi API thành công thì lưu kết quả vào Cache
        await setRedisData(city, data);
        console.log(`[Cache Saved] Đã lưu dữ liệu thời tiết của ${city} vào Redis`);

        return data;
    }
    catch (error) {
        console.log('Lỗi khi gọi API Weather:', error.message);
        throw error;
    }
};

module.exports = {
    getWeather,
    cachedData,
    setRedisData
}

/*
1. Lưu dữ liệu vào Cache
    Câu lệnh Redis gốc: SET key value
    Ý nghĩa: Lưu một chuỗi (value) vào một định danh (key).
    Ví dụ: SET weather:hanoi "{'temp': 25, 'description': 'mưa'}"

2. Lấy dữ liệu từ Cache ra
    Câu lệnh Redis gốc: GET key
    Ý nghĩa: Trả về value của một key nếu key đó tồn tại. Nếu không tồn tại,
        nó trả về nil (tương đương với null).
    Áp dụng cho dự án: Ở Bước 1, bạn sẽ dùng lệnh này (GET weather:hanoi) để kiểm tra 
        xem đã có dữ liệu cache chưa. Nếu nó không trả về null thì đó chính là Bước 2.
3. Cài đặt thời gian tự hủy (TTL - Time to Live)
    Câu lệnh Redis gốc: EXPIRE key seconds
    Ý nghĩa: Xóa bỏ một key sau một khoảng thời gian (tính bằng giây).
    Thời tiết thì thay đổi liên tục, nên bạn không nên lưu vĩnh viễn trong cache mà thường 
        chỉ giữ khoảng 15-30 phút.
4. Lệnh "Tất cả trong một" (Hay dùng nhất cho Cache)
    Câu lệnh Redis gốc: SETEX key seconds value (Lưu ý: trên các phiên bản node-redis mới,
        người ta thường dùng lệnh SET key value EX seconds làm tiêu chuẩn thay thế)
    Ý nghĩa: Đây là sự kết hợp của lệnh SET và EXPIRE. Nó vừa lưu dữ liệu vào,
        vừa cài đặt luôn thời gian hủy cho dữ liệu đó.
        Áp dụng cho dự án: Ở Bước 5, sau khi lấy dữ liệu từ API thời tiết ngoài về,
        bạn có thể dùng lệnh này để lưu dữ liệu vào cache và thiết lập luôn nó sẽ hết hạn sau 15 phút (900 giây).
*/