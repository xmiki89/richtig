# Test MongoDB endpoints for BlackOath project
$BASE_URL = "https://fanciful-pony-22f711.netlify.app"

Write-Host "=== Testing MongoDB Functions ===" -ForegroundColor Green

# 1. Save a new member
Write-Host "`n1. Saving new member..." -ForegroundColor Yellow
$body = @{
    name = "John"
    nachname = "Doe"
    email = "john@example.com"
    id = "123"
    password = "test123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/save-member" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Check if member exists
Write-Host "`n2. Checking if member exists..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/check-member?name=John&nachname=Doe" -Method GET
    Write-Host "Response: $response"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Get member role
Write-Host "`n3. Getting member role..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/get-role?name=John&nachname=Doe" -Method GET
    Write-Host "Response: $response"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Update member role
Write-Host "`n4. Updating member role..." -ForegroundColor Yellow
$body = @{
    name = "John"
    nachname = "Doe"
    role = "Admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/update-role" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Save a contract
Write-Host "`n5. Saving contract..." -ForegroundColor Yellow
$body = @{
    vertragsname = "Test Contract"
    material = "Wood"
    ziel = "Build table"
    mitglieder = @("John Doe")
    stueckData = @{
        pieces = 10
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/save-vertrag" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Save password
Write-Host "`n6. Saving password..." -ForegroundColor Yellow
$body = @{
    data = "encrypted_password_data"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/save-password" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $response"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
