import React, { useState } from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setEditData({
      ...expense,
      date: expense.date ? expense.date.split('T')[0] : '',
      amount: typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount)
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSaveEdit = (id) => {
    onUpdate(id, editData);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!expenses || expenses.length === 0) {
    return <div className="empty-state">Chưa có chi tiêu nào. Hãy thêm chi tiêu mới!</div>;
  }

  return (
    <div className="expense-list">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Mô tả</th>
            <th>Danh mục</th>
            <th>Số tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id} className="expense-row">
              {editingId === expense.id ? (
                <>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="category"
                      value={editData.category}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td className="action-buttons">
                    <button
                      className="save-btn"
                      onClick={() => handleSaveEdit(expense.id)}
                    >
                      💾 Lưu
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={handleCancel}
                    >
                      ❌ Hủy
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="date-cell">{formatDate(expense.date)}</td>
                  <td className="description-cell">{expense.description}</td>
                  <td className="category-cell">{expense.category}</td>
                  <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(expense)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (window.confirm('Bạn chắc chắn muốn xóa?')) {
                          onDelete(expense.id);
                        }
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
