const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cấu hình Cloudinary bằng các biến môi trường
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình nơi lưu trữ (Storage) cho Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'homnayangi', // Tên thư mục trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'], // Các định dạng cho phép
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Có thể tự động thu nhỏ ảnh nếu muốn
    }
});

// 3. Khởi tạo middleware upload
const upload = multer({ storage: storage });

module.exports = upload;
