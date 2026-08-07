CREATE DATABASE IF NOT EXISTS HomNayAnGi;
USE HomNayAnGi;

CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tag VARCHAR(100),
    image_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm một vài dữ liệu mẫu (Sử dụng ảnh trong thư mục public/images/)
INSERT INTO foods (name, description, tag, image_url) VALUES 
('Cơm Tấm Sườn Bì Chả', 'Món cơm tấm đặc sản Sài Gòn, ăn kèm nước mắm chua ngọt.', 'Cơm, Truyền thống', '/images/com-tam.jpg'),
('Phở Bò', 'Phở bò nước trong, thơm mùi quế hồi thảo quả.', 'Món nước, Truyền thống', '/images/pho-bo.jpg'),
('Bún Đậu Mắm Tôm', 'Bún đậu ăn kèm chả cốm, thịt luộc và mắm tôm chuẩn vị.', 'Bún, Truyền thống', '/images/bun-dau.jpg'),
('Gà Rán', 'Gà rán giòn rụm, nóng hổi.', 'Fast food, Ăn vặt', '/images/ga-ran.jpg'),
('Pizza Hải Sản', 'Pizza phô mai ngập tràn topping hải sản.', 'Fast food, Món Âu', '/images/pizza.jpg');
