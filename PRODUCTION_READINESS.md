# Production Readiness Checklist - Expense Tracker

## ✅ Hoàn Thành

### 1️⃣ Backend Engineer - API & Database

#### ✓ Health Check Endpoint
- Endpoint: `GET /api/health`
- Checks: API status + Database connection
- Response: Status code 200 (OK) or 503 (Service Unavailable)

**Test**:
```bash
curl http://localhost:5000/api/health
```

#### ✓ Comprehensive Logging
- Request logging with timestamp, method, path, status, duration
- Error logging with stack traces
- Database query logging
- File: `backend/server.js` (middleware implementation)

#### ✓ Error Handling
- Centralized error handler middleware
- 404 handler for invalid routes
- Database error handling with descriptive messages
- All API responses standardized with status and error fields

#### ✓ Environment Configuration
- File: `backend/config.js` - Reads from .env.production
- File: `backend/.env.production` - Production environment variables
- Database connection pooling configured

---

### 2️⃣ Frontend Engineer - Environment & Configuration

#### ✓ Environment Variables (Biến Môi Trường)
- File: `frontend/.env.local` - Development (REACT_APP_API_URL=http://localhost:5000/api)
- File: `frontend/.env.production` - Production (REACT_APP_API_URL=https://api.yourdomain.com/api)

#### ✓ Dynamic API URL
- No hardcoded URLs in source code
- App.js uses: `process.env.REACT_APP_API_URL || 'http://localhost:5000/api'`
- Fallback ensures app works in development

#### ✓ Frontend Build
- Build command: `npm run build`
- Output directory: `frontend/build/`
- Optimized for production

#### ✓ No Console Errors
- Uses axios for HTTP requests
- Proper error handling in try-catch blocks
- Error messages displayed to users

---

### 3️⃣ DevOps Engineer - Deployment Validation

This repository no longer includes an automated CI/CD pipeline.

- Deployment is performed manually or via external tooling outside this repo.
- Make sure to run linting, tests, and build commands locally before deployment.

Example commands:
- `cd backend && npm install && npm test`
- `cd frontend && npm install && npm run build`

---

### 4️⃣ Infrastructure Engineer - Deployment

#### ✓ Deployment Scripts

**Linux/Mac** - `deploy.sh`:
```bash
chmod +x deploy.sh
./deploy.sh production
```

**Windows** - `deploy.ps1`:
```powershell
.\deploy.ps1 -Environment production
```

#### ✓ Deployment Steps
1. Checks prerequisites (Node.js, npm)
2. Installs backend dependencies
3. Installs frontend dependencies
4. Builds frontend
5. Validates setup and provides next steps

#### ✓ Server Requirements
- Node.js 14+ LTS (minimum)
- MySQL 5.7+ or MySQL 8.0
- Disk space: ~500MB
- Memory: ~512MB minimum

#### ✓ Post-Deployment

**Start Backend**:
```bash
cd backend
NODE_ENV=production npm start
```

**Serve Frontend**:
```bash
npm install -g serve
cd frontend/build
serve -s . -l 3000
```

Or configure Nginx/Apache to serve `frontend/build` directory.

---

### 5️⃣ QA/SRE Engineer - Testing & Incidents

#### ✓ Integration Tests
- File: `test-integration.sh`
- Tests: Health check, CRUD, Summary endpoints, Error handling
- Run: `bash test-integration.sh http://localhost:5000/api`

#### ✓ Postman Collection
- File: `Expense-Tracker-API.postman_collection.json`
- Endpoints: Health, CRUD, Summary, Reports
- Variable: `api_url` (default: http://localhost:5000/api)
- Import into Postman and run collection

#### ✓ Incidents Documented
- **Incident #1**: Database Connection Timeout
  - Cause: MySQL not running or wrong credentials
  - Fix: Verify MySQL, check .env.production, restart server
  
- **Incident #2**: Frontend API URL Issue
  - Cause: Hardcoded localhost URL
  - Fix: Use environment variables, rebuild frontend
  
- **Incident #3**: Missing Environment Variables
  - Cause: .env files not created
  - Fix: Create .env files with required variables, add validation

See: `INCIDENTS.md` for full details.

#### ✓ Monitoring Checklist
- [ ] API responds within 500ms
- [ ] Error rate < 0.1%
- [ ] Database connections < 80% utilization
- [ ] Server uptime > 99.9%
- [ ] No console errors in frontend

---

## 🚀 Quick Start Production Deployment

### Prerequisites
```bash
# Install Node.js 18+
node -v  # Should output v18.x or higher

# Verify npm
npm -v   # Should output 8.x or higher

# Install/verify MySQL
mysql -u root -p -e "SELECT 1"
```

### Step 1: Prepare Environment Files

**Backend** - `backend/.env.production`:
```env
DB_HOST=your_production_db_server
DB_USER=production_user
DB_PASSWORD=your_secure_password
DB_DATABASE=expense_tracker
API_PORT=5000
NODE_ENV=production
```

**Frontend** - `frontend/.env.production`:
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
```

### Step 2: Run Deployment Script

**Windows**:
```powershell
.\deploy.ps1 -Environment production
```

**Linux/Mac**:
```bash
chmod +x deploy.sh
./deploy.sh production
```

### Step 3: Setup Database

```bash
mysql -u root -p < database/schema.sql
```

### Step 4: Start Services

**Terminal 1 - Backend**:
```bash
cd backend
NODE_ENV=production npm start
# Output: Server is running on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
npm install -g serve
cd frontend/build
serve -s . -l 3000
# Output: Accepting connections at http://localhost:3000
```

### Step 5: Verify

```bash
# Check health
curl http://localhost:5000/api/health

# Open in browser
# http://localhost:3000  (or your production domain)
```

---

## 📋 Testing Before Going Live

### 1. API Tests (using Postman or curl)
```bash
# Health check
curl http://localhost:5000/api/health

# Create expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "description": "Test", "date": "2026-05-12"}'

# Get all expenses
curl http://localhost:5000/api/expenses

# Get summary
curl http://localhost:5000/api/expenses/summary/month?date=2026-05-12
```

### 2. Frontend Tests
- [ ] Open app in browser
- [ ] Check browser console (no errors)
- [ ] Create new expense
- [ ] View expense list
- [ ] Update existing expense
- [ ] Delete expense
- [ ] View daily/weekly/monthly/yearly summary
- [ ] Check error handling (test with API offline)

### 3. Load Testing (Optional)
```bash
# Install artillery for load testing
npm install -g artillery

# Run load test (100 requests/second for 30 seconds)
artillery quick --count 100 --num 30 http://localhost:5000/api/expenses
```

---

## 🔧 Troubleshooting

### "Cannot connect to database"
1. Verify MySQL is running: `mysql -u root -p -e "SELECT 1"`
2. Check credentials in .env.production
3. Verify database exists: `mysql -u root -p expense_tracker -e "SELECT 1"`
4. Check network connectivity to DB server

### "Frontend shows white screen"
1. Check browser console for errors (F12)
2. Verify frontend build: `ls -la frontend/build`
3. Check if API URL is correct in .env.production
4. Test API directly: `curl http://localhost:5000/api/health`

### "CORS Error"
1. Verify backend CORS is enabled
2. Check API_URL in .env.production matches frontend
3. Verify frontend domain is not blocked

See `INCIDENTS.md` for more troubleshooting.

---

## 📊 Performance Targets

| Metric | Target | Monitor Tool |
|--------|--------|--------------|
| API Response Time | < 500ms | curl, Postman |
| Error Rate | < 0.1% | Application logs |
| Database Connections | < 80% utilization | MySQL metrics |
| Frontend Build Size | < 2MB | `du -h frontend/build` |
| Server Uptime | > 99.9% | Health check script |

---

## 🔐 Security Considerations

- [ ] Database passwords not in source code ✓
- [ ] HTTPS enabled on production domain
- [ ] CORS configured for specific domains only
- [ ] No sensitive data in error messages ✓
- [ ] SQL injection prevented (using prepared statements) ✓
- [ ] Regular backups of database configured
- [ ] Access logs reviewed regularly

---

## 📞 Support & Escalation

### Critical Issues (Service Down)
1. Check health endpoint: `curl http://localhost:5000/api/health`
2. Review recent logs
3. Restart services: `npm start`
4. Rollback if necessary: `git revert <commit>`

### Medium Issues (Errors but service running)
1. Check application logs
2. Identify affected endpoints
3. Fix and redeploy
4. Notify users of incident

### Minor Issues (One user affected)
1. Collect error details
2. Reproduce issue
3. Fix in next release
4. Deploy to staging for testing first

---

## ✅ Signoff

**Backend Engineer**: _________________ Date: _______  
**Frontend Engineer**: _________________ Date: _______  
**DevOps Engineer**: _________________ Date: _______  
**Infrastructure Engineer**: _________________ Date: _______  
**QA/SRE Engineer**: _________________ Date: _______  
**Project Manager**: _________________ Date: _______  

---

## 📝 Change Log

### 2026-05-12 (Release 1.0.0)
- ✓ Initial production setup
- ✓ Environment variable configuration
- ✓ Deployment scripts
- ✓ Incident documentation
- ✓ Test integration suite
