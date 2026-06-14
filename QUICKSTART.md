# Setup Quick Guide

## Minimum Steps to Run

### Step 1: Setup Database (one-time)
```bash
# Open MySQL Workbench or command line
mysql -u root -p

# Paste and run schema.sql content
source d:/expense-tracker/database/schema.sql
# or copy-paste SQL from schema.sql file
```

### Step 2: Backend (Terminal 1)
```bash
cd d:\expense-tracker\backend
npm install
npm start
# Should show: Server is running on http://localhost:5000
```

### Step 3: Frontend (Terminal 2)
```bash
cd d:\expense-tracker\frontend
npm install
npm start
# Opens browser at http://localhost:3000 automatically
```

## Verify It's Working

1. **Backend Health**: Visit http://localhost:5000/api/health
2. **Frontend**: Visit http://localhost:3000
3. **Database**: Check MySQL Workbench → expense_tracker → transactions table

## Next Steps

- Add expenses via form
- View list updates in real-time
- Edit/delete items
- Check summary by period
- Verify data in MySQL Workbench

## Common Issues

| Issue | Fix |
|-------|-----|
| "Cannot connect to MySQL" | Make sure MySQL service is running |
| "Database not found" | Run schema.sql to create database |
| "Port 5000 already in use" | Change API_PORT in .env file |
| "Port 3000 already in use" | Use: npm start -- --port 3001 |

---

**Time to setup**: ~5 minutes  
**Dependencies needed**: Node.js, npm, MySQL
