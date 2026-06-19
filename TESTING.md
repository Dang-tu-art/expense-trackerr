# Testing Guide - Expense Tracker

Complete guide to test all features of the Expense Tracker application.

---

## Prerequisites

Before testing, ensure:
- ✅ MySQL database is set up (run schema.sql)
- ✅ Backend is running (`npm start` in backend folder)
- ✅ Frontend is running (`npm start` in frontend folder)
- ✅ Ports: Backend=5000, Frontend=3000

---

## Testing Checklist

## 1. API Health Check ✅

### Test 1.1: GET /api/health

**Using Browser:**
1. Open: http://localhost:5000/api/health
2. Should see JSON response

**Using cURL:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-05-11T...",
  "service": "Expense Tracker API"
}
```

**Status**: ✅ PASS/❌ FAIL

---

## 2. Frontend Basic Functionality

### Test 2.1: Frontend Loads

1. Open: http://localhost:3000
2. Should see app with:
   - Header "💰 Quản lý Chi Tiêu"
   - Add form on left
   - Summary statistics on right
   - Expense list below

**Status**: ✅ PASS/❌ FAIL

---

## 3. Add Expense Tests

### Test 3.1: Add Single Expense

**Steps:**
1. Fill form:
   - Amount: 50000
   - Description: Test Lunch
   - Category: Ăn uống
   - Date: Today
2. Click "Thêm Chi Tiêu"
3. Check if:
   - Form clears
   - New item appears in list
   - Summary updates

**Expected**: New expense appears immediately

**Status**: ✅ PASS/❌ FAIL

### Test 3.2: Validation - Missing Fields

**Steps:**
1. Leave Amount empty
2. Click "Thêm Chi Tiêu"

**Expected**: Alert "Vui lòng điền đầy đủ thông tin"

**Status**: ✅ PASS/❌ FAIL

### Test 3.3: Add Multiple Expenses

**Steps:**
1. Add 3 different expenses with different categories
2. Verify all appear in list

**Expected**: List shows all 3 new expenses

**Status**: ✅ PASS/❌ FAIL

---

## 4. View Expense List Tests

### Test 4.1: View All Expenses

**Steps:**
1. Refresh page (F5)
2. Check expense list loads

**Expected**: All expenses display with correct data

**Status**: ✅ PASS/❌ FAIL

### Test 4.2: Data Persistence

**Steps:**
1. Add expense "Database Test"
2. Close browser
3. Clear cache and cookies
4. Reopen app
5. Check if expense still visible

**Expected**: Expense persists (from database)

**Status**: ✅ PASS/❌ FAIL

### Test 4.3: Sorting

**Steps:**
1. Check expenses are sorted by date (newest first)

**Expected**: Most recent date at top

**Status**: ✅ PASS/❌ FAIL

### Test 4.4: Currency Formatting

**Steps:**
1. Check all amounts show as "X,XXX VND"

**Expected**: Proper Vietnamese currency format

**Status**: ✅ PASS/❌ FAIL

---

## 5. Edit Expense Tests

### Test 5.1: Edit Single Expense

**Steps:**
1. Click "✏️ Sửa" on any expense
2. Change:
   - Amount to 60000
   - Description to "Edited Lunch"
3. Click "💾 Lưu"
4. Verify changes appear

**Expected**: Changes saved and displayed

**Status**: ✅ PASS/❌ FAIL

### Test 5.2: Cancel Edit

**Steps:**
1. Click "✏️ Sửa"
2. Change some values
3. Click "❌ Hủy"

**Expected**: Changes discarded, original value shows

**Status**: ✅ PASS/❌ FAIL

### Test 5.3: Edit Multiple Expenses

**Steps:**
1. Edit 2 different expenses
2. Verify both updates work

**Expected**: All edits persist

**Status**: ✅ PASS/❌ FAIL

---

## 6. Delete Expense Tests

### Test 6.1: Delete Single Expense

**Steps:**
1. Click "🗑️ Xóa" on any expense
2. Click "OK" in confirmation dialog
3. Check expense is removed

**Expected**: Expense disappears from list

**Status**: ✅ PASS/❌ FAIL

### Test 6.2: Cancel Delete

**Steps:**
1. Click "🗑️ Xóa"
2. Click "Cancel" in confirmation dialog

**Expected**: Expense remains in list

**Status**: ✅ PASS/❌ FAIL

### Test 6.3: Delete and Re-add

**Steps:**
1. Note expense ID
2. Delete it
3. Re-add with different amount
4. Check new expense is added (ID will be higher)

**Expected**: New ID assigned to re-added expense

**Status**: ✅ PASS/❌ FAIL

---

## 7. Summary/Statistics Tests

### Test 7.1: Monthly Summary

**Steps:**
1. Ensure expenses exist from different months
2. Click "Tháng" button in summary section
3. Check totals match actual expenses

**Expected**: Summary shows correct total for each month

**Status**: ✅ PASS/❌ FAIL

### Test 7.2: Daily Summary

**Steps:**
1. Add multiple expenses with today's date
2. Click "Ngày" button
3. Check total matches sum of today's expenses

**Expected**: Daily total is correct

**Status**: ✅ PASS/❌ FAIL

### Test 7.3: Weekly Summary

**Steps:**
1. Click "Tuần" button
2. Check total for current week

**Expected**: Week summary calculated correctly

**Status**: ✅ PASS/❌ FAIL

### Test 7.4: Yearly Summary

**Steps:**
1. Click "Năm" button
2. Check yearly totals

**Expected**: Year summary shows all expenses

**Status**: ✅ PASS/❌ FAIL

### Test 7.5: Summary Card Updates

**Steps:**
1. Note "Tổng Chi Tiêu" amount
2. Add new expense
3. Check summary updates without refresh

**Expected**: Summary updates in real-time

**Status**: ✅ PASS/❌ FAIL

---

## 8. Category Tests

### Test 8.1: All Categories Work

**Steps:**
1. Add expenses with each category:
   - Ăn uống
   - Giao thông
   - Tiện ích
   - Mua sắm
   - Giải trí
   - Quà tặng
   - Nhà ở
   - Học tập
   - Sức khỏe
   - Khác
2. Verify all display correctly

**Expected**: All categories selectable and display

**Status**: ✅ PASS/❌ FAIL

---

## 9. API Testing (cURL/Postman)

### Test 9.1: GET All Expenses

```bash
curl http://localhost:5000/api/expenses
```

**Expected**: Array of all expenses returned

**Status**: ✅ PASS/❌ FAIL

### Test 9.2: POST Create Expense

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 75000,
    "description": "API Test",
    "category": "Ăn uống",
    "date": "2026-05-11"
  }'
```

**Expected**: Returns created expense with ID

**Status**: ✅ PASS/❌ FAIL

### Test 9.3: GET Single Expense

```bash
curl http://localhost:5000/api/expenses/1
```

**Expected**: Returns single expense object

**Status**: ✅ PASS/❌ FAIL

### Test 9.4: PUT Update Expense

```bash
curl -X PUT http://localhost:5000/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 80000,
    "description": "Updated API Test",
    "category": "Giao thông",
    "date": "2026-05-11"
  }'
```

**Expected**: Returns success message

**Status**: ✅ PASS/❌ FAIL

### Test 9.5: DELETE Expense

```bash
curl -X DELETE http://localhost:5000/api/expenses/1
```

**Expected**: Returns success message

**Status**: ✅ PASS/❌ FAIL

### Test 9.6: GET Summary

```bash
curl http://localhost:5000/api/expenses/summary/month
```

**Expected**: Returns summary array with periods and totals

**Status**: ✅ PASS/❌ FAIL

---

## 10. Database Verification

### Test 10.1: Check Data in MySQL Workbench

**Steps:**
1. Open MySQL Workbench
2. Connect to localhost
3. Navigate to: expense_tracker → transactions
4. View all rows
5. Verify data matches frontend

**Expected**: All expenses visible in database

**Status**: ✅ PASS/❌ FAIL

### Test 10.2: Direct Database Query

```sql
SELECT * FROM transactions ORDER BY date DESC;
```

**Expected**: All expenses listed with correct data

**Status**: ✅ PASS/❌ FAIL

### Test 10.3: Database Update Propagates

**Steps:**
1. Update directly in MySQL:
```sql
UPDATE transactions SET amount = 99999 WHERE id = 1;
```
2. Refresh frontend
3. Check amount updated

**Expected**: Frontend shows updated value

**Status**: ✅ PASS/❌ FAIL

---

## 11. Error Handling Tests

### Test 11.1: Network Error Handling

**Steps:**
1. Stop backend server
2. Try to add expense
3. Check error message displays

**Expected**: "Không thể thêm chi tiêu" message shown

**Status**: ✅ PASS/❌ FAIL

### Test 11.2: Invalid Data Handling

**Steps:**
1. Using Postman/cURL, send invalid request:
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": "invalid"}'
```

**Expected**: 400 error with error message

**Status**: ✅ PASS/❌ FAIL

### Test 11.3: Not Found Error

**Steps:**
```bash
curl http://localhost:5000/api/expenses/99999
```

**Expected**: 404 error "Expense not found"

**Status**: ✅ PASS/❌ FAIL

---

## 12. Performance Tests

### Test 12.1: Load with Many Expenses

**Steps:**
1. Add 50 expenses rapidly
2. Check if list still renders smoothly
3. Verify no lag in UI

**Expected**: App remains responsive

**Status**: ✅ PASS/❌ FAIL

### Test 12.2: Database Query Speed

**Steps:**
1. In MySQL Workbench:
```sql
SELECT * FROM transactions WHERE date >= '2026-01-01' ORDER BY date DESC;
```
2. Check execution time

**Expected**: Query completes quickly (< 100ms)

**Status**: ✅ PASS/❌ FAIL

---

## 13. Responsive Design Tests

### Test 13.1: Desktop View

**Steps:**
1. Open app on full desktop screen
2. Check layout is proper
3. Forms and table display well

**Expected**: Proper layout on desktop

**Status**: ✅ PASS/❌ FAIL

### Test 13.2: Tablet View

**Steps:**
1. Resize browser to 768px width
2. Check responsive grid
3. Form and summary should stack

**Expected**: Proper layout on tablet

**Status**: ✅ PASS/❌ FAIL

### Test 13.3: Mobile View

**Steps:**
1. Resize to 375px width (mobile)
2. Test all functionality
3. Check period buttons respond

**Expected**: App works on mobile

**Status**: ✅ PASS/❌ FAIL

---

## 14. Browser Compatibility

### Test 14.1: Chrome

**Steps:**
1. Open app in Chrome
2. Test full workflow

**Expected**: All features work

**Status**: ✅ PASS/❌ FAIL

### Test 14.2: Firefox

**Steps:**
1. Open app in Firefox
2. Test full workflow

**Expected**: All features work

**Status**: ✅ PASS/❌ FAIL

### Test 14.3: Edge

**Steps:**
1. Open app in Edge
2. Test full workflow

**Expected**: All features work

**Status**: ✅ PASS/❌ FAIL

---

## 15. Integration Tests

### Test 15.1: Complete User Flow

**Steps:**
1. Add 5 different expenses
2. Edit 2 of them
3. Delete 1
4. Check summary updates
5. Refresh page
6. Verify all data persists
7. Check in MySQL Workbench
8. Delete one from database
9. Verify it's gone in frontend

**Expected**: Full cycle works without errors

**Status**: ✅ PASS/❌ FAIL

### Test 15.2: Real World Scenario

**Steps:**
1. Add expenses like real usage:
   - Monday: 50000 (Lunch)
   - Tuesday: 80000 (Gas)
   - Tuesday: 500000 (Rent)
   - Wednesday: 30000 (Coffee)
   - Thursday: 150000 (Shopping)
2. Check monthly summary = 810000
3. Verify week summary works
4. Check if can breakdown by category

**Expected**: All statistics correct

**Status**: ✅ PASS/❌ FAIL

---

## Test Results Summary

| Test Group | Total | Pass | Fail | Status |
|-----------|-------|------|------|--------|
| 1. API Health | 1 | _ | _ | |
| 2. Frontend Basic | 1 | _ | _ | |
| 3. Add Expense | 3 | _ | _ | |
| 4. View List | 4 | _ | _ | |
| 5. Edit Expense | 3 | _ | _ | |
| 6. Delete Expense | 3 | _ | _ | |
| 7. Summary/Stats | 5 | _ | _ | |
| 8. Categories | 1 | _ | _ | |
| 9. API Testing | 6 | _ | _ | |
| 10. Database | 3 | _ | _ | |
| 11. Error Handling | 3 | _ | _ | |
| 12. Performance | 2 | _ | _ | |
| 13. Responsive | 3 | _ | _ | |
| 14. Browser Compat | 3 | _ | _ | |
| 15. Integration | 2 | _ | _ | |
| **TOTAL** | **43** | **_** | **_** | |

---

## Debugging Tips

### View Console Logs
- **Frontend**: Press F12 → Console tab
- **Backend**: Check terminal output
- **Database**: Check MySQL Workbench messages

### Network Debugging
- **Frontend**: F12 → Network tab → check API calls
- Check response status codes
- Verify request/response data

### Database Debugging
- Query directly in MySQL Workbench
- Check row counts
- Verify indexes are used

---

## Performance Benchmarks

| Operation | Target | Actual |
|-----------|--------|--------|
| Load page | < 2s | _ |
| Add expense | < 1s | _ |
| Edit expense | < 1s | _ |
| Delete expense | < 1s | _ |
| Load 50 items | < 2s | _ |
| API response | < 200ms | _ |

---

**Test Version**: 1.0  
**Last Updated**: May 2026  
**Total Tests**: 43 test cases
