import React, { useState } from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Khai báo danh sách danh mục đồng bộ với Database và Form thêm mới
  const categories = [
    { id: 1, name: 'Đi lại' },
    { id: 2, name: 'Ăn uống' },
    { id: 3, name: 'Bạn bè' },
    { id: 4, name: 'Mua sắm' },
    { id: 5, name: 'Tiền phòng' },
    { id: 6, name: 'Khác' }
  ];

  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setEditData({
      ...expense,
      date: expense.date ? expense.date.split('T')[0] : '',
      amount: typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount),
      // Lưu lại category_id hiện tại khi nhấn sửa, mặc định là 1 nếu chưa có
      category_id: expense.category_id || 1 
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      // Ép kiểu số cho amount và category_id
      [name]: name === 'amount' 
        ? (value === '' ? '' : parseFloat(value)) 
        : name === 'category_id' 
          ? Number(value) 
          : value
    }));
  };

  const handleSaveEdit = (id) => {
    if (!editData.amount || !editData.description || !editData.category_id) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Đảm bảo số tiền lưu xuống luôn là số âm theo đúng logic tính toán của App.js
    const finalAmount = editData.amount < 0 ? editData.amount : -Math.abs(editData.amount);

    // Chỉ gửi các trường database yêu cầu
    onUpdate(id, {
      amount: finalAmount,
      description: editData.description,
      category_id: editData.category_id,
      date: editData.date
    });
    
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const formatCurrency = (amount) => {
    // Biến đổi số âm thành số dương để hiển thị trên bảng cho đẹp mắt
    const displayAmount = Math.abs(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(displayAmount);
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
                    {/* Đã sửa: Chuyển đổi Input Text thành Select Dropdown */}
                    <select
                      name="category_id"
                      value={editData.category_id}
                      onChange={handleEditChange}
                      className="edit-category-select"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      value={Math.abs(editData.amount)} // Hiển thị số dương cho người dùng dễ sửa
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
                  {/* Đã sửa: Hiển thị tên danh mục thông qua trường category_name từ câu lệnh JOIN */}
                  <td className="category-cell">{expense.category_name || 'Không xác định'}</td>
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