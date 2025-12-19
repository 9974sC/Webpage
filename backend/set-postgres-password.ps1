# Script to set PostgreSQL postgres user password to "password"

Write-Host "=== Setting PostgreSQL postgres user password ===" -ForegroundColor Cyan
Write-Host ""

$pgPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
if (-not (Test-Path $pgPath)) {
    Write-Host "ERROR: PostgreSQL not found at $pgPath" -ForegroundColor Red
    exit 1
}

Write-Host "PostgreSQL found at: $pgPath" -ForegroundColor Green
Write-Host "Port: 1333" -ForegroundColor Green
Write-Host ""

# Method 1: Try with trust authentication (if pg_hba.conf allows local connections)
Write-Host "Attempting to set password using local trust connection..." -ForegroundColor Cyan

# First, try to connect without password (trust method)
$result = & $pgPath -U postgres -p 1333 -d postgres -c "ALTER USER postgres WITH PASSWORD 'password';" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! Password set to 'password'" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testing the new password..." -ForegroundColor Cyan
    
    $env:PGPASSWORD = "password"
    $testResult = & $pgPath -U postgres -p 1333 -d postgres -c "SELECT current_user;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Password verified successfully!" -ForegroundColor Green
        Remove-Item Env:\PGPASSWORD
        Write-Host ""
        Write-Host "You can now run the database setup script:" -ForegroundColor Yellow
        Write-Host "  powershell -ExecutionPolicy Bypass -File setup-db.ps1" -ForegroundColor White
        Write-Host ""
        Write-Host "When prompted for the postgres password, enter: password" -ForegroundColor Cyan
    } else {
        Write-Host "Warning: Password set but verification failed" -ForegroundColor Yellow
        Write-Host $testResult
    }
} else {
    Write-Host "Failed to set password using trust method." -ForegroundColor Yellow
    Write-Host $result
    Write-Host ""
    Write-Host "Alternative method: Modify pg_hba.conf temporarily" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Edit: C:\Program Files\PostgreSQL\16\data\pg_hba.conf" -ForegroundColor Yellow
    Write-Host "2. Find the line with 'local all all' and change it to:" -ForegroundColor Yellow
    Write-Host "   local   all             all                                     trust" -ForegroundColor White
    Write-Host "3. Restart PostgreSQL service" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use pgAdmin to change the password through the GUI" -ForegroundColor Cyan
    exit 1
}
