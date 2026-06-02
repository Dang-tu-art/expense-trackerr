-- CHỈ ĐỊNH: Dùng đúng tên database đang chạy trên hệ thống đám mây Railway
USE railway;

-- 1. Tạo bảng users nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tạo bảng transactions (Đã sửa kiểu dữ liệu cột date thành VARCHAR để trị dứt điểm lỗi Log Render)
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date VARCHAR(100) NOT NULL, -- Thay đổi từ DATE sang VARCHAR để nhận định dạng ISO từ React gửi lên mà không báo lỗi 1292
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tạo các chỉ mục (Index) tăng tốc truy vấn hệ thống
CREATE INDEX idx_date ON transactions(date);
CREATE INDEX idx_user_id ON transactions(user_id);

-- 4. Chèn tài khoản demo (mật khẩu mặc định bảo mật bằng Bcrypt)
INSERT INTO users (username, email, password) 
VALUES ('demo', 'demo@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36ZXZzFu')
ON DUPLICATE KEY UPDATE id=id;

-- 5. Chèn dữ liệu kiểm thử gán vào tài khoản User ID số 1
INSERT INTO transactions (user_id, amount, description, category, date) VALUES
(1, 50000, 'Ăn trưa tại nhà hàng', 'Ăn uống', '2026-05-11'),
(1, 25000, 'Mua xăng xe máy', 'Giao thông', '2026-05-10'),
(1, 100000, 'Thanh toán tiền điện', 'Tiện ích', '2026-05-09'),
(1, 150000, 'Mua quần áo', 'Mua sắm', '2026-05-08'),
(1, 30000, 'Xem phim', 'Giải trí', '2026-05-07'),
(1, 75000, 'Sinh nhật bạn - quà tặng', 'Quà tặng', '2026-05-06'),
(1, 200000, 'Thuê phòng trọ', 'Nhà ở', '2026-05-01'),
(1, 45000, 'Mua sách', 'Học tập', '2026-04-30'),
(1, 80000, 'Ăn tối cùng gia đình', 'Ăn uống', '2026-04-29'),
(1, 120000, 'Khám bác sĩ', 'Sức khỏe', '2026-04-28');