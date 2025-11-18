#!/bin/bash

echo "Testing Custom Authentication System"
echo "===================================="
echo ""

# Generate unique test email
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser-${TIMESTAMP}@example.com"
TEST_PASSWORD="TestPassword123!"
TEST_NAME="Test User ${TIMESTAMP}"

echo "1. Testing Registration"
echo "----------------------"
echo "Email: $TEST_EMAIL"
echo "Name: $TEST_NAME"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1 | cut -d':' -f2)
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | sed '$ d')

echo "Response: $RESPONSE_BODY"
echo "HTTP Status: $HTTP_STATUS"
echo ""

if [ "$HTTP_STATUS" = "201" ]; then
  echo "✅ Registration successful!"
else
  echo "❌ Registration failed!"
  exit 1
fi

echo ""
echo "2. Testing Login"
echo "---------------"

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -c cookies.txt \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1 | cut -d':' -f2)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | sed '$ d')

echo "Response: $RESPONSE_BODY"
echo "HTTP Status: $HTTP_STATUS"
echo ""

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Login successful!"
else
  echo "❌ Login failed!"
  exit 1
fi

echo ""
echo "3. Testing Session"
echo "-----------------"

SESSION_RESPONSE=$(curl -s -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$SESSION_RESPONSE" | tail -n 1 | cut -d':' -f2)
RESPONSE_BODY=$(echo "$SESSION_RESPONSE" | sed '$ d')

echo "Response: $RESPONSE_BODY"
echo "HTTP Status: $HTTP_STATUS"
echo ""

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Session retrieved successfully!"
else
  echo "❌ Session retrieval failed!"
  exit 1
fi

echo ""
echo "4. Testing Logout"
echo "----------------"

LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$LOGOUT_RESPONSE" | tail -n 1 | cut -d':' -f2)
RESPONSE_BODY=$(echo "$LOGOUT_RESPONSE" | sed '$ d')

echo "Response: $RESPONSE_BODY"
echo "HTTP Status: $HTTP_STATUS"
echo ""

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Logout successful!"
else
  echo "❌ Logout failed!"
  exit 1
fi

echo ""
echo "5. Testing Session After Logout"
echo "-------------------------------"

SESSION_RESPONSE=$(curl -s -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$SESSION_RESPONSE" | tail -n 1 | cut -d':' -f2)
RESPONSE_BODY=$(echo "$SESSION_RESPONSE" | sed '$ d')

echo "Response: $RESPONSE_BODY"
echo "HTTP Status: $HTTP_STATUS"
echo ""

if [ "$HTTP_STATUS" = "401" ]; then
  echo "✅ Session correctly cleared after logout!"
else
  echo "❌ Session not properly cleared!"
  exit 1
fi

# Clean up
rm -f cookies.txt

echo ""
echo "===================================="
echo "✅ All authentication tests passed!"
echo "===================================="