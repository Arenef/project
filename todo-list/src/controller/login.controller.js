const usersService = require("../service/users.service");

// login.controller.js
const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await usersService.authenticateUser(email, password);

    if (!user) {
        return res.status(401).json({ message: 'Thông tin đăng nhập chưa chính xác' });
    }

    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.username = user.username;
    req.session.isLoggedIn = true;

    res.status(200).json({ message: 'Đăng nhập thành công!' });
};

module.exports = login;
