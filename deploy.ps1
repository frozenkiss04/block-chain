#!/usr/bin/env pwsh
# Deploy Smart Contract to Localhost
Write-Host "Deploying Contract to Hardhat Localhost..." -ForegroundColor Cyan
Set-Location D:\Blockchain\contracts
npm run deploy:localhost
Write-Host "Deployment Complete!" -ForegroundColor Green
