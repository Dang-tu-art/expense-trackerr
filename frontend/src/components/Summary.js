import React from 'react';
import './Summary.css';

function Summary({
  data,
  selectedPeriod,
  onPeriodChange,
  selectedDate,
  onDateChange
}) {
  // 1. Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // 2. Tính tổng tiền
  const totalAmount = data.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );
  
  // 3. Tính tổng số lượng (Dùng parseInt để tránh lỗi NaN nếu count là chuỗi)
  const totalCount = data.reduce((sum, item) => {
    const val = parseInt(item.count);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  // 4. HÀM CỦA BẠN ĐẶT Ở ĐÂY:
  const getListTitle = () => {
    switch (selectedPeriod) {
      case 'day': return 'DANH SÁCH CHI TIÊU TRONG NGÀY';
      case 'week': return 'DANH SÁCH CHI TIÊU TRONG TUẦN';
      case 'month': return 'DANH SÁCH CHI TIÊU TRONG THÁNG';
      case 'year': return 'THỐNG KÊ CHI TIÊU THEO THÁNG TRONG NĂM';
      default: return 'CHI TIẾT';
    }
  };

  return (
    <div className="summary">
      <h2>📈 Thống Kê</h2>
      
      <div className="period-selector">
        <div className="date-picker">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div className="btn-group">
            <button
              className={`period-btn ${selectedPeriod === 'day' ? 'active' : ''}`}
              onClick={() => onPeriodChange('day')}
            >Ngày</button>
            <button
              className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
              onClick={() => onPeriodChange('week')}
            >Tuần</button>
            <button
              className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => onPeriodChange('month')}
            >Tháng</button>
            <button
              className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
              onClick={() => onPeriodChange('year')}
            >Năm</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Tổng Chi Tiêu</div>
          <div className="card-value">{formatCurrency(totalAmount)}</div>
        </div>

        <div className="summary-card">
          <div className="card-label">
            {selectedPeriod === 'day' ? 'Số món đã mua' : 'Số lượt giao dịch'}
          </div>
          <div className="card-value">{totalCount}</div>
        </div>
      </div>

      {data && data.length > 0 ? (
        <div className="summary-list">
          {/* SỬ DỤNG HÀM TIÊU ĐỀ Ở ĐÂY */}
          <h3>{getListTitle()}</h3>
          <ul>
            {data.map((item, index) => (
              <li key={index} className="summary-item">
                <span className="period-name">{item.period}</span>
                <span className="period-total">{formatCurrency(Number(item.total))}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="no-data">Không có dữ liệu cho thời gian này.</div>
      )}
    </div>
  );
}

export default Summary;