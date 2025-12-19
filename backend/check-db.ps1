# Database Connection Check Script
Write-Host "Checking PostgreSQL connection..." -ForegroundColor Cyan

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Load .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

$dbUrl = $env:DATABASE_URL
if (-not $dbUrl) {
    Write-Host "ERROR: DATABASE_URL not found in .env file" -ForegroundColor Red
    exit 1
}

Write-Host "DATABASE_URL: $dbUrl" -ForegroundColor Yellow

# Try to parse connection string
if ($dbUrl -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)') {
    $user = $matches[1]
    $password = $matches[2]
    $dbHost = $matches[3]
    $port = $matches[4]
    $database = $matches[5]
    
    Write-Host "`nConnection details:" -ForegroundColor Cyan
    Write-Host "  Host: $dbHost"
    Write-Host "  Port: $port"
    Write-Host "  Database: $database"
    Write-Host "  User: $user"
    
    # Check if psql is available
    $psqlPath = Get-Command psql -ErrorAction SilentlyContinue
    if ($psqlPath) {
        Write-Host "`nTesting connection with psql..." -ForegroundColor Cyan
        $env:PGPASSWORD = $password
        $result = & psql -h $dbHost -p $port -U $user -d postgres -c "SELECT 1;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Connection successful!" -ForegroundColor Green
            
            # Check if database exists
            $dbExists = & psql -h $dbHost -p $port -U $user -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$database'" 2>&1
            if ($dbExists -eq "1") {
                Write-Host "Database '$database' exists" -ForegroundColor Green
            } else {
                Write-Host "Database '$database' does NOT exist" -ForegroundColor Yellow
                Write-Host "Creating database..." -ForegroundColor Cyan
                & psql -h $dbHost -p $port -U $user -d postgres -c "CREATE DATABASE $database;" 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "Database created successfully!" -ForegroundColor Green
                } else {
                    Write-Host "Failed to create database" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "Connection failed!" -ForegroundColor Red
            Write-Host $result
            Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
            Write-Host "1. Make sure PostgreSQL is running"
            Write-Host "2. Verify credentials in .env file"
            Write-Host "3. Check if PostgreSQL service is started: Get-Service -Name '*postgresql*'"
        }
    } else {
        Write-Host "`npsql not found in PATH" -ForegroundColor Yellow
        Write-Host "Please install PostgreSQL or add it to your PATH" -ForegroundColor Yellow
        Write-Host "`nTo manually create the database:" -ForegroundColor Cyan
        Write-Host "1. Start PostgreSQL service"
        Write-Host "2. Open pgAdmin or psql"
        Write-Host "3. Run: CREATE DATABASE $database;"
    }
} else {
    Write-Host "Could not parse DATABASE_URL" -ForegroundColor Red
}
