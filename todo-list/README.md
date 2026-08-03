<div align="center">
  <h1>📝 Todo List Application & Developer Guide</h1>
  <p>
    <b>Một ứng dụng Quản lý công việc và Cẩm nang hướng dẫn code dự án từ A-Z với Node.js, Express & MySQL.</b>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
    <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  </p>
</div>

---

## 📋 Mục lục

- [🌟 Phần 1: Giới thiệu chung về Project](#-phần-1-giới-thiệu-chung-về-project)
  - [🚀 Tính năng & Công nghệ](#-tính-năng--công-nghệ)
  - [⚙️ Hướng dẫn cài đặt](#️-hướng-dẫn-cài-đặt)
- [📚 Phần 2: Hướng Dẫn Code (Step-by-Step Developer Guide)](#-phần-2-hướng-dẫn-code-step-by-step-developer-guide)
  - [Bước 1: Khởi tạo dự án và cài đặt Package](#bước-1-khởi-tạo-dự-án-và-cài-đặt-package)
  - [Bước 2: Xây dựng cấu trúc thư mục chuẩn MVC](#bước-2-xây-dựng-cấu-trúc-thư-mục-chuẩn-mvc)
  - [Bước 3: Cấu hình kết nối MySQL (`config/database.js`)](#bước-3-cấu-hình-kết-nối-mysql-configdatabasejs)
  - [Bước 4: Viết File Server Chính (`app.js`)](#bước-4-viết-file-server-chính-appjs)
  - [Bước 5: Viết Models (Lớp Dữ Liệu)](#bước-5-viết-models-lớp-dữ-liệu)
  - [Bước 6: Viết Controllers (Lớp Xử Lý)](#bước-6-viết-controllers-lớp-xử-lý)
  - [Bước 7: Phân luồng bằng Routes](#bước-7-phân-luồng-bằng-routes)
  - [Bước 8: Xây dựng Middleware Bảo Mật](#bước-8-xây-dựng-middleware-bảo-mật)
- [💡 Quy Trình Làm Tính Năng Mới (Workflow Dành Cho Bạn)](#-quy-trình-làm-tính-năng-mới-workflow-dành-cho-bạn)

---

## 🌟 Phần 1: Giới thiệu chung về Project

### 🚀 Tính năng & Công nghệ
- **Chức năng chính:** Đăng ký, Đăng nhập (Session), CRUD Todo.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **Frontend:** HTML, CSS, JavaScript thuần.

### ⚙️ Hướng dẫn cài đặt

1. **Clone & Cài đặt:**
   ```bash
   git clone <repository-url>
   npm install
   ```

2. **Cấu hình `.env`:**
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=todolist
   SESSION_SECRET=your_secret
   ```

3. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

---

## 📚 Phần 2: Hướng Dẫn Code (Step-by-Step Developer Guide)

Phần này là cẩm nang chi tiết từng bước xây dựng dự án, giúp bạn dùng làm bộ khung (template) chuẩn để dựng các project Backend khác sau này.

### Bước 1: Khởi tạo dự án và cài đặt Package
Khởi tạo project Node.js và cài đặt các thư viện cần thiết. Mở terminal tại thư mục dự án và chạy:

```bash
# 1. Tạo file package.json quản lý dự án
npm init -y

# 2. Cài đặt các thư viện lõi (Core libraries)
npm install express mysql2 dotenv express-session cors

# 3. Cài đặt công cụ hỗ trợ dev (giúp server tự restart khi code thay đổi)
npm install --save-dev nodemon
```
*Ghi chú các thư viện:* 
- `express`: Framework chính để tạo server và xử lý API.
- `mysql2`: Thư viện kết nối và tương tác với MySQL.
- `dotenv`: Đọc biến môi trường từ file `.env` (giúp giấu password, secret keys).
- `express-session`: Quản lý phiên đăng nhập (Cookies/Sessions).

Tiếp theo, vào file `package.json`, thêm đoạn script sau để dễ chạy code:
```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

---

### Bước 2: Xây dựng cấu trúc thư mục chuẩn MVC
Để source code gọn gàng, chia dự án ra thành các thư mục chuyên biệt:

```bash
mkdir config controllers models routes middleware public views
```
- **config**: Chứa các file cấu hình (như file kết nối Database).
- **controllers**: Nơi viết logic xử lý chính (Nhận yêu cầu -> Xử lý -> Trả kết quả).
- **models**: Nơi chứa các câu lệnh SQL tương tác trực tiếp với Database.
- **routes**: Khai báo các đường link (URL/Endpoint) của API.
- **middleware**: Lớp "bảo vệ" chạy trước khi vào Controller (ví dụ: kiểm tra xem đã login chưa).

---

### Bước 3: Cấu hình kết nối MySQL (`config/database.js`)
Chúng ta dùng `createPool` thay vì `createConnection` để tái sử dụng kết nối, giúp ứng dụng chịu tải tốt hơn nhiều.

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Thử kết nối để báo lỗi ngay nếu sai cấu hình
pool.getConnection()
    .then(connection => {
        console.log('✅ Kết nối Database thành công!');
        connection.release();
    })
    .catch(err => console.error('❌ Lỗi kết nối DB:', err.message));

module.exports = pool;
```

---

### Bước 4: Viết File Server Chính (`app.js`)
File này là gốc của dự án, nơi khởi tạo Server và nối các thành phần lại với nhau.

```javascript
const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

// 1. Cấu hình để Server đọc được dữ liệu JSON và Form Client gửi lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Khởi tạo Session cho chức năng Đăng nhập
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Để 'true' nếu bạn có chứng chỉ HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    } 
}));

// 3. Kết nối các file Routes
const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todos.routes');

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

// 4. Bật Server lắng nghe ở cổng được chỉ định
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
```

---

### Bước 5: Viết Models (Lớp Dữ Liệu)
*Mẫu: `models/TodoModel.js`*. File này **chỉ** chứa code SQL, tuyệt đối không chứa logic của Express (req, res).

```javascript
const db = require('../config/database');

const TodoModel = {
    // Hàm lấy danh sách công việc của một người dùng
    getAllByUserId: async (userId) => {
        const [rows] = await db.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
        return rows;
    },
    
    // Hàm tạo công việc mới
    create: async (userId, title, description) => {
        const [result] = await db.query(
            'INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)',
            [userId, title, description]
        );
        return result.insertId; // Trả về ID của dòng vừa tạo
    }
};

module.exports = TodoModel;
```

---

### Bước 6: Viết Controllers (Lớp Xử Lý)
*Mẫu: `controllers/todoController.js`*. File này nhận Data từ Client, gọi Model tương ứng để làm việc với DB, rồi phản hồi về cho Client.

```javascript
const TodoModel = require('../models/TodoModel');

const todoController = {
    getTodos: async (req, res) => {
        try {
            // Lấy ID người dùng từ session
            const userId = req.session.userId; 
            const todos = await TodoModel.getAllByUserId(userId);
            
            res.status(200).json(todos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi hệ thống!" });
        }
    },
    
    addTodo: async (req, res) => {
        try {
            const userId = req.session.userId;
            const { title, description } = req.body;
            
            // Validate dữ liệu sơ bộ
            if (!title) return res.status(400).json({ error: "Tiêu đề không được để trống" });

            const newTodoId = await TodoModel.create(userId, title, description);
            res.status(201).json({ message: "Thêm thành công!", id: newTodoId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi hệ thống!" });
        }
    }
};

module.exports = todoController;
```

---

### Bước 7: Phân luồng bằng Routes
*Mẫu: `routes/todos.routes.js`*. Khai báo URL nào sẽ chạy vào hàm nào của Controller.

```javascript
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth'); 

// Chặn Middleware bảo vệ cho tất cả route bên dưới (Phải đăng nhập mới vào được)
router.use(authMiddleware);

// Các API Endpoint
router.get('/', todoController.getTodos);     // GET /todos
router.post('/', todoController.addTodo);     // POST /todos
// router.put('/:id', todoController.updateTodo); // Tự làm thêm CRUD nhé!
// router.delete('/:id', todoController.deleteTodo);

module.exports = router;
```

---

### Bước 8: Xây dựng Middleware Bảo Mật
*Mẫu: `middleware/auth.js`*. 

```javascript
const requireLogin = (req, res, next) => {
    // Nếu trong session chưa có userId -> Chưa đăng nhập
    if (!req.session.userId) {
        return res.status(401).json({ error: "Bạn chưa đăng nhập! Vui lòng đăng nhập lại." });
    }
    
    // Nếu đã đăng nhập, cho phép đi tiếp vào Controller
    next(); 
};

module.exports = requireLogin;
```

---

## 💡 Quy Trình Làm Tính Năng Mới (Workflow Dành Cho Bạn)

Mỗi khi muốn thêm 1 tính năng mới vào hệ thống (ví dụ: tính năng Cập nhật Profile, Tạo Comment, v.v.), hãy làm ĐÚNG thứ tự sau để code không bị rối:

1. **Database:** Suy nghĩ xem dữ liệu cần lưu là gì? Cần thêm/sửa bảng nào trong MySQL không?
2. **Model:** Mở thư mục `models`, viết hàm Query SQL để `SELECT`, `INSERT`, hoặc `UPDATE`.
3. **Controller:** Mở thư mục `controllers`, viết hàm lấy dữ liệu từ Client `req.body`, gọi hàm Model vừa làm ở bước 2, rồi trả về `res.json()`.
4. **Route:** Mở thư mục `routes`, tạo đường dẫn URL mới (ví dụ `router.post('/comment', ...)`), trỏ nó tới hàm Controller ở bước 3.
5. **Test API:** Dùng Postman hoặc Insomnia, gọi thử đường dẫn API vừa tạo xem có trả về dữ liệu đúng không.

> **Bí kíp:** Luôn luôn bắt đầu từ Database đi lên, đừng viết Route trước khi chưa biết mình sẽ lấy dữ liệu gì ra!

---
*Chúc bạn code vui vẻ. Hãy giữ lại file README này làm bí kíp để clone ra vô vàn project xịn xò khác nhé! 🚀*
