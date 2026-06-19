# Incident & Bug Tracking - QA/SRE Engineer

## INCIDENT LOG

### Incident #1: Database Connection Timeout in Production

**Status**: RESOLVED  
**Severity**: HIGH  
**Date Reported**: 2026-05-12  
**Date Resolved**: 2026-05-12

#### Phenomenon (Hiện tượng)
- API server starts but returns 503 Service Unavailable
- Health check endpoint fails with "database connection timeout"
- Frontend shows "Service unavailable" error
- Affects all API endpoints that require database access

```
Error: connect ECONNREFUSED 127.0.0.1:3306
Health Check Response: {
  "status": "ERROR",
  "message": "Service unavailable",
  "error": "connect ECONNREFUSED"
}
```

#### Root Cause (Nguyên nhân gốc)
1. MySQL server not running or not accessible on configured DB_HOST
2. Connection pool exhaustion due to improper connection release
3. .env.production file not configured with correct DB credentials
4. Firewall/network blocking connection to database server

#### Solution & Fix (Cách khắc phục)
1. **Verify MySQL is running**:
   ```bash
   mysql -h 127.0.0.1 -u root -p -e "SELECT 1"
   ```

2. **Check .env.production configuration**:
   ```env
   DB_HOST=127.0.0.1  # or correct IP/hostname
   DB_USER=root
   DB_PASSWORD=your_secure_password
   DB_DATABASE=expense_tracker
   ```

3. **Verify database exists**:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

4. **Restart API server**:
   ```bash
   NODE_ENV=production npm start
   ```

5. **Test health endpoint**:
   ```bash
   curl http://localhost:5000/api/health
   ```

#### Prevention
- Add database connection validation in startup script
- Implement connection pool monitoring
- Add automatic retry logic in db.js
- Document required environment variables clearly

---

### Incident #2: Frontend Hardcoded API URL Not Working in Production

**Status**: RESOLVED  
**Severity**: MEDIUM  
**Date Reported**: 2026-05-12  
**Date Resolved**: 2026-05-12

#### Phenomenon (Hiện tượng)
- Frontend loads successfully but cannot fetch expenses
- Browser console shows CORS/Network error
- Error message: "Not able to load expense list: Error: Network Error"
- All API calls fail with 404 or connection refused

```javascript
// Error in browser console:
GET http://localhost:5000/api/expenses 404 (Not Found)
```

#### Root Cause (Nguyên nhân gốc)
1. Frontend hardcoded API URL as `http://localhost:5000/api`
2. In production, API runs on different domain/port
3. CORS policy blocks cross-origin requests
4. Missing or incorrect .env.production configuration
5. Frontend build doesn't use environment variables

#### Solution & Fix (Cách khắc phục)
1. **Update App.js to use environment variable**:
   ```javascript
   const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   ```

2. **Create .env.production**:
   ```env
   REACT_APP_API_URL=https://api.yourdomain.com/api
   REACT_APP_ENV=production
   ```

3. **Rebuild frontend**:
   ```bash
   cd frontend
   npm run build
   ```

4. **Verify build contains correct URL**:
   ```bash
   grep -r "api.yourdomain.com" frontend/build/
   ```

#### Prevention
- Never hardcode URLs in source code
- Use environment variables for all configuration
- Add build-time validation to ensure env vars are set
- Use .env template file to document required variables

---

### Incident #3: Missing Environment Variables Cause Application to Fail

**Status**: RESOLVED  
**Severity**: HIGH  
**Date Reported**: 2026-05-12  
**Date Resolved**: 2026-05-12

#### Phenomenon (Hiện tượng)
- Application crashes on startup
- Error: "DB_HOST is undefined" or "REACT_APP_API_URL is undefined"
- No clear error message about which environment variables are missing
- Debugging requires checking error logs or source code

```bash
# Error output:
TypeError: Cannot read property 'host' of undefined
  at Object.<anonymous> (config.js:5:15)
```

