const userService = require("../service/users.service");

const register = async (req, res, next) => {
    const { email, password, username } = req.body;

    if (!username) {
        const error = new Error('Username không được để trống');
        error.statusCode = 400;
        return next(error);
    }

    const isRegistered = await userService.registerUser(email, password, username);

    if (isRegistered === false) {
        const error = new Error('Email đã được sử dụng');
        error.statusCode = 400; // Gán giá trị bằng dấu =, không dùng ngoặc ()
        return next(error);
    }

    return res.status(201).json({ message: 'Đăng kí thành công' });
};

module.exports = register;