import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const API_BASE = process.env.REACT_APP_API_BASE || '/api';

function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      setMessage('Mật khẩu và xác nhận mật khẩu phải giống nhau');
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      username: formData.username
    };

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}${endpoint}`, payload);

      if (mode === 'register') {
        setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setMode('login');
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
        return;
      }

      const { token, user } = response.data;
      onAuthSuccess(token, user);
    } catch (error) {
      const errorText = error.response?.data?.error || error.message;
      setMessage(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h2>

        <div className="toggle-buttons">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >Đăng nhập</button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >Đăng ký</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          )}

          {message && <div className="auth-error">{message}</div>}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
