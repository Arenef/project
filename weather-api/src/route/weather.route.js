const express = require('express');
const router = express.Router();

// Trỏ đúng tới file Controller bạn vừa tạo
const weatherController = require('../controller/weatherController');

// Không có dấu () ở cuối getWeather nhé, để Express tự động truyền req và res vào
router.get('/weather/:city', weatherController.getWeather);

module.exports = router;