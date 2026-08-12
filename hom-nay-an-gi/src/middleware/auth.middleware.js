const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Lấy token từ Header của request (thường Frontend sẽ gửi lên theo định dạng: "Bearer <chuỗi_token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy phần token ở phía sau chữ Bearer

    // 2. Nếu người dùng không gửi kèm token -> Báo lỗi 401 (Unauthorized: Chưa đăng nhập)
    if (!token) {
        return res.status(401).json({ message: 'Truy cập bị từ chối. Bạn chưa đăng nhập!' });
    }

    try {
        // 3. Xác minh (Verify) token bằng chữ ký mộc đỏ (JWT_SECRET)
        const JWT_SECRET = process.env.JWT_SECRET || 'HomNayAnGiSecretKey2026';

        // Lệnh này sẽ bung payload ra (chứa id, username...) nếu chữ ký đúng và chưa hết hạn
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. Nhét dữ liệu người dùng vào biến req.user để các hàm phía sau có thể xài (ví dụ: biết ai đang gọi API)
        req.user = decoded;

        // 5. Cấp phép cho đi tiếp vào Controller
        next();
    } catch (error) {
        console.error("JWT Verify Error:", error);
        // Nếu chữ ký bị sai (do giả mạo) hoặc token đã hết hạn (quá 7 ngày)
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!' });
    }
};

module.exports = { verifyToken };
