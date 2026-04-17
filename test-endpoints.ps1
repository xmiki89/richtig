# Test MongoDB endpoints on local test server
$BASE_URL = "http://localhost:3001"

Write-Host "=== Testing MongoDB Functions (Mock Server) ===" -ForegroundColor Green

# 1. Check if member exists (John Doe should exist)
Write-Host "`n1. Checking if John Doe exists..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/check-member?name=John&nachname=Doe" -Method GET
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Get member role
Write-Host "`n2. Getting John Doe's role..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/get-role?name=John&nachname=Doe" -Method GET
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Save a new member
Write-Host "`n3. Saving new member Jane Smith..." -ForegroundColor Yellow
$body = @{
    name = "Jane"
    nachname = "Smith"
    email = "jane@example.com"
    id = "456"
    password = "test456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/save-member" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Check if new member exists
Write-Host "`n4. Checking if Jane Smith exists..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/check-member?name=Jane&nachname=Smith" -Method GET
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Update member role
Write-Host "`n5. Updating Jane Smith's role to Admin..." -ForegroundColor Yellow
$body = @{
    name = "Jane"
    nachname = "Smith"
    role = "Admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/update-role" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Get updated role
Write-Host "`n6. Getting Jane Smith's updated role..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/get-role?name=Jane&nachname=Smith" -Method GET
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Save a contract
Write-Host "`n7. Saving contract..." -ForegroundColor Yellow
$body = @{
    vertragsname = "Test Contract"
    material = "Wood"
    ziel = "Build table"
    mitglieder = @("Jane Smith")
    stueckData = @{
        pieces = 10
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/save-vertrag" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Save password
Write-Host "`n8. Saving password..." -ForegroundColor Yellow
$body = @{
    data = "encrypted_password_data_$(Get-Date)"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/save-password" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Delete member
Write-Host "`n9. Deleting Jane Smith..." -ForegroundColor Yellow
$body = @{
    name = "Jane"
    nachname = "Smith"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/delete-member" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 10. Verify deletion
Write-Host "`n10. Verifying Jane Smith was deleted..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/check-member?name=Jane&nachname=Smith" -Method GET
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
