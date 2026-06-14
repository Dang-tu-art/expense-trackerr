# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Health Check

### GET /api/health
Check if the API is running and healthy.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-05-11T10:30:00.000Z",
  "service": "Expense Tracker API"
}
```

---

## Expenses Endpoints

### 1. GET /api/expenses
Get all expenses (sorted by date, newest first).

**Response:**
```json
[
  {
    "id": 1,
    "amount": 50000,
    "description": "Ăn trưa tại nhà hàng",
    "category": "Ăn uống",
    "date": "2026-05-11",
    "createdAt": "2026-05-11T10:20:00.000Z",
    "updatedAt": "2026-05-11T10:20:00.000Z"
  }
]
```

---

### 2. GET /api/expenses/:id
Get a single expense by ID.

**Parameters:**
- `id` (required) - Expense ID

**Response:**
```json
{
  "id": 1,
  "amount": 50000,
  "description": "Ăn trưa tại nhà hàng",
  "category": "Ăn uống",
  "date": "2026-05-11",
  "createdAt": "2026-05-11T10:20:00.000Z",
  "updatedAt": "2026-05-11T10:20:00.000Z"
}
```

**Error:**
```json
{
  "error": "Expense not found"
}
```

---

### 3. POST /api/expenses
Create a new expense.

**Request Body:**
```json
{
  "amount": 50000,
  "description": "Ăn trưa",
  "category": "Ăn uống",
  "date": "2026-05-11"
}
```

**Required Fields:**
- `amount` (number) - Amount in VND
- `description` (string) - Description
- `category` (string) - Category
- `date` (string) - Date (YYYY-MM-DD format)

**Response (201 Created):**
```json
{
  "id": 11,
  "amount": 50000,
  "description": "Ăn trưa",
  "category": "Ăn uống",
  "date": "2026-05-11",
  "createdAt": "2026-05-11T10:30:00.000Z"
}
```

**Error (400):**
```json
{
  "error": "Missing required fields"
}
```

---

### 4. PUT /api/expenses/:id
Update an existing expense.

**Parameters:**
- `id` (required) - Expense ID

**Request Body:**
```json
{
  "amount": 55000,
  "description": "Ăn trưa tại nhà hàng",
  "category": "Ăn uống",
  "date": "2026-05-11"
}
```

**Response (200):**
```json
{
  "message": "Expense updated successfully"
}
```

**Error (404):**
```json
{
  "error": "Expense not found"
}
```

---

### 5. DELETE /api/expenses/:id
Delete an expense.

**Parameters:**
- `id` (required) - Expense ID

**Response (200):**
```json
{
  "message": "Expense deleted successfully"
}
```

**Error (404):**
```json
{
  "error": "Expense not found"
}
```

---

### 6. GET /api/expenses/summary/:period
Get expense summary by time period.

**Parameters:**
- `period` (required) - One of: `day`, `week`, `month`, `year`

**Response:**
```json
[
  {
    "period": "2026-05",
    "total": 800000,
    "count": 8
  },
  {
    "period": "2026-04",
    "total": 2500000,
    "count": 12
  }
]
```

**Examples:**
- `/api/expenses/summary/day` - Summary by date
- `/api/expenses/summary/week` - Summary by week
- `/api/expenses/summary/month` - Summary by month
- `/api/expenses/summary/year` - Summary by year

---

## Categories

Default categories:
- Ăn uống (Food & Drink)
- Giao thông (Transportation)
- Tiện ích (Utilities)
- Mua sắm (Shopping)
- Giải trí (Entertainment)
- Quà tặng (Gifts)
- Nhà ở (Housing)
- Học tập (Education)
- Sức khỏe (Health)
- Khác (Other)

---

## Error Handling

All errors return JSON with error details:

```json
{
  "error": "Failed to fetch expenses",
  "details": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid fields)
- `404` - Not Found
- `500` - Server Error

---

## cURL Examples

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Expenses
```bash
curl http://localhost:5000/api/expenses
```

### Create Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "description": "Ăn trưa",
    "category": "Ăn uống",
    "date": "2026-05-11"
  }'
```

### Update Expense
```bash
curl -X PUT http://localhost:5000/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 55000,
    "description": "Ăn trưa tại nhà hàng",
    "category": "Ăn uống",
    "date": "2026-05-11"
  }'
```

### Delete Expense
```bash
curl -X DELETE http://localhost:5000/api/expenses/1
```

### Get Monthly Summary
```bash
curl http://localhost:5000/api/expenses/summary/month
```

---

## Database

**Database**: `expense_tracker`  
**Table**: `transactions`

**Columns:**
- `id` (INT, Primary Key, Auto Increment)
- `amount` (DECIMAL 10,2)
- `description` (VARCHAR 255)
- `category` (VARCHAR 100)
- `date` (DATE)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Indexes:**
- `idx_date` on `date` column (for fast date queries)

---

## Rate Limiting

No rate limiting implemented (can be added in production).

## Authentication

No authentication required in v1.0 (can be added in future versions).

---

**API Version**: 1.0.0  
**Last Updated**: May 2026
