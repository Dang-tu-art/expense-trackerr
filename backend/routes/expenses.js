const express = require('express');
const ExcelJS = require('exceljs');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

/**
 * 1. GET /api/expenses/export
 * Xuất file Excel cho chi tiêu của user (Đã JOIN lấy tên danh mục)
 */
router.get('/export', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // Dùng LEFT JOIN để lấy cột name từ bảng categories và đặt alias là category
    const [rows] = await connection.query(
      `SELECT t.id, t.amount, t.description, c.name AS category, t.date, t.createdAt 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? 
       ORDER BY t.date DESC`,
      [req.user.id]
    );
    connection.release();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Expenses');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Ngày', key: 'date', width: 18 },
      { header: 'Mô tả', key: 'description', width: 40 },
      { header: 'Danh mục', key: 'category', width: 22 },
      { header: 'Số tiền', key: 'amount', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 22 }
    ];

    rows.forEach(row => {
      sheet.addRow({
        id: row.id,
        date: row.date ? row.date.toISOString().split('T')[0] : '',
        description: row.description,
        category: row.category || 'Không xác định', // Phòng trường hợp danh mục bị xóa
        amount: parseFloat(row.amount),
        createdAt: row.createdAt ? new Date(row.createdAt).toLocaleString() : ''
      });
    });

    sheet.eachRow({ includeEmpty: false }, row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="expenses-${req.user.username || 'report'}.xlsx"`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error exporting expenses:', error);
    res.status(500).json({ error: 'Failed to export expenses', details: error.message });
  }
});

/**
 * 2. GET /api/expenses
 * Lấy toàn bộ danh sách chi tiêu (Kèm theo tên danh mục)
 */
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT t.*, c.name AS category_name 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? 
       ORDER BY t.date DESC`,
      [req.user.id]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all expenses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch expenses', 
      details: error.message 
    });
  }
});

/**
 * 3. GET /api/expenses/summary/:period
 * Thống kê báo cáo theo ngày, tuần, tháng, năm
 */
router.get('/summary/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const selectedDate = req.query.date || new Date().toISOString().split('T')[0];
    const connection = await pool.getConnection();
    let query;
    let params = [selectedDate];

    switch (period) {
      case 'day':
        query = `SELECT description as period, amount as total, 1 as count FROM transactions 
                 WHERE DATE(date) = DATE(?) AND user_id = ? ORDER BY date DESC`;
        params = [selectedDate, req.user.id];
        break;

      case 'week':
        query = `SELECT description as period, amount as total, 1 as count FROM transactions 
                 WHERE YEARWEEK(date, 1) = YEARWEEK(?, 1) AND user_id = ? ORDER BY date DESC`;
        params = [selectedDate, req.user.id];
        break;

      case 'month':
        query = `SELECT description as period, amount as total, 1 as count FROM transactions 
                 WHERE MONTH(date) = MONTH(?) AND YEAR(date) = YEAR(?) AND user_id = ? ORDER BY date DESC`;
        params = [selectedDate, selectedDate, req.user.id];
        break;

      case 'year':
        query = `
          SELECT 
            CONCAT('Tổng chi tiêu năm ', YEAR(?)) as period,
            SUM(amount) as total,
            COUNT(*) as count
          FROM transactions
          WHERE YEAR(date) = YEAR(?) AND user_id = ?
          GROUP BY YEAR(date)
        `;
        params = [selectedDate, selectedDate, req.user.id];
        break;

      default:
        connection.release();
        return res.status(400).json({ error: 'Invalid period' });
    }

    const [summary] = await connection.query(query, params);
    connection.release();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 4. GET /api/expenses/:id
 * Lấy chi tiết một khoản chi tiêu (Kèm theo tên danh mục)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [expenses] = await connection.query(
      `SELECT t.*, c.name AS category_name 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ? AND t.user_id = ?`,
      [id, req.user.id]
    );
    connection.release();
    
    if (expenses.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(expenses[0]);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to fetch expense', details: error.message });
  }
});

/**
 * 5. POST /api/expenses
 * Tạo mới một khoản chi tiêu (Nhận category_id số)
 */
router.post('/', async (req, res) => {
  try {
    const { amount, description, category_id, date } = req.body;
    
    if (!amount || !description || !category_id || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO transactions (amount, description, category_id, date, user_id) VALUES (?, ?, ?, ?, ?)',
      [amount, description, category_id, date, req.user.id]
    );
    connection.release();
    
    res.status(201).json({
      id: result.insertId,
      amount,
      description,
      category_id,
      date,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense', details: error.message });
  }
});

/**
 * 6. PUT /api/expenses/:id
 * Cập nhật thông tin chi tiêu (Nhận category_id số)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category_id, date } = req.body;

    if (amount === undefined || description === undefined || category_id === undefined || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof amount !== 'number' || Number.isNaN(amount)) {
      return res.status(400).json({ error: 'Amount must be a valid number' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE transactions SET amount = ?, description = ?, category_id = ?, date = ? WHERE id = ? AND user_id = ?',
      [amount, description, category_id, date, id, req.user.id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense updated successfully' });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense', details: error.message });
  }
});

/**
 * 7. DELETE /api/expenses/:id
 * Xóa một khoản chi tiêu
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense', details: error.message });
  }
});

module.exports = router;