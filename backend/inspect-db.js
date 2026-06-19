const mysql = require('mysql2/promise');
const config = require('./config');
(async () => {
  const pool = mysql.createPool(config.db);
  const conn = await pool.getConnection();
  const [expenses] = await conn.query('SELECT id, amount, description, category, date, user_id FROM transactions LIMIT 10');
  console.log('expenses', JSON.stringify(expenses, null, 2));
  await conn.release();
  await pool.end();
})();
