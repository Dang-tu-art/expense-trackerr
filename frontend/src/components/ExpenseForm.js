import React, { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ onAddExpense }) {
  // 1. Khởi tạo danh sách danh mục kèm ID tương ứng trong Database của bạn
  // Lưu ý: Hãy đảm bảo các ID này trùng khớp với dữ liệu trong bảng `categories` ở MySQL
  const categories = [
    { id: 1, name: 'Đi lại' },
    { id: 2, name: 'Ăn uống' },
    { id: 3, name: 'Bạn bè' },
    { id: 4, name: 'Mua sắm' },
    { id: 5, name: 'Tiền phòng' },
    { id: 6, name: 'Khác' }
  ];

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: 1, // Mặc định chọn ID của 'Đi lại'
    customCategory: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Nếu là chọn category_id thì chuyển sang kiểu số (Number)
      [name]: name === 'category_id' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // 1. Kiểm tra tính hợp lệ dữ liệu đầu vào
  if (!formData.amount || !formData.description || !formData.category_id) {
    alert('Vui lòng điền đầy đủ thông tin');
    return;
  }

  // 2. Xử lý phần danh mục tự nhập (Khác) nếu có
  let finalDescription = formData.description;
  if (Number(formData.category_id) === 6 && formData.customCategory.trim()) {
    finalDescription = `${formData.description} [Danh mục: ${formData.customCategory.trim()}]`;
  }

  // 3. Quy đổi số tiền sang dạng số âm (-) theo đúng logic hệ thống của bạn
  const amountValue = -Math.abs(parseFloat(formData.amount));

  // 4. CHỖ CẦN SỬA: Gửi chính xác key 'category_id' viết bằng kiểu số nguyên (Integer)
  onAddExpense({
    amount: amountValue,
    description: finalDescription,
    category_id: Number(formData.category_id), // Gửi đúng trường Backend đang bóc tách bằng req.body
    date: formData.date
  });

  // 5. Làm sạch form sau khi thêm thành công
  setFormData({
    amount: '',
    description: '',
    category_id: 1,
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
              <label key={cat.id} className="radio-item">
                <input
                  type="radio"
                  name="category_id"
                  value={cat.id}
                  checked={formData.category_id === cat.id}
                  onChange={handleChange}
                />
                {cat.name}
              </label>
            ))}
            
            {/* Nếu chọn danh mục "Khác" (ID = 6) thì hiện ô nhập text */}
            {formData.category_id === 6 && (
              <input
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Ghi rõ danh mục tự chọn"
                className="custom-category"
                required
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