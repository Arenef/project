// auth.middleware.js
const requireLogin = (req, res, next) => {
    // Kiểm tra xem session có tồn tại thông tin đăng nhập không
    if (req.session && req.session.isLoggedIn) {
        next(); // Cho phép đi tiếp vào controller
    } else {
        res.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện hành động này!' });
    }
};

module.exports = requireLogin;
