const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '4Nhan4Bang16@',
  database: process.env.DB_NAME || 'HomNayAnGi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected to database: HomNayAnGi successfully!');
    connection.release();
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
