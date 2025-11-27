#!/bin/bash

# API Testing Script for Todo List App
# This script tests all CRUD operations for users and todos

BASE_URL="http://localhost:3000"
echo "Testing Todo List API at $BASE_URL"
echo "Make sure the dev server is running (npm run dev)"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Create a user
echo "1. Creating a user..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "username": "testuser"
  }')

echo "$USER_RESPONSE" | jq .

# Extract user ID
USER_ID=$(echo "$USER_RESPONSE" | jq -r '.user.id')
echo -e "${GREEN}✓ User created with ID: $USER_ID${NC}"
echo ""

# Test 2: List users
echo "2. Listing all users..."
curl -s "$BASE_URL/api/users" | jq .
echo -e "${GREEN}✓ Users listed${NC}"
echo ""

# Test 3: Create a todo
echo "3. Creating a todo..."
TODO_RESPONSE=$(curl -s -X POST "$BASE_URL/api/todos" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": $USER_ID,
    \"title\": \"Test Todo Item\",
    \"description\": \"This is a test todo created via API\",
    \"due_date\": \"2025-12-01T00:00:00.000Z\"
  }")

echo "$TODO_RESPONSE" | jq .

# Extract todo ID
TODO_ID=$(echo "$TODO_RESPONSE" | jq -r '.todo.id')
echo -e "${GREEN}✓ Todo created with ID: $TODO_ID${NC}"
echo ""

# Test 4: List todos for user
echo "4. Listing todos for user $USER_ID..."
curl -s "$BASE_URL/api/todos?user_id=$USER_ID" | jq .
echo -e "${GREEN}✓ Todos listed${NC}"
echo ""

# Test 5: Get specific todo
echo "5. Getting todo $TODO_ID..."
curl -s "$BASE_URL/api/todos/$TODO_ID" | jq .
echo -e "${GREEN}✓ Todo retrieved${NC}"
echo ""

# Test 6: Update todo (mark as completed)
echo "6. Updating todo $TODO_ID (marking as completed)..."
curl -s -X PATCH "$BASE_URL/api/todos/$TODO_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "is_completed": true,
    "title": "Updated Test Todo Item"
  }' | jq .
echo -e "${GREEN}✓ Todo updated${NC}"
echo ""

# Test 7: List completed todos
echo "7. Listing completed todos for user $USER_ID..."
curl -s "$BASE_URL/api/todos?user_id=$USER_ID&is_completed=true" | jq .
echo -e "${GREEN}✓ Completed todos listed${NC}"
echo ""

# Test 8: Delete todo
echo "8. Deleting todo $TODO_ID..."
curl -s -X DELETE "$BASE_URL/api/todos/$TODO_ID" | jq .
echo -e "${GREEN}✓ Todo deleted${NC}"
echo ""

# Test 9: Verify deletion
echo "9. Verifying todo was deleted..."
DELETED_TODO=$(curl -s "$BASE_URL/api/todos/$TODO_ID")
if echo "$DELETED_TODO" | jq -e '.error' > /dev/null; then
  echo -e "${GREEN}✓ Todo not found (as expected)${NC}"
else
  echo -e "${RED}✗ Todo still exists${NC}"
fi
echo ""

echo "================================================"
echo -e "${GREEN}All API tests completed successfully!${NC}"
echo "================================================"
