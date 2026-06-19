const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const config = require('../config');

const router = express.Router();

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email }, 
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền tên, email và mật khẩu' });
    }

    const connection = await pool.getConnection();
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ error: 'Email hoặc tên đăng nhập đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    connection.release();

    const user = {
      id: result.insertId,
      username,
      email
    };

    res.status(201).json({
      message: 'Đăng ký thành công',
      token: generateToken(user),
      user
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Đăng ký thất bại', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền email và mật khẩu' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, username, email, password FROM users WHERE email = ?',
      [email]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    res.json({
      message: 'Đăng nhập thành công',
      token: generateToken(user),
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Đăng nhập thất bại', details: error.message });
  }
});

// (profile endpoint removed per user request)

module.exports = router;
