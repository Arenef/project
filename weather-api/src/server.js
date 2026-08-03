const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const weatherRoute = require('./route/weather.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Phục vụ giao diện Frontend
app.use(express.static(path.join(__dirname, 'public')));

// Đăng ký API Route
app.use('/api', weatherRoute);

app.listen(PORT, () => {
    console.log(`Server đã khởi chạy tại http://localhost:${PORT}`);
});
