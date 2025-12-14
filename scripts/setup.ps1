# PowerShell setup script for Windows

Write-Host "🚀 Setting up Oumi RL Studio...`n" -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local file...`n" -ForegroundColor Yellow
    $envContent = @"
# Database
DATABASE_URL="file:./db/custom.db"

# Backend Service
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3002

# Features
USE_DATABASE=true
"@
    Set-Content -Path ".env.local" -Value $envContent
    Write-Host "✅ Created .env.local`n" -ForegroundColor Green
}

# Ensure db directory exists
if (-not (Test-Path "db")) {
    Write-Host "📁 Creating db directory...`n" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "db" | Out-Null
    Write-Host "✅ Created db directory`n" -ForegroundColor Green
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma client...`n" -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Prisma client generated`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Push database schema
Write-Host "💾 Setting up database schema...`n" -ForegroundColor Yellow
try {
    npx prisma db push --accept-data-loss
    Write-Host "✅ Database schema set up`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set up database schema" -ForegroundColor Red
    exit 1
}

# Install backend service dependencies if needed
if (Test-Path "mini-services\oumi-service") {
    if (Test-Path "mini-services\oumi-service\package.json") {
        if (-not (Test-Path "mini-services\oumi-service\node_modules")) {
            Write-Host "📦 Installing backend service dependencies...`n" -ForegroundColor Yellow
            try {
                Set-Location "mini-services\oumi-service"
                npm install
                Set-Location "../.."
                Write-Host "✅ Backend service dependencies installed`n" -ForegroundColor Green
            } catch {
                Write-Host "⚠️  Failed to install backend service dependencies" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "✨ Setup complete! You can now run 'npm run dev:all' to start everything.`n" -ForegroundColor Green

