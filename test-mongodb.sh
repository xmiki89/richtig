#!/bin/bash

# Test MongoDB endpoints
BASE_URL="https://fanciful-pony-22f711.netlify.app"

echo "=== Testing MongoDB Functions ==="

# 1. Save a new member
echo -e "\n1. Saving new member..."
curl -X POST "$BASE_URL/save-member" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","nachname":"Doe","email":"john@example.com","id":"123","password":"test123"}'

# 2. Check if member exists
echo -e "\n\n2. Checking if member exists..."
curl "$BASE_URL/check-member?name=John&nachname=Doe"

# 3. Get member role
echo -e "\n\n3. Getting member role..."
curl "$BASE_URL/get-role?name=John&nachname=Doe"

# 4. Update member role
echo -e "\n\n4. Updating member role..."
curl -X POST "$BASE_URL/update-role" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","nachname":"Doe","role":"Admin"}'

# 5. Save a contract
echo -e "\n\n5. Saving contract..."
curl -X POST "$BASE_URL/save-vertrag" \
  -H "Content-Type: application/json" \
  -d '{"vertragsname":"Test Contract","material":"Wood","ziel":"Build table","mitglieder":["John Doe"],"stueckData":{"pieces":10}}'

# 6. Save password
echo -e "\n\n6. Saving password..."
curl -X POST "$BASE_URL/save-password" \
  -H "Content-Type: application/json" \
  -d '{"data":"encrypted_password_data"}'

# 7. Delete member
echo -e "\n\n7. Deleting member..."
curl -X POST "$BASE_URL/delete-member" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","nachname":"Doe"}'

echo -e "\n\n=== Test Complete ==="
