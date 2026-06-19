const mysql = require('mysql2/promise');
const config = require('./config');
(async () => {
  const pool = mysql.createPool(config.db);
  const conn = await pool.getConnection();
  await conn.query('UPDATE transactions SET user_id = 1 WHERE user_id IS NULL');
  const [expenses] = await conn.query('SELECT id, user_id FROM transactions ORDER BY id LIMIT 10');
  console.log('updated expenses', JSON.stringify(expenses, null, 2));
  await conn.release();
  await pool.end();
})();
