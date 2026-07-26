// logout.controller.js
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Không thể đăng xuất' });
        }

        // Xóa cookie ở phía client
        res.clearCookie('connect.sid'); // connect.sid là tên mặc định của cookie sinh ra bởi express-session
        res.status(200).json({ message: 'Đăng xuất thành công!' });
    });
};

module.exports = logout;
