const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "4Nhan4Bang16@",
    database: "todolist"
});

module.exports = db;