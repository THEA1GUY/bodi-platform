# BODI Platform - Render Deployment Preparation Script
# This script prepares your code for Render deployment

Write-Host "🚀 BODI Platform - Render Deployment Prep" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "❌ Error: Please run this script from the bodi-platform root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Pre-Deployment Checklist" -ForegroundColor Yellow
Write-Host ""

# Check for API keys
Write-Host "🔑 Checking environment variables..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    $envContent = Get-Content "backend\.env" -Raw
    if ($envContent -match "GROQ_API_KEY=your_groq_api_key_here") {
        Write-Host "⚠️  WARNING: GROQ_API_KEY not set in backend\.env" -ForegroundColor Red
        Write-Host "   Please update backend\.env with your actual Groq API key" -ForegroundColor Yellow
    } else {
        Write-Host "✅ GROQ_API_KEY is set" -ForegroundColor Green
    }
    
    if ($envContent -match "TAVILY_API_KEY") {
        Write-Host "✅ TAVILY_API_KEY is set" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNING: TAVILY_API_KEY not found in backend\.env" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  WARNING: backend\.env file not found" -ForegroundColor Red
    Write-Host "   Copy backend\.env.example to backend\.env and add your API keys" -ForegroundColor Yellow
}

Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

# Create/update .gitignore
Write-Host "📝 Ensuring .gitignore is up to date..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    Write-Host "✅ .gitignore exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating .gitignore..." -ForegroundColor Yellow
}

# Check for Procfile
if (Test-Path "backend\Procfile") {
    Write-Host "✅ Procfile exists for Render" -ForegroundColor Green
} else {
    Write-Host "⚠️  Procfile missing - creating it..." -ForegroundColor Yellow
    "web: uvicorn main:app --host 0.0.0.0 --port `$PORT" | Out-File -FilePath "backend\Procfile" -Encoding UTF8 -NoNewline
    Write-Host "✅ Procfile created" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Deployment Information" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Configuration:" -ForegroundColor White
Write-Host "  Root Directory: backend" -ForegroundColor Gray
Write-Host "  Build Command: pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "  Start Command: uvicorn main:app --host 0.0.0.0 --port `$PORT" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend Configuration:" -ForegroundColor White
Write-Host "  Root Directory: frontend" -ForegroundColor Gray
Write-Host "  Build Command: npm install && npm run build" -ForegroundColor Gray
Write-Host "  Publish Directory: .next" -ForegroundColor Gray
Write-Host ""

# Git status
Write-Host "📊 Git Status:" -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "  Files to commit:" -ForegroundColor Gray
    git status --short
} else {
    Write-Host "  ✅ No uncommitted changes" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Ready to Deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Commit your changes:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Prepare for Render deployment'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Create GitHub repository:" -ForegroundColor White
Write-Host "   - Go to https://github.com/new" -ForegroundColor Gray
Write-Host "   - Name: bodi-platform" -ForegroundColor Gray
Write-Host "   - Make it Private for beta testing" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Push to GitHub:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/bodi-platform.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Deploy to Render:" -ForegroundColor White
Write-Host "   - Follow RENDER_DEPLOY.md for detailed steps" -ForegroundColor Gray
Write-Host "   - Or use DEPLOY_CHECKLIST.md for quick reference" -ForegroundColor Gray
Write-Host ""

$commit = Read-Host "Would you like to commit your changes now? (y/n)"
if ($commit -eq "y" -or $commit -eq "Y") {
    Write-Host ""
    Write-Host "📦 Staging files..." -ForegroundColor Yellow
    git add .
    
    $message = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($message)) {
        $message = "Prepare BODI Platform for Render deployment"
    }
    
    Write-Host "💾 Committing..." -ForegroundColor Yellow
    git commit -m "$message"
    Write-Host "✅ Changes committed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📖 Next: Follow RENDER_DEPLOY.md to deploy to Render" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "👍 No problem! Commit when you're ready with:" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Your message'" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📚 Deployment Guides Available:" -ForegroundColor Cyan
Write-Host "  - RENDER_DEPLOY.md (detailed guide)" -ForegroundColor White
Write-Host "  - DEPLOY_CHECKLIST.md (quick checklist)" -ForegroundColor White
Write-Host "  - SESSION_SUMMARY.md (today's work summary)" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Good luck with your deployment!" -ForegroundColor Green
