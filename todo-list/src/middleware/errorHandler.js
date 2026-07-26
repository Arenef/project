// middlewares/error.middleware.js

const errorHandler = (err, req, res, next) => {
  // Lấy statusCode bạn đã gán ở các nơi khác (mặc định 500 nếu quên gán)
  const statusCode = err.statusCode || 500;

  // Trả về response dạng JSON
  return res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'Lỗi hệ thống!'
  });
};

module.exports = errorHandler;