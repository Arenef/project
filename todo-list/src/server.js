const express = require('express');
const helmet = require('helmet');

const todoRoutes = require('./routes/todos.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = 8080;

app.use(session({
    secret: 'my-super-secret-key', // Khóa bí mật để ký session ID (nên lưu trong file .env)
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: false, // Không lưu các session chưa được khởi tạo (giúp tiết kiệm bộ nhớ)
    cookie: {
        secure: false, // Đặt là true nếu chạy trên HTTPS (production)
        maxAge: 1000 * 60 * 60 * 24 // Thời gian sống của cookie (ví dụ: 1 ngày)
    }
}));



app.use(express.json());
app.use(helmet());

// Các route Public (Ai cũng vào được)
app.use('/auth', authRoutes);
// Các route Private (Bị chặn bởi requireLogin bên trong todoRoutes)
app.use('/todos', todoRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});