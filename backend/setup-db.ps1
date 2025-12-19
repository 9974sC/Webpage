# Database Setup Script
# This script helps set up the database for the Ascendia project

Write-Host "=== Ascendia Database Setup ===" -ForegroundColor Cyan
Write-Host ""

$pgPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
if (-not (Test-Path $pgPath)) {
    Write-Host "ERROR: PostgreSQL not found at $pgPath" -ForegroundColor Red
    exit 1
}

Write-Host "PostgreSQL found at: $pgPath" -ForegroundColor Green
Write-Host "Port: 1333" -ForegroundColor Green
Write-Host ""

# Prompt for postgres password
Write-Host "Enter PostgreSQL 'postgres' user password:" -ForegroundColor Yellow
$securePassword = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$postgresPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

if ([string]::IsNullOrEmpty($postgresPassword)) {
    Write-Host "Password cannot be empty" -ForegroundColor Red
    exit 1
}

$env:PGPASSWORD = $postgresPassword

# Test connection
Write-Host "`nTesting connection..." -ForegroundColor Cyan
$testResult = & $pgPath -U postgres -p 1333 -d postgres -c "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Connection failed. Please check your password." -ForegroundColor Red
    Write-Host $testResult
    exit 1
}

Write-Host "Connection successful!" -ForegroundColor Green

# Check if database exists
Write-Host "`nChecking if 'fastfinance' database exists..." -ForegroundColor Cyan
$dbExists = & $pgPath -U postgres -p 1333 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='fastfinance';" 2>&1

if ($dbExists -eq "1") {
    Write-Host "Database 'fastfinance' already exists" -ForegroundColor Green
} else {
    Write-Host "Creating database 'fastfinance'..." -ForegroundColor Cyan
    & $pgPath -U postgres -p 1333 -d postgres -c "CREATE DATABASE fastfinance;" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to create database" -ForegroundColor Red
        exit 1
    }
}

# Check if user exists
Write-Host "`nChecking if 'user' exists..." -ForegroundColor Cyan
$userExists = & $pgPath -U postgres -p 1333 -d postgres -tAc "SELECT 1 FROM pg_user WHERE usename='user';" 2>&1

if ($userExists -eq "1") {
    Write-Host "User 'user' already exists" -ForegroundColor Green
    Write-Host "Updating password..." -ForegroundColor Cyan
    & $pgPath -U postgres -p 1333 -d postgres -c "ALTER USER `"user`" WITH PASSWORD 'password';" 2>&1 | Out-Null
} else {
    Write-Host "Creating user 'user' with password 'password'..." -ForegroundColor Cyan
    & $pgPath -U postgres -p 1333 -d postgres -c "CREATE USER `"user`" WITH PASSWORD 'password';" 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create user" -ForegroundColor Red
        exit 1
    }
}

# Grant privileges
Write-Host "Granting privileges on database..." -ForegroundColor Cyan
& $pgPath -U postgres -p 1333 -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE fastfinance TO `"user`";" 2>&1 | Out-Null
& $pgPath -U postgres -p 1333 -d fastfinance -c "GRANT ALL ON SCHEMA public TO `"user`";" 2>&1 | Out-Null

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host "Database: fastfinance" -ForegroundColor Green
Write-Host "User: user" -ForegroundColor Green
Write-Host "Password: password" -ForegroundColor Green
Write-Host "Port: 1333" -ForegroundColor Green
Write-Host "`nYour .env file should have:" -ForegroundColor Cyan
Write-Host 'DATABASE_URL="postgresql://user:password@localhost:1333/fastfinance?schema=public"' -ForegroundColor Yellow

# Clean up
Remove-Item Env:\PGPASSWORD
