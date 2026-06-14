const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '27112004',
    multipleStatements: true
  });

  try {
    const sql = fs.readFileSync(path.join(__dirname, 'database/schema.sql'), 'utf8');
    
    console.log('🔄 Setting up database...');
    await connection.query(sql);
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Database: expense_tracker');
    console.log('📋 Table: transactions');
    console.log('📝 Sample data: 10 expenses loaded');
    
  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setupDatabase();
