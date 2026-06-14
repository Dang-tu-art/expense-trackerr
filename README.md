# Expense Tracker - Quản lý Chi Tiêu

A full-stack expense tracking application built with React, Node.js/Express, and MySQL.

## Features

✅ **Thêm khoản chi tiêu** - Add new expenses  
✅ **Xem danh sách chi tiêu** - View all expenses  
✅ **Sửa/Xóa chi tiêu** - Edit/Delete expenses  
✅ **Tính tổng chi tiêu theo thời gian** - Calculate total by time period (day, week, month, year)  
✅ **API Health Check** - GET /api/health endpoint  
✅ **Real Database** - MySQL with actual data persistence  

## Project Structure

```
expense-tracker/
├── backend/                # Node.js/Express API
│   ├── routes/            # API endpoints
│   ├── config.js          # Database config
│   ├── db.js              # Database connection
│   ├── server.js          # Main server file
│   └── package.json       # Dependencies
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── package.json      # Dependencies
└── database/              # SQL scripts
    └── schema.sql        # Database schema & sample data
```

## Requirements

- **Node.js** 14+ (for backend)
- **npm** or **yarn**
- **MySQL** 5.7+ (or MariaDB)

## Setup Instructions

### 1. Database Setup

1. Open MySQL Workbench or command line
2. Create database and tables by running:
```sql
source d:/expense-tracker/database/schema.sql
```

Or manually:
- Copy and paste the SQL from `database/schema.sql`
- Execute in MySQL Workbench

### 2. Backend Setup

```bash
# Navigate to backend folder
cd d:\expense-tracker\backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Update database credentials if needed
cp .env.example .env

# Edit .env file with your MySQL credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_DATABASE=expense_tracker
# API_PORT=5000

# Start the backend server
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
# Open new terminal/command prompt
# Navigate to frontend folder
cd d:\expense-tracker\frontend

# Install dependencies
npm install

# Start the React app
npm start
# Opens in browser at http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/:id` | Get single expense |
| GET | `/api/expenses/summary/:period` | Get summary (day/week/month/year) |
| POST | `/api/expenses` | Create new expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

## Testing with Postman/cURL

### Test API Health
```bash
curl http://localhost:5000/api/health
```

### Create Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "description": "Ăn trưa", "category": "Ăn uống", "date": "2026-05-11"}'
```

### Get All Expenses
```bash
curl http://localhost:5000/api/expenses
```

### Get Monthly Summary
```bash
curl http://localhost:5000/api/expenses/summary/month
```

## Features

### Frontend
- **Responsive Design** - Works on mobile, tablet, desktop
- **Real-time Updates** - See changes immediately
- **Edit & Delete** - Modify or remove expenses
- **Summary Charts** - View totals by period
- **Category Support** - 10+ predefined categories
- **Date Picker** - Easy date selection

### Backend
- **RESTful API** - Standard HTTP methods
- **Error Handling** - Comprehensive error messages
- **CORS Enabled** - Frontend can communicate freely
- **Connection Pooling** - Efficient database usage

### Database
- **Transactions Table** - Stores all expenses
- **Indexed Queries** - Fast lookups
- **Timestamps** - Automatic creation/update times
- **Sample Data** - 10 sample expenses included

## Troubleshooting

### Backend Issues
```
Error: connect ECONNREFUSED 127.0.0.1:3306
→ MySQL is not running. Start MySQL service.

Error: Access denied for user 'root'@'localhost'
→ Check .env file credentials. Update with correct MySQL password.

Error: Unknown database 'expense_tracker'
→ Run schema.sql to create database.
```

### Frontend Issues
```
Error: Could not find a proxy
→ Backend not running. Start backend with: npm start

Error: Cannot POST /api/expenses
→ Check CORS configuration. Verify backend port is 5000.
```

### Port Already in Use
```
# For backend (port 5000)
netstat -ano | findstr :5000    # Windows
lsof -i :5000                   # Mac/Linux

# For frontend (port 3000)
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Mac/Linux
```

## Database Connection (MySQL Workbench)

1. Open MySQL Workbench
2. Go to **Database** → **Manage Connections**
3. Create new connection:
   - **Hostname**: localhost
   - **Port**: 3306
   - **Username**: root
   - **Password**: (your MySQL password)
4. Connect and browse `expense_tracker` database
5. View `transactions` table with all expenses

## Performance Tips

- Database queries are indexed on `date` for fast lookups
- Connection pooling prevents connection exhaustion
- React components are optimized with hooks
- API responses are minimal and efficient

## Future Enhancements

- [ ] User authentication (login/signup)
- [ ] Budget tracking & alerts
- [ ] Export to Excel/PDF
- [ ] Charts & graphs
- [ ] Multiple accounts/profiles
- [ ] Mobile app
- [ ] Dark mode

## License

MIT

## Support

For issues or questions:
1. Check troubleshooting section
2. Verify MySQL is running
3. Check console logs (F12 in browser)
4. Review backend terminal output

---

**Version**: 1.0.0  
**Last Updated**: May 2026
