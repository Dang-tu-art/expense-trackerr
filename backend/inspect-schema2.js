const mysql = require('mysql2/promise');
const config = require('./config');
(async () => {
  const pool = mysql.createPool(config.db);
  const conn = await pool.getConnection();
  const [rows] = await conn.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='transactions' AND COLUMN_NAME='user_id'");
  console.log('rows', rows);
  await conn.release();
  await pool.end();
})();
