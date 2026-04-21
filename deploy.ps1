#!/usr/bin/env powershell

# 🚀 GoKab Cloud Deployment Setup Script for Windows PowerShell

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       GoKab MVP - Cloud Deployment Setup Script           ║" -ForegroundColor Cyan
Write-Host "║          Email: codemathphp@gmail.com                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "✅ Checking prerequisites..." -ForegroundColor Green
if (-Not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git from https://git-scm.com" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git is installed" -ForegroundColor Green

# Check if Node.js is installed
if (-Not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js/npm is not installed. Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js is installed: $(node --version)" -ForegroundColor Green
Write-Host ""

# Display next steps
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║                    🚀 NEXT STEPS                           ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 1️⃣ : Create GitHub Repository" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/new"
Write-Host "2. Repository name: gokab-mvp"
Write-Host "3. Make it PUBLIC"
Write-Host "4. Click 'Create repository'"
Write-Host "5. Copy the HTTPS URL"
Write-Host ""

Write-Host "STEP 2️⃣ : Push Code to GitHub" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Run these commands (replace YourUsername):" -ForegroundColor White
Write-Host ""
Write-Host "git remote add origin https://github.com/YourUsername/gokab-mvp.git" -ForegroundColor Yellow
Write-Host "git branch -M main" -ForegroundColor Yellow
Write-Host "git push -u origin main" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 3️⃣ : Deploy to Vercel" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Install Vercel CLI:" -ForegroundColor White
Write-Host "npm install -g vercel" -ForegroundColor Yellow
Write-Host ""
Write-Host "Login to Vercel (opens browser):" -ForegroundColor White
Write-Host "vercel login" -ForegroundColor Yellow
Write-Host ""
Write-Host "Deploy:" -ForegroundColor White
Write-Host "vercel" -ForegroundColor Yellow
Write-Host ""
Write-Host "Deploy to Production:" -ForegroundColor White
Write-Host "vercel --prod" -ForegroundColor Yellow
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           ✨ YOUR APP WILL BE LIVE ON THE WEB ✨           ║" -ForegroundColor Green
Write-Host "║         You'll get a URL like:                            ║" -ForegroundColor Green
Write-Host "║         https://gokab-mvp.vercel.app                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Git Repository Status:" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "Current branch: $(git rev-parse --abbrev-ref HEAD)"
Write-Host "Latest commit: $(git log -1 --oneline)"
Write-Host "Total commits: $(git rev-list --all --count)"
Write-Host ""

Write-Host "📚 Documentation Files:" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "📄 README.md               - Feature overview"
Write-Host "📄 QUICKSTART.md           - Quick start guide"
Write-Host "📄 DEPLOYMENT.md           - Deployment options"
Write-Host "📄 CLOUD_DEPLOYMENT.md     - Detailed cloud setup"
Write-Host "📄 DEPLOY_NOW.md           - Quick reference"
Write-Host "📄 PROJECT_SUMMARY.md      - Complete architecture"
Write-Host ""

Write-Host "🎯 Project Status:" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ Next.js app built"
Write-Host "✅ Firebase configured"
Write-Host "✅ Mapbox integrated"
Write-Host "✅ PWA enabled"
Write-Host "✅ Git initialized"
Write-Host "✅ Ready for deployment"
Write-Host ""

Write-Host "💡 Pro Tips:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "• Vercel auto-deploys every time you push to GitHub"
Write-Host "• Share your live URL with stakeholders"
Write-Host "• Monitor performance in Vercel Dashboard"
Write-Host "• Scale automatically as traffic grows"
Write-Host ""

Write-Host "🎉 Ready? Let's go live!" -ForegroundColor Cyan
Write-Host ""
