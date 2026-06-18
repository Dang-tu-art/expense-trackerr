import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import AuthForm from './components/AuthForm';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [summary, setSummary] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [token, setToken] = useState(() => localStorage.getItem('expenseToken') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('expenseUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const API_BASE = process.env.REACT_APP_API_BASE || '/api';

  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const saved = localStorage.getItem('monthlyIncome');
    return saved ? Number(saved) : 0;
  });

  const [activePage, setActivePage] = useState('home');
  const navItems = [
    { id: 'home', icon: '🏠', label: 'TRANG CHỦ' },
    { id: 'calendar', icon: '🧾', label: 'DANH SÁCH CHI TIÊU' },
    { id: 'input', icon: '✏️', label: 'NHẬP VÀO' },
    { id: 'stats', icon: '📈', label: 'THỐNG KÊ' }
  ];

  const formatCurrency = (amount, signDisplay = 'auto') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      signDisplay
    }).format(amount);
  };

  const totalExpense = expenses.reduce((sum, item) => {
    const value = Number(item.amount) || 0;
    return sum + (value < 0 ? Math.abs(value) : 0);
  }, 0);

  const totalIncome = monthlyIncome;
  const balance = totalIncome - totalExpense;

  const categoryIcons = {
    'Ăn uống': '🍜',
    'Tiền phòng': '🏠',
    'Mua sắm': '🛍️',
    'Đi lại': '🚗',
    'Bạn bè': '👥',
    'Giao thông': '🚕',
    'Tiện ích': '💡',
    'Giải trí': '🎮',
    'Quà tặng': '🎁',
    'Nhà ở': '🏡',
    'Học tập': '📚',
    'Sức khỏe': '❤️',
    'Khác': '💼'
  };

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  // Global axios response interceptor: handle 401 -> force logout and show message
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401) {
          console.warn('[AXIOS] Received 401 response, clearing token and forcing logout');
          localStorage.removeItem('expenseToken');
          localStorage.removeItem('expenseUser');
          setToken(null);
          setUser(null);
          setError('Phiên đã hết hạn hoặc token không hợp lệ. Vui lòng đăng nhập lại.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(id);
    };
  }, []);

  // Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE}/expenses`);
      setExpenses(response.data);
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error || err.response?.data || err.message;
      setError(`Không thể tải danh sách chi tiêu: ${status || ''} ${serverMsg}`);
      console.error('Error fetching expenses:', err.response || err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Fetch summary
  const fetchSummary = useCallback(async (period) => {
    try {
      const response = await axios.get(
        `${API_BASE}/expenses/summary/${period}?date=${selectedDate}`
      );
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, [API_BASE, selectedDate]);

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token, fetchExpenses]);

  useEffect(() => {
    if (token) {
      fetchSummary(selectedPeriod);
    }
  }, [selectedPeriod, token, fetchSummary]);

  const handleAuthSuccess = (authToken, authUser) => {
    localStorage.setItem('expenseToken', authToken);
    localStorage.setItem('expenseUser', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('expenseToken');
    localStorage.removeItem('expenseUser');
    setToken(null);
    setUser(null);
    setExpenses([]);
    setSummary([]);
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await axios.post(`${API_BASE}/expenses`, expenseData);

      // Reload lại toàn bộ data
      await fetchExpenses();
      await fetchSummary(selectedPeriod);

      setError(null);
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error || err.response?.data || err.message;
      setError(`Không thể thêm chi tiêu: ${status || ''} ${serverMsg}`);
      console.error('Error adding expense:', err.response || err);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API_BASE}/expenses/${id}`);

      await fetchExpenses();
      await fetchSummary(selectedPeriod);

      setError(null);
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error || err.response?.data || err.message;
      setError(`Không thể xóa chi tiêu: ${status || ''} ${serverMsg}`);
      console.error('Error deleting expense:', err.response || err);
    }
  };

  const handleExportExpenses = async () => {
    try {
      const response = await axios.get(`${API_BASE}/expenses/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error || err.response?.data || err.message;
      setError(`Không thể xuất file Excel: ${status || ''} ${serverMsg}`);
      console.error('Error exporting expenses:', err.response || err);
    }
  };

  // Update expense
  const handleUpdateExpense = async (id, expenseData) => {
    try {
      await axios.put(`${API_BASE}/expenses/${id}`, expenseData);

      await fetchExpenses();
      await fetchSummary(selectedPeriod);

      setError(null);
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error || err.response?.data || err.message;
      setError(`Không thể cập nhật chi tiêu: ${status || ''} ${serverMsg}`);
      console.error('Error updating expense:', err.response || err);
    }
  };

  const renderHomeContent = () => (
    <div className="home-view">
      <div className="home-summary-cards">
        <div className="home-card">
          <div className="home-card-label">TỔNG THU</div>
          <div className="home-card-value">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="home-card">
          <div className="home-card-label">TỔNG CHI</div>
          <div className="home-card-value">{formatCurrency(totalExpense)}</div>
        </div>
        <div className="home-card">
          <div className="home-card-label">CÒN LẠI</div>
          <div className="home-card-value">{formatCurrency(balance)}</div>
        </div>
        {balance < 0 && (
          <div className="alert-message">
            Cảnh báo: chi tiêu đã vượt tổng thu {formatCurrency(Math.abs(balance))}.
          </div>
        )}
      </div>

      <div className="review-card home-review">
        <div className="review-header">DANH SÁCH CHI TIÊU</div>
        <div className="review-content">
          {recentExpenses.length > 0 ? (
            recentExpenses.map((item) => (
              <div key={item.id} className="review-item">
                {/* Đã sửa: Đổi item.category thành item.category_name */}
                <div className="review-icon">{categoryIcons[item.category_name] || '💼'}</div>
                <div className="review-info">
                  {/* Đã sửa: Đổi item.category thành item.category_name */}
                  <div className="review-title">{item.description || item.category_name}</div>
                  <div className="review-value">{formatCurrency(Number(item.amount), 'exceptZero')}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">Chưa có chi tiêu để hiển thị.</div>
          )}
        </div>
      </div>
    </div>
  );

  const handleMonthlyIncomeChange = (e) => {
    const value = Number(e.target.value) || 0;
    setMonthlyIncome(value);
    localStorage.setItem('monthlyIncome', value.toString());
  };

  const renderInputContent = () => (
    <div className="input-view">
      <div className="input-top">
        <div className="wallet-box">
          <div className="wallet-label">Thu nhập tháng</div>
          <input
            type="number"
            className="wallet-input"
            value={monthlyIncome}
            onChange={handleMonthlyIncomeChange}
            placeholder="Nhập số tiền"
            min="0"
          />
        </div>
      </div>
      <div className="input-panel">
        <ExpenseForm onAddExpense={handleAddExpense} />
      </div>
    </div>
  );

  const renderCalendarContent = () => (
    <div className="calendar-view">
      <div className="list-section">
        <div className="list-actions">
          <h2>DANH SÁCH CHI TIÊU</h2>
          <button className="export-btn" onClick={handleExportExpenses}>Xuất Excel</button>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onUpdate={handleUpdateExpense}
          />
        )}
      </div>
    </div>
  );

  const renderStatsContent = () => (
    <div className="stats-view">
      <div className="summary-section stats-only">
        <Summary
          data={summary}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  );

  const renderPageContent = () => {
    switch (activePage) {
      case 'input':
        return renderInputContent();
      case 'calendar':
        return renderCalendarContent();
      case 'stats':
        return renderStatsContent();
      default:
        return renderHomeContent();
    }
  };

  if (!token) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="App">
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="brand">
              <div className="brand-icon">💰</div>
              <div className="brand-text">
                <div className="brand-name">Quản lý Chi Tiêu</div>
                <div className="brand-subtitle">Expense Tracker</div>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            {user && <div className="user-greeting">Xin chào, {user.username}</div>}
            <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </aside>

        <main className="page-content">
          {error && <div className="error-message">{error}</div>}
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
}

export default App;