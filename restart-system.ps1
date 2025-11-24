#!/usr/bin/env pwsh
# Complete restart: Node + Deploy + Frontend

Write-Host "=== RESTARTING BLOCKCHAIN SYSTEM ===" -ForegroundColor Yellow
Write-Host ""

# Check if Hardhat node is running
$hardhatProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "hardhat node" }

if (-not $hardhatProcess) {
    Write-Host "ERROR: Hardhat node is not running!" -ForegroundColor Red
    Write-Host "Please run this in a separate terminal:" -ForegroundColor Yellow
    Write-Host "  cd D:\Blockchain" -ForegroundColor Cyan
    Write-Host "  .\start-node.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Deploying contract..." -ForegroundColor Cyan
Set-Location D:\Blockchain\contracts
npm run deploy:localhost

if ($LASTEXITCODE -eq 0) {
    Write-Host "Contract deployed successfully!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Step 2: Checking contract..." -ForegroundColor Cyan
    npm run check
    
    Write-Host ""
    Write-Host "=== SYSTEM READY ===" -ForegroundColor Green
    Write-Host "Frontend URL: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Contract deployed and verified!" -ForegroundColor Green
    Write-Host ""
    Write-Host "NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Open browser: http://localhost:3000" -ForegroundColor White
    Write-Host "2. Connect MetaMask (Hardhat Localhost network)" -ForegroundColor White
    Write-Host "3. Refresh the page (Ctrl+F5)" -ForegroundColor White
    Write-Host "4. Try uploading again" -ForegroundColor White
} else {
    Write-Host "Deployment failed!" -ForegroundColor Red
    Write-Host "Make sure Hardhat node is running in another terminal" -ForegroundColor Yellow
}
