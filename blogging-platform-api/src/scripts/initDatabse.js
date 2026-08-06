const mysql = require('mysql2/promise');

async function initializeDatabase() {
    try {
        // Connect without specifying a database first to create it if it doesn't exist
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root', // thay bằng user của bạn
            password: '4Nhan4Bang16@', // thay bằng password của bạn
        });

        console.log('Đã kết nối tới MySQL server.');

        // Tạo database nếu chưa có
        await connection.query('CREATE DATABASE IF NOT EXISTS blogs');
        console.log('Database "blogs" đã sẵn sàng.');

        // Chọn database
        await connection.query('USE blogs');

        // Tạo bảng blogs
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS blogs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                category VARCHAR(100),
                tag VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createTableQuery);
        console.log('Bảng "blogs" đã sẵn sàng.');

        // Thêm dữ liệu mẫu (tuỳ chọn)
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM blogs');
        if (rows[0].count === 0) {
            const insertDataQuery = `
                INSERT INTO blogs (title, content, category, tag) VALUES
                ('Tương lai của Lập trình Web', 'Trong 5 năm tới, lập trình web sẽ bị ảnh hưởng mạnh mẽ bởi AI và WebAssembly. Các framework như React và Vue sẽ tiếp tục phát triển, nhưng cách chúng ta viết code có thể chuyển hướng sang các hệ thống thông minh hơn.', 'Công nghệ', 'Technology, Code'),
                ('Nắm vững Nguyên tắc Thiết kế UI/UX', 'Một thiết kế tuyệt vời là thiết kế vô hình. Khi thiết kế giao diện người dùng, hãy tập trung vào khoảng cách, kiểu chữ và độ tương phản. Sử dụng bảng màu nhất quán và đảm bảo các tương tác vi mô mang lại phản hồi ý nghĩa.', 'Thiết kế', 'Design'),
                ('Cân bằng Công việc và Cuộc sống của Lập trình viên', 'Burnout là một vấn đề thực sự trong ngành công nghệ. Điều quan trọng là phải thiết lập ranh giới, nghỉ ngơi thường xuyên và rời xa màn hình. Hãy nhớ rằng sức khỏe của bạn quan trọng hơn tính năng tiếp theo sắp ra mắt.', 'Đời sống', 'Life')
            `;
            await connection.query(insertDataQuery);
            console.log('Đã thêm dữ liệu mẫu vào bảng "blogs".');
        }

        console.log('Khởi tạo Database thành công!');
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('Lỗi khởi tạo Database:', error);
        process.exit(1);
    }
}

initializeDatabase();
