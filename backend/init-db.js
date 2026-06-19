const pool = require('./db');

async function initDatabase() {
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_users_email (email),
        UNIQUE KEY uq_users_username (username)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        amount DECIMAL(10, 2) NOT NULL,
        description VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        user_id INT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_user_id (user_id),
        CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    const [columns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'transactions' AND COLUMN_NAME = 'user_id'`
    );

    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE transactions
        ADD COLUMN user_id INT NULL,
        ADD INDEX idx_user_id (user_id)
      `);
    }

    const [constraints] = await connection.query(
      `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'transactions' AND CONSTRAINT_TYPE = 'FOREIGN KEY'`
    );

    const hasFk = constraints.some(row => row.CONSTRAINT_NAME === 'fk_transactions_user');
    if (!hasFk) {
      await connection.query(`
        ALTER TABLE transactions
        ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      `);
    }

    const [nullRows] = await connection.query(
      `SELECT COUNT(*) AS count FROM transactions WHERE user_id IS NULL`
    );

    if (nullRows[0].count > 0) {
      const [usersWithIds] = await connection.query(`SELECT id FROM users LIMIT 2`);
      if (usersWithIds.length === 1) {
        await connection.query(
          `UPDATE transactions SET user_id = ? WHERE user_id IS NULL`,
          [usersWithIds[0].id]
        );
      }
    }
  } finally {
    connection.release();
  }
}

module.exports = initDatabase;
