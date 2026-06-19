const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/health - Health check with database
router.get('/', async (req, res) => {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Expense Tracker API',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'Expense Tracker API',
      message: 'Service unavailable',
      error: error.message
    });
  }
});

module.exports = router;
