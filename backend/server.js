const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');

const healthRoutes = require('./routes/health');
const expensesRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
const initDatabase = require('./init-db');

const app = express();

// Logger middleware
const logger = {
  log: (level, message, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}]`, message, data);
  }
};

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.log('INFO', `${req.method} ${req.path}`, { 
      status: res.statusCode, 
      duration: `${duration}ms` 
    });
  });
  next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expensesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Expense Tracker API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      getAllExpenses: 'GET /api/expenses',
      getExpenseById: 'GET /api/expenses/:id',
      getSummary: 'GET /api/expenses/summary/:period',
      createExpense: 'POST /api/expenses',
      updateExpense: 'PUT /api/expenses/:id',
      deleteExpense: 'DELETE /api/expenses/:id'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

async function startServer() {
  try {
    console.log('Initializing database schema...');
    await initDatabase();
    console.log('Database schema initialization complete.');

    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
