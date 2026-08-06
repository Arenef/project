const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // thay bằng user của bạn
    password: '4Nhan4Bang16@', // thay bằng password của bạn
    database: 'blogs' // thay bằng tên database của bạn
});

module.exports = pool;
