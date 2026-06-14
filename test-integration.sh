#!/bin/bash
# Expense Tracker - Integration Test Suite
# Tests the full system: Backend API + Database + Frontend

set -e

API_URL="${1:-http://localhost:5000/api}"
FRONTEND_URL="${2:-http://localhost:3000}"

echo "========================================="
echo "Integration Test Suite"
echo "API: $API_URL"
echo "Frontend: $FRONTEND_URL"
echo "========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

TEST_COUNT=0
PASS_COUNT=0
FAIL_COUNT=0

# Test function
run_test() {
  local test_name=$1
  local expected_status=$2
  local method=${3:-GET}
  local endpoint=$4
  local data=${5:-""}
  
  ((TEST_COUNT++))
  
  echo -n "Test $TEST_COUNT: $test_name ... "
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  status_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$status_code" = "$expected_status" ]; then
    echo -e "${GREEN}PASS${NC}"
    ((PASS_COUNT++))
    return 0
  else
    echo -e "${RED}FAIL${NC} (Expected: $expected_status, Got: $status_code)"
    echo "  Response: $body"
    ((FAIL_COUNT++))
    return 1
  fi
}

# Test Case 1: Health Check
echo ""
echo "=== Test Group 1: Health & System ==="
run_test "Health Check Endpoint" "200" "GET" "/health"
run_test "API Root Endpoint" "200" "GET" ""

# Test Case 2: Expenses CRUD
echo ""
echo "=== Test Group 2: Expenses CRUD ==="
run_test "Get All Expenses" "200" "GET" "/expenses"

# Create a test expense
EXPENSE_DATA='{"amount": 50000, "description": "Lunch", "date": "'$(date -u +%Y-%m-%d)'"}'
run_test "Create Expense" "201" "POST" "/expenses" "$EXPENSE_DATA"

# Test Case 3: Summary Endpoints
echo ""
echo "=== Test Group 3: Summary Reports ==="
run_test "Daily Summary" "200" "GET" "/expenses/summary/day"
run_test "Weekly Summary" "200" "GET" "/expenses/summary/week"
run_test "Monthly Summary" "200" "GET" "/expenses/summary/month"
run_test "Yearly Summary" "200" "GET" "/expenses/summary/year"

# Test Case 4: Error Handling
echo ""
echo "=== Test Group 4: Error Handling ==="
run_test "Invalid Endpoint 404" "404" "GET" "/invalid-endpoint"
run_test "Invalid Summary Period" "400" "GET" "/expenses/summary/invalid"

# Summary
echo ""
echo "========================================="
echo "Test Results"
echo "========================================="
echo "Total Tests: $TEST_COUNT"
echo -e "Passed: ${GREEN}$PASS_COUNT${NC}"
echo -e "Failed: ${RED}$FAIL_COUNT${NC}"

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed!${NC}"
  exit 1
fi
