const { pool } = require('../config/database');
const bcrypt = require('bcrypt'); // Thư viện mã hóa mật khẩu

const authenticateUser = async (email, username, userPassword) => {
    try {
        // Lấy danh sách (mảng) user thỏa mãn điều kiện
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR username = ?', 
            [email, username]
        );

        // Lấy user đầu tiên trong mảng
        const user = rows[0];

        if (!user) {
            throw new Error('Tài khoản hoặc email không tồn tại');
        }

        // So sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong DB
        const isMatch = await bcrypt.compare(userPassword, user.password_hash);

        if (!isMatch) {
            throw new Error('Sai mật khẩu');
        }

        // Trả về thông tin user (nhưng KHÔNG trả về password)
        delete user.password_hash;
        return user;
    }
    catch (error) {
        // Ném lỗi ra để Controller bắt được
        throw error;
    }
};

const registerUser = async (email, username, userPassword) => {
    try {
        // 1. Kiểm tra Email đã tồn tại chưa
        const [emailRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (emailRows.length > 0) {
            throw new Error('Email này đã được sử dụng');
        }

        // 2. Kiểm tra Username đã tồn tại chưa
        const [usernameRows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (usernameRows.length > 0) {
            throw new Error('Tên tài khoản này đã có người sử dụng');
        }

        // 3. Mã hóa mật khẩu
        // '10' là số vòng băm (saltRounds) - Càng cao càng an toàn nhưng tốn thời gian chạy
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // 4. Lưu vào Database
        const [result] = await pool.query(
            'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );

        return {
            id: result.insertId,
            username: username,
            email: email
        };
    }
    catch (error) {
        throw error; // Ném thẳng lỗi (ví dụ: 'Email này đã được sử dụng') ra cho Controller
    }
}

module.exports = {
    authenticateUser,
    registerUser
};