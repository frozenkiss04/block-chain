#!/usr/bin/env pwsh
# Complete Setup: Deploy & Start Frontend
Write-Host "Complete Setup Starting..." -ForegroundColor Yellow
Write-Host ""

# Deploy Contract
Write-Host "Step 1: Deploying Contract..." -ForegroundColor Cyan
Set-Location D:\Blockchain\contracts
npm run deploy:localhost

if ($LASTEXITCODE -eq 0) {
    Write-Host "Contract deployed successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Start Frontend
    Write-Host "Step 2: Starting Frontend..." -ForegroundColor Cyan
    Set-Location D:\Blockchain\frontend
    npm start
} else {
    Write-Host "Deployment failed! Please check Hardhat node is running." -ForegroundColor Red
    Write-Host "Run: .\start-node.ps1 first" -ForegroundColor Yellow
}
