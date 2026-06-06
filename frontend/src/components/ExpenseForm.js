import React, { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Đi lại',
    customCategory: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Đi lại',
    'Ăn uống',
    'Bạn bè',
    'Mua sắm',
    'Tiền phòng',
    'Khác'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const category = formData.category === 'Khác' ? formData.customCategory.trim() : formData.category;

    if (!formData.amount || !formData.description || !category) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const amountValue = -Math.abs(parseFloat(formData.amount));

    onAddExpense({
      amount: amountValue,
      description: formData.description,
      category,
      date: formData.date
    });

    setFormData({
      amount: '',
      description: '',
      category: 'Đi lại',
      customCategory: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="expense-form-header">
        <h2>Nhập Chi Tiêu</h2>
      </div>

      <div className="input-row">
        <div className="input-column">
          <div className="fieldset-card">
            <div className="fieldset-title">Danh Mục</div>
            {categories.map((cat) => (
              <label key={cat} className="radio-item">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={formData.category === cat}
                  onChange={handleChange}
                />
                {cat}
              </label>
            ))}
            {formData.category === 'Khác' && (
              <input
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Ghi rõ danh mục"
                className="custom-category"
              />
            )}
          </div>
        </div>

        <div className="input-column">
          <div className="form-group">
            <label htmlFor="amount">Số Tiền</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Nhập số tiền"
              step="1000"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Thời Gian</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Ghi Chú</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập ghi chú"
              required
            />
          </div>
        </div>
      </div>

      <button type="submit" className="submit-btn">OK</button>
    </form>
  );
}

export default ExpenseForm;
