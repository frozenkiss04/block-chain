# Wine Traceability - Smart Contract Integration

## 🎯 Luồng hoạt động hoàn chỉnh:

```
┌─────────────┐
│ 1. Upload   │ → User chọn file + điền thông tin
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ 2. Upload file → IPFS   │ → File lưu vào IPFS node
└──────┬──────────────────┘
       │
       ▼ Nhận được CID (VD: QmX...)
       │
┌─────────────────────────┐
│ 3. Lưu MySQL            │ → Metadata + CID vào database
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ 4. Ghi Smart Contract   │ → CID lưu lên blockchain (bất biến)
└──────┬──────────────────┘
       │
       ▼ Nhận tx_hash + block_number
       │
┌─────────────────────────┐
│ 5. Update MySQL         │ → Lưu tx_hash để verify sau này
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ 6. Trả về Frontend      │ → Hiển thị CID + TX hash
└─────────────────────────┘
```

## 📦 Đã tạo:

### Smart Contract
- `contracts/WineTraceability.sol` - Solidity contract với functions:
  - `registerVineyard()` - Đăng ký vườn nho
  - `addProcess()` - Lưu CID + metadata quy trình
  - `getProcessIPFSCid()` - Lấy CID từ blockchain
  - `verifyIPFSCid()` - Verify tính toàn vẹn

### Backend Integration
- `backend/config/blockchain.js` - Web3 connection với ethers.js
- `backend/services/blockchainService.js` - Service layer tương tác contract
- `backend/controllers/processController.js` - Upload → IPFS → Blockchain
- `backend/controllers/vineyardController.js` - Tạo vineyard → Blockchain

### Database
- Thêm cột `tx_hash` và `block_number` vào cả 2 bảng:
  - `vineyards`
  - `fermentation_processes`

### Frontend
- `frontend/src/pages/Traceability.js` - Hiển thị:
  - IPFS CID
  - Transaction hash
  - Block number
  - Link xem/tải file từ IPFS gateway

## 🚀 Hướng dẫn Deploy:

### Bước 1: Cài đặt Ganache

```powershell
# Download Ganache từ: https://trufflesuite.com/ganache/
# Chạy Ganache GUI → Mặc định http://127.0.0.1:8545
```

### Bước 2: Deploy Smart Contract

```powershell
cd D:\Blockchain\contracts
npm install
npm run deploy:ganache
```

**Kết quả:** Contract address + ABI tự động lưu vào `backend/config/contract.json`

### Bước 3: Cấu hình Backend

Copy private key từ Ganache và update `backend/.env`:

```env
BLOCKCHAIN_ENABLED=true
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x... (lấy từ output deploy)
PRIVATE_KEY=0x... (lấy từ Ganache)
```

### Bước 4: Cài ethers.js

```powershell
cd D:\Blockchain\backend
npm install
```

### Bước 5: Chạy hệ thống

**Terminal 1 - IPFS:**
```powershell
cd C:\Users\FPT\Downloads\kubo_v0.38.2_windows-amd64\kubo
.\ipfs.exe daemon
```

**Terminal 2 - Ganache:**
- Mở Ganache GUI
- Click "Quickstart" để chạy blockchain local

**Terminal 3 - Backend:**
```powershell
cd D:\Blockchain\backend
npm start
```

**Terminal 4 - Frontend:**
```powershell
cd D:\Blockchain\frontend
npm start
```

## 📋 Kiểm tra hoạt động:

1. **Tạo vườn nho mới** → Check console backend xem có TX hash
2. **Upload file** → File lên IPFS → CID lên blockchain → Check traceability page
3. **Xem chi tiết** → Thấy IPFS CID + Blockchain TX + Block number
4. **Verify on Ganache** → Mở Ganache → Tab "Blocks" → Thấy transactions

## 🔍 Debug:

### Nếu không có TX hash:
```powershell
# Check backend console:
# - "⚠️ Blockchain disabled" → Kiểm tra .env BLOCKCHAIN_ENABLED=true
# - "❌ Blockchain ... failed" → Kiểm tra Ganache đang chạy
# - "PRIVATE_KEY not found" → Kiểm tra .env có PRIVATE_KEY
```

### Verify contract trên Ganache:
1. Mở Ganache → Tab "Contracts"
2. Tìm contract address (từ .env CONTRACT_ADDRESS)
3. Tab "Transactions" → Thấy mỗi lần upload có 1 transaction mới

## 🎓 Giải thích luồng Upload → IPFS → Blockchain:

```javascript
// STEP 1: Upload file → IPFS
const fileBuffer = fs.readFileSync(file);
const ipfsResponse = await axios.post('http://127.0.0.1:5001/api/v0/add', formData);
const ipfsCid = ipfsResponse.data.Hash; // QmX...

// STEP 2: Lưu MySQL (lấy ID)
const [result] = await db.query('INSERT INTO ... VALUES (?, ?, ?, ?)', [...]);
const processId = result.insertId;

// STEP 3: Ghi CID vào Smart Contract
const tx = await contract.addProcess(
  processId,
  vineyardId,
  title,
  description,
  fileName,
  fileType,
  ipfsCid  // ← CID từ IPFS
);
await tx.wait();

// STEP 4: Lưu TX hash vào MySQL
await db.query('UPDATE ... SET tx_hash = ?, block_number = ? WHERE id = ?',
  [tx.hash, receipt.blockNumber, processId]);
```

## 🔗 Lấy file từ blockchain:

```javascript
// Lấy CID từ smart contract
const ipfsCid = await contract.getProcessIPFSCid(processId);

// Truy cập file qua IPFS gateway
const fileUrl = `http://127.0.0.1:8080/ipfs/${ipfsCid}`;
```

## 💡 Lợi ích:

1. **Immutability**: CID lưu trên blockchain không thể thay đổi
2. **Traceability**: Mỗi file có TX hash để audit
3. **Decentralization**: File trên IPFS, không phụ thuộc server trung tâm
4. **Verification**: Có thể verify CID trên blockchain vs file thật

## 📊 Thống kê Smart Contract:

```javascript
const stats = await contract.getStats();
// totalVineyards: số lượng vườn nho trên blockchain
// totalProcesses: số lượng quy trình trên blockchain
```

## 🎯 Production Deployment:

Thay Ganache bằng:
- **Sepolia Testnet** (free, public)
- **Polygon** (low gas fees)
- **BSC** (fast, cheap)

Update `.env`:
```env
BLOCKCHAIN_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=0x... (MetaMask private key)
```
