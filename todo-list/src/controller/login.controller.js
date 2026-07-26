// login.controller.js
const login = async (req, res) => {
    const { username, password } = req.body;

    // 1. Kiểm tra username và password trong Database (giả lập)
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    // 2. Xác thực thành công -> Lưu thông tin vào session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isLoggedIn = true;

    res.status(200).json({ message: 'Đăng nhập thành công!' });
};

module.exports = login;
