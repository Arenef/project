const authService = require('../service/auth.service');
const jwt = require('jsonwebtoken'); // Lỗi 1: Bạn quên import thư viện jwt

const login = async (req, res) => {
    try {
        const { userName, userPassword } = req.body;

        // Lỗi 2: Hàm authenticateUser của mình nhận 3 tham số (email, username, password). 
        // Vì người dùng nhập chung 1 ô userName, ta truyền nó vào cả 2 vị trí email và username.
        const user = await authService.authenticateUser(userName, userName, userPassword);

        const payload = {
            id: user.id,
            username: user.username,
            // role: user.role // Tạm thời bảng users chưa có cột role nên tắt đi nhé
        };

        // Lỗi 3: Biến JWT_SECRET chưa được khai báo. Lấy từ biến môi trường hoặc dùng chuỗi mặc định.
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        // Lỗi 4: Lệnh gửi response. Đã res.json thì thôi return user nhé.
        return res.status(200).json({ message: 'Đăng nhập thành công', token });
    }
    catch (error) {
        // Lỗi 5: Ở đây là nơi chúng ta "hứng" câu chửi từ Service (ví dụ: "Sai mật khẩu")
        // Tuyệt đối không dùng "throw error" ở Controller vì nó sẽ làm sập Server.
        return res.status(400).json({ message: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { email, userName, userPassword } = req.body;
        const newUser = await authService.registerUser(email, userName, userPassword);

        return res.status(201).json({
            message: 'Đăng ký thành công',
            user: newUser
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    // Với JWT (thường lưu ở LocalStorage), việc đăng xuất chủ yếu là xóa token ở trình duyệt (Frontend).
    // API này được tạo ra để phản hồi thông báo thành công, hoặc để sau này mở rộng (VD: đưa token vào danh sách đen).
    return res.status(200).json({ message: 'Đăng xuất thành công' });
};

module.exports = { login, register, logout };
