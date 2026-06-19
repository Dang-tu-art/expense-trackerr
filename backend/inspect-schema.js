const mysql = require('mysql2/promise');
const config = require('./config');
(async () => {
  const pool = mysql.createPool(config.db);
  const conn = await pool.getConnection();
  const [tables] = await conn.query("SHOW TABLES LIKE 'transactions'");
  console.log('tables', tables);
  const [cols] = await conn.query('SHOW COLUMNS FROM transactions');
  console.log('columns', cols.map(c => c.Field));
  const [rows] = await conn.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='transactions' AND COLUMN_NAME='user_id'");
  console.log('info schema rows', rows);

  try {
    const [alterResult] = await conn.query("ALTER TABLE transactions ADD COLUMN user_id INT NULL, ADD INDEX idx_user_id (user_id)");
    console.log('alterResult', alterResult);
  } catch (err) {
    console.error('alter error', err.message || err);
  }

  const [cols2] = await conn.query('SHOW COLUMNS FROM transactions');
  console.log('columns after alter', cols2.map(c => c.Field));
  await conn.release();
  await pool.end();
})();
