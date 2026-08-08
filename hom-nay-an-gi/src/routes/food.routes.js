const express = require('express');
const router = express.Router();
const foodController = require('../controller/food.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// 1. Các route tĩnh (static) hoặc route lấy nhiều dữ liệu phải đặt lên TRƯỚC
router.get('/', foodController.getFoodAll);
router.get('/random', foodController.getRandomFood); // <-- Tính năng Random
router.get('/tag', foodController.getFoodByTag);
router.get('/name', foodController.getFoodByName);

// 2. Tạo dữ liệu mới thường dùng method POST (Chỉ người đăng nhập mới được tạo)
router.post('/', verifyToken, foodController.createFood);

// 3. Các route có tham số động (dynamic /:id) phải đặt ở SAU CÙNG
// Nếu đặt lên trước, chữ "tag", "name" hay "random" sẽ bị hiểu nhầm là 1 cái ID
router.get('/:id', foodController.getFoodById);
router.put('/:id', verifyToken, foodController.updateFood); // Dùng PUT hoặc PATCH cho update (Cần đăng nhập)
router.delete('/:id', verifyToken, foodController.deleteFood); // Cần đăng nhập

module.exports = router;