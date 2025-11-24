# 🍷 Wine Traceability Blockchain DApp

## 🚀 Quick Start Scripts

### 1️⃣ Start Hardhat Node (Terminal 1)
```powershell
.\start-node.ps1
```
Chạy Hardhat local blockchain trên `http://127.0.0.1:8545`

### 2️⃣ Deploy Contract (Terminal 2)
```powershell
.\deploy.ps1
```
Deploy smart contract và lưu config vào `frontend/src/contracts/WineTraceability.json`

### 3️⃣ Start Frontend (Terminal 3)
```powershell
.\start-frontend.ps1
```
Chạy React app trên `http://localhost:3000`

### 🎯 All-in-One (Deploy + Frontend)
```powershell
.\start-all.ps1
```
Tự động deploy và start frontend (cần Hardhat node đang chạy)

---

## 📂 Project Structure
```
D:\Blockchain\
├── contracts/              # Smart Contracts (Hardhat)
│   ├── contracts/
│   │   └── WineTraceability.sol
│   └── scripts/
│       └── deploy-localhost.js
│
├── frontend/               # React DApp
│   ├── src/
│   │   ├── contexts/Web3Context.js
│   │   ├── pages/
│   │   │   ├── RegisterVineyard.js
│   │   │   ├── UploadWeb3.js
│   │   │   └── TraceabilityWeb3.js
│   │   └── contracts/WineTraceability.json (auto-generated)
│
└── Scripts:
    ├── start-node.ps1      # Hardhat node
    ├── deploy.ps1          # Deploy contract
    ├── start-frontend.ps1  # Start React
    └── start-all.ps1       # Deploy + Frontend
```

---

## 🔧 Setup MetaMask

### Add Hardhat Network:
- **Network Name:** Hardhat Localhost
- **RPC URL:** http://127.0.0.1:8545
- **Chain ID:** 31337
- **Currency Symbol:** ETH

### Import Test Account:
```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Balance: 10000 ETH
```

---

## 📝 Features

- ✅ **100% Decentralized** - No backend, pure Web3
- ✅ **On-chain Storage** - Files stored directly on blockchain (Base64)
- ✅ **MetaMask Integration** - Transaction signing via MetaMask
- ✅ **Smart Contract** - Immutable wine traceability records
- ✅ **React Frontend** - Modern UI with ethers.js

---

## 🎯 Workflow

1. **Register Vineyard** → Get Vineyard ID
2. **Upload File** (<2MB) → Convert to Base64 → Store on blockchain
3. **Traceability** → Read data directly from blockchain

---

## 📌 Current Contract Address
Check `frontend/src/contracts/WineTraceability.json` for latest address (auto-updated on deploy)
