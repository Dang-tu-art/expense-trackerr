const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer token"
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Không có token, vui lòng đăng nhập' 
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET || 'your_jwt_secret_key');
    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(403).json({ 
      message: 'Token không hợp lệ hoặc đã hết hạn' 
    });
  }
};

module.exports = {
  verifyToken
};