#### Root Cause (Nguyên nhân gốc)
1. .env or .env.production file not created
2. Environment variables not exported in terminal/process
3. Wrong environment variable names (VITE_* vs REACT_APP_*)
4. No validation of required environment variables on startup
5. Incomplete documentation about setup requirements

#### Solution & Fix (Cách khắc phục)
1. **Create .env.production template**:
   ```env
   # Database Configuration (REQUIRED)
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_DATABASE=expense_tracker
   
   # API Configuration (REQUIRED)
   API_PORT=5000
   NODE_ENV=production
   ```

2. **Add environment validation to config.js**:
   ```javascript
   const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD'];
   requiredEnvVars.forEach(envVar => {
     if (!process.env[envVar]) {
       throw new Error(`Missing required environment variable: ${envVar}`);
     }
   });
   ```

3. **Create setup checklist**:
   ```bash
   echo "Required before deployment:"
   echo "□ Backend/.env.production configured"
   echo "□ Frontend/.env.production configured"
   echo "□ MySQL running and accessible"
   echo "□ Database schema created"
   ```

4. **Document in README**:
   - Add environment variables required
   - Add example .env files
   - Add setup validation script

#### Prevention
- Add startup validation script
- Clear error messages with actionable steps
- Use .env.example files
- Add validation tests in local test runs

---

## TESTING CHECKLIST

### Pre-Deployment Tests
- [ ] Health check endpoint responds with status: OK
- [ ] Database connection is working
- [ ] All environment variables are set
- [ ] No console errors in frontend
- [ ] API endpoints return correct response codes
- [ ] CORS is properly configured
- [ ] Error handling works (test with invalid requests)

### Post-Deployment Validation
- [ ] Verify API is accessible from production domain
- [ ] Verify frontend can reach backend API
- [ ] Test creating/reading/updating/deleting expenses
- [ ] Test summary endpoints (day/week/month/year)
- [ ] Check logs for any errors
- [ ] Monitor database connections
- [ ] Test from multiple browsers

### Security Checks
- [ ] Database credentials not in source code
- [ ] HTTPS is enabled on production
- [ ] CORS origins are whitelisted
- [ ] No sensitive data in error messages
- [ ] Authentication/Authorization implemented (if needed)

---

## METRICS & MONITORING

### Key Metrics to Monitor
- API Response Time: < 500ms
- Error Rate: < 0.1%
- Database Connection Pool: < 80% utilization
- Server Uptime: > 99.9%
- Frontend Build Size: < 2MB

### Alerting Thresholds
- Health check fails → Immediate alert
- Error rate > 5% → Alert within 1 minute
- Response time > 2s → Alert
- Database connection pool exhausted → Critical alert

---

## RUNBOOK - Troubleshooting Guide

### Problem: "Cannot connect to database"
1. Check if MySQL is running: `mysql -u root -p -e "SELECT 1"`
2. Verify credentials in .env.production
3. Check firewall/network access
4. Verify database exists: `SHOW DATABASES;`

### Problem: "CORS error"
1. Check frontend API URL in .env.production
2. Verify backend CORS configuration
3. Check if API is running on correct port
4. Test with curl: `curl -H "Origin: frontend-domain" http://api-domain/api/health`

### Problem: "Frontend shows white screen"
1. Check browser console for JavaScript errors
2. Verify frontend build was successful
3. Check if API URL is correct
4. Test API directly with Postman/curl

---

## ROLL-BACK PROCEDURE

If production deployment fails:
1. Revert to previous version: `git revert <commit-hash>`
2. Rebuild application: `npm run build`
3. Restart services: `npm start`
4. Verify health check: `curl http://localhost:5000/api/health`
5. Notify stakeholders of incident
6. Post-mortem analysis and prevention steps

---

## SIGN-OFF

- QA Lead: _____________________  Date: ________
- DevOps Lead: _____________________  Date: ________
- Product Manager: _____________________  Date: ________
