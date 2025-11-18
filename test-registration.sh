#!/bin/bash

TIMESTAMP=$(date +%s)
EMAIL="test-${TIMESTAMP}@example.com"

echo "Testing registration with email: $EMAIL"

curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"TestPassword123!\"}" \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
