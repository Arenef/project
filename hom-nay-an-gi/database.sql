-- Không cần lệnh CREATE DATABASE hay USE nữa vì cấu hình kết nối Aiven đã chỏ thẳng vào defaultdb rồi.

-- 1. Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo bảng foods
CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tag VARCHAR(100),
    image_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tạo bảng histories (Lịch sử ăn uống)
CREATE TABLE IF NOT EXISTS histories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- 4. Tạo bảng favourites (Món ăn yêu thích)
CREATE TABLE IF NOT EXISTS favourites (
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, food_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- 5. Tạo bảng food_rankings (Bảng xếp hạng món ăn)
CREATE TABLE IF NOT EXISTS food_rankings (
    food_id INT NOT NULL,
    ranking_date DATE NOT NULL,
    selection_count INT DEFAULT 0,
    PRIMARY KEY (food_id, ranking_date),
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- Thêm một vài dữ liệu mẫu
INSERT INTO foods (name, description, tag, image_url) VALUES 
('Cơm Tấm Sườn Bì Chả', 'Món cơm tấm đặc sản Sài Gòn, ăn kèm nước mắm chua ngọt.', 'Cơm, Truyền thống', '/images/com-tam.jpg'),
('Phở Bò', 'Phở bò nước trong, thơm mùi quế hồi thảo quả.', 'Món nước, Truyền thống', '/images/pho-bo.jpg'),
('Bún Đậu Mắm Tôm', 'Bún đậu ăn kèm chả cốm, thịt luộc và mắm tôm chuẩn vị.', 'Bún, Truyền thống', '/images/bun-dau.jpg'),
('Gà Rán', 'Gà rán giòn rụm, nóng hổi.', 'Fast food, Ăn vặt', '/images/ga-ran.jpg'),
('Pizza Hải Sản', 'Pizza phô mai ngập tràn topping hải sản.', 'Fast food, Món Âu', '/images/pizza.jpg');
