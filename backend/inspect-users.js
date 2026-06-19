const mysql = require('mysql2/promise');
const config = require('./config');
(async () => {
  const pool = mysql.createPool(config.db);
  const conn = await pool.getConnection();
  const [users] = await conn.query('SELECT id, username FROM users');
  console.log('users', JSON.stringify(users, null, 2));
  await conn.release();
  await pool.end();
})();
