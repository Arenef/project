const db = require("../config/database");

const authenticateUser = async (email, password) => {
    const [[user]] = await db.query("SELECT * FROM users WHERE email = ? && password = ?", [email, password]);
    return user;
};

const registerUser = async (email, password, username) => {
    // LƯU Ý QUAN TRỌNG: Ở đây CHỈ KIỂM TRA EMAIL, KHÔNG KIỂM TRA PASSWORD
    // Vì nếu kiểm tra cả password, một người có thể đăng ký cùng 1 email với nhiều password khác nhau!
    const [[user]] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user) {
        return false;
    }

    await db.query("INSERT INTO users (email, password, username) VALUES (?, ?, ?)", [email, password, username]);
    return true;
}

module.exports = {
    authenticateUser,
    registerUser
}