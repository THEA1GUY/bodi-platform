# BODI Platform - Quick Deploy Script
# This script helps you deploy to Vercel quickly

Write-Host "🚀 BODI Platform - Quick Deploy to Vercel" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "❌ Error: Please run this script from the bodi-platform root directory" -ForegroundColor Red
    exit 1
}

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check if Vercel CLI is installed
Write-Host "🔍 Checking for Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI already installed" -ForegroundColor Green
}

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Creating .gitignore..." -ForegroundColor Yellow
    @"
# Dependencies
node_modules/
__pycache__/
*.pyc

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
frontend/.next/
frontend/out/
frontend/build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite
*.sqlite3

# Logs
*.log
npm-debug.log*
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ .gitignore created" -ForegroundColor Green
}

# Add all files
Write-Host "📦 Adding files to git..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Deploy: BODI Platform with logo integration"
}
git commit -m "$commitMessage"
Write-Host "✅ Changes committed" -ForegroundColor Green

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub (if you haven't already):" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/bodi-platform.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy Frontend to Vercel:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   vercel" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy Backend to Render:" -ForegroundColor White
Write-Host "   - Go to https://render.com" -ForegroundColor Gray
Write-Host "   - Create new Web Service" -ForegroundColor Gray
Write-Host "   - Connect your GitHub repo" -ForegroundColor Gray
Write-Host "   - Set root directory to 'backend'" -ForegroundColor Gray
Write-Host "   - Build command: pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "   - Start command: uvicorn main:app --host 0.0.0.0 --port \$PORT" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Full deployment guide: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

$deploy = Read-Host "Would you like to deploy the frontend now? (y/n)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    Set-Location frontend
    vercel
    Set-Location ..
    Write-Host "✅ Deployment initiated!" -ForegroundColor Green
} else {
    Write-Host "👍 No problem! Deploy when you're ready with: cd frontend && vercel" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup complete! Happy deploying!" -ForegroundColor Green
