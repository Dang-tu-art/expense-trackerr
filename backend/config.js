require('dotenv').config({
  path: process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env'
});

module.exports = {
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // THÊM DÒNG NÀY
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'expense_tracker',

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },

  port: process.env.API_PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
  ,jwtSecret: process.env.JWT_SECRET || 'expense-tracker-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h'
};