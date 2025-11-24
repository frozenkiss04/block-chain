<<<<<<< HEAD
# block-chain
=======
# 🍷 Hệ Thống Truy Xuất Nguồn Gốc Rượu Vang Cao Cấp

Ứng dụng web hoàn chỉnh để quản lý vườn nho, lưu trữ quy trình ủ rượu trên IPFS và truy xuất nguồn gốc minh bạch.

## 📋 Tính năng

- ✅ **Quản lý vườn nho**: CRUD đầy đủ (thêm, sửa, xóa, xem danh sách)
- ✅ **Upload quy trình ủ**: Upload PDF/ảnh/video lên IPFS, lưu metadata vào MySQL
- ✅ **Truy xuất nguồn gốc**: Hiển thị chi tiết vườn nho, quy trình và link IPFS
- ✅ **Lưu trữ phi tập trung**: Sử dụng IPFS để lưu file
- ✅ **Giao diện thân thiện**: Sử dụng Tailwind CSS
- ✅ **Auto-migration**: Tự động tạo bảng database khi khởi động

## 🛠️ Công nghệ sử dụng

### Frontend
- ReactJS 18
- React Router DOM 6
- Axios
- Tailwind CSS
- React Toastify

### Backend
- Node.js + Express
- MySQL2
- Axios + Form-Data (IPFS upload)
- Multer (upload files)
- CORS, dotenv

### Storage
- MySQL (metadata)
- IPFS/Kubo (file storage)

## 📁 Cấu trúc thư mục

```
Blockchain/
├── backend/
│   ├── config/
│   │   ├── database.js       # Cấu hình MySQL
│   │   └── ipfs.js           # Cấu hình IPFS client
│   ├── controllers/
│   │   ├── vineyardController.js
│   │   ├── processController.js
│   │   └── traceabilityController.js
│   ├── routes/
│   │   ├── vineyardRoutes.js
│   │   ├── processRoutes.js
│   │   └── traceabilityRoutes.js
│   ├── database/
│   │   └── schema.sql         # Database schema
│   ├── uploads/               # Thư mục lưu file tạm
│   ├── .env                   # Biến môi trường
│   ├── package.json
│   └── server.js              # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Vineyards.js
    │   │   ├── Upload.js
    │   │   └── Traceability.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 16+ và npm
- MySQL Server 5.7+
- IPFS/Kubo (để upload file lên IPFS thật)

---

## 📝 TỔNG KẾT CÁC LỆNH ĐÃ CHẠY

### Bước 1: Cài đặt MySQL và cấu hình

```bash
# Tạo database (database sẽ tự động tạo bảng khi backend khởi động)
mysql -u root -pphan1804 -e "CREATE DATABASE IF NOT EXISTS wine_traceability;"
```

**Cấu hình backend/.env:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=phan1804
DB_NAME=wine_traceability
DB_PORT=3306
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
```

---

### Bước 2: Cài đặt IPFS/Kubo

**Download Kubo (IPFS CLI):**
1. Truy cập: https://dist.ipfs.tech/#kubo
2. Download file **kubo_vX.X.X_windows-amd64.zip**
3. Giải nén vào thư mục (ví dụ: `C:\Users\FPT\Downloads\kubo_v0.38.2_windows-amd64\kubo`)

**Khởi tạo IPFS (chỉ chạy 1 lần đầu):**
```powershell
cd C:\Users\FPT\Downloads\kubo_v0.38.2_windows-amd64\kubo
.\ipfs.exe init
```

**Cấu hình CORS cho IPFS API:**
```powershell
.\ipfs.exe config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'
.\ipfs.exe config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"POST\", \"GET\"]'
```

**Chạy IPFS daemon (giữ terminal này mở):**
```powershell
.\ipfs.exe daemon
```

Output thành công:
```
RPC API server listening on /ip4/127.0.0.1/tcp/5001
WebUI: http://127.0.0.1:5001/webui
Gateway server listening on /ip4/127.0.0.1/tcp/8080
Daemon is ready
```

---

### Bước 3: Cài đặt Backend

**Terminal mới - Backend:**
```bash
# Di chuyển vào thư mục backend
cd D:\Blockchain\backend

# Cài đặt dependencies
npm install

# Chạy server (backend sẽ tự động tạo bảng trong database)
npm start
```

Output thành công:
```
Initializing database...
✓ Table "vineyards" created/verified
✓ Table "fermentation_processes" created/verified
✓ Sample data already exists
Database initialization completed successfully!
Server is running on port 5000
API endpoint: http://localhost:5000/api
```

Backend chạy tại: **http://localhost:5000**

---

### Bước 4: Cài đặt Frontend

**Terminal mới - Frontend:**
```bash
# Di chuyển vào thư mục frontend
cd D:\Blockchain\frontend

# Cài đặt dependencies
npm install

# Chạy React app
npm start
```

Frontend chạy tại: **http://localhost:3000**

---

## ✅ Kiểm tra hệ thống hoạt động

### 1. Kiểm tra IPFS
```powershell
# Kiểm tra IPFS daemon
curl http://127.0.0.1:5001/api/v0/version
```

### 2. Kiểm tra Backend
- Truy cập: http://localhost:5000/api/health
- Response: `{"status":"OK","message":"Wine Traceability API is running"}`

### 3. Kiểm tra Frontend
- Truy cập: http://localhost:3000
- Thấy trang chủ hệ thống

---

## 🎯 Thứ tự chạy ứng dụng

**Mỗi lần sử dụng, chạy theo thứ tự:**

1. **Terminal 1 - IPFS Daemon:**
```powershell
cd C:\Users\FPT\Downloads\kubo_v0.38.2_windows-amd64\kubo
.\ipfs.exe daemon
```

2. **Terminal 2 - Backend:**
```bash
cd D:\Blockchain\backend
npm start
```

3. **Terminal 3 - Frontend:**
```bash
cd D:\Blockchain\frontend
npm start
```

4. **Truy cập:** http://localhost:3000

---

## 📦 Các dependencies đã cài

### Backend (package.json)
```json
{
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "axios": "^1.6.2",
    "form-data": "^4.0.0",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.6.5"
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "react-toastify": "^9.1.3",
    "tailwindcss": "^3.3.6"
  }
}
```

## 🎯 Sử dụng ứng dụng

### 1. Quản lý vườn nho
- Truy cập: http://localhost:3000/vineyards
- Thêm vườn nho mới với thông tin: tên, tọa độ GPS, giống nho, chủ sở hữu
- Sửa/Xóa vườn nho hiện có
- Xem vị trí trên Google Maps

### 2. Upload quy trình ủ
- Truy cập: http://localhost:3000/upload
- Chọn vườn nho
- Nhập tiêu đề và mô tả
- Upload file (PDF, ảnh, video - tối đa 100MB)
- Hệ thống sẽ upload lên IPFS và trả về CID thật
- Ví dụ CID: `QmczLpBPBczUQ4UTDnSXiBDHUsz4BgMk99a5mp8bASzoiP`

### 3. Truy xuất nguồn gốc
- Truy cập: http://localhost:3000/traceability
- Xem danh sách tất cả vườn nho
- Click "Xem chi tiết" để xem thông tin vườn nho và quy trình ủ
- Click "Xem trên IPFS Local" để xem file từ gateway local (http://localhost:8080)
- Click "Xem trên IPFS.io" để xem file từ gateway công khai

### 4. Xem file từ IPFS
**Local Gateway (nhanh):**
```
http://localhost:8080/ipfs/QmczLpBPBczUQ4UTDnSXiBDHUsz4BgMk99a5mp8bASzoiP
```

**Public Gateway (chậm hơn nhưng không cần daemon):**
```
https://ipfs.io/ipfs/QmczLpBPBczUQ4UTDnSXiBDHUsz4BgMk99a5mp8bASzoiP
```

## 🔌 API Endpoints

### Vineyard APIs
```
GET    /api/vineyards          - Lấy danh sách vườn nho
GET    /api/vineyards/:id      - Lấy chi tiết vườn nho
POST   /api/vineyards          - Tạo vườn nho mới
PUT    /api/vineyards/:id      - Cập nhật vườn nho
DELETE /api/vineyards/:id      - Xóa vườn nho
```

### Process APIs
```
GET    /api/processes                   - Lấy tất cả quy trình
GET    /api/processes/:id               - Lấy chi tiết quy trình
GET    /api/processes/vineyard/:id     - Lấy quy trình theo vườn nho
POST   /api/processes/upload            - Upload file lên IPFS
DELETE /api/processes/:id               - Xóa quy trình
```

### Traceability APIs
```
GET    /api/traceability        - Lấy tất cả dữ liệu truy xuất
GET    /api/traceability/:id    - Lấy truy xuất theo vườn nho
```

## 🗄️ Database Schema

### Table: vineyards
```sql
id              INT (PK, AUTO_INCREMENT)
name            VARCHAR(255)
latitude        DECIMAL(10,8)
longitude       DECIMAL(11,8)
grape_variety   VARCHAR(255)
owner           VARCHAR(255)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Table: fermentation_processes
```sql
id              INT (PK, AUTO_INCREMENT)
vineyard_id     INT (FK -> vineyards.id)
title           VARCHAR(255)
description     TEXT
file_name       VARCHAR(255)
file_type       VARCHAR(100)
ipfs_cid        VARCHAR(255)
created_at      TIMESTAMP
```

## 🔧 Cấu hình

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=        # Điền mật khẩu MySQL
DB_NAME=wine_traceability
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Lỗi kết nối MySQL
```
Error: ER_ACCESS_DENIED_ERROR
```
**Giải pháp**: Kiểm tra username/password trong `backend/.env`

### Lỗi latitude out of range
```
Out of range value for column 'latitude'
```
**Giải pháp**: Đã sửa trong code - latitude dùng DECIMAL(11,8) thay vì DECIMAL(10,8)

### IPFS upload thất bại
```
⚠ IPFS upload failed: connect ECONNREFUSED
```
**Giải pháp**: 
- Kiểm tra IPFS daemon có chạy: `.\ipfs.exe daemon`
- Đảm bảo API listening tại 127.0.0.1:5001
- Đã cấu hình CORS cho IPFS API

### CID là local-storage-xxx
**Nguyên nhân**: IPFS daemon chưa chạy hoặc backend chưa kết nối được
**Giải pháp**:
1. Khởi động IPFS daemon
2. Khởi động lại backend SAU KHI IPFS đã chạy
3. Upload file mới (file cũ vẫn có CID giả)

### Port đã được sử dụng
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Giải pháp**: 
- Dừng process đang dùng port 5000
- Hoặc đổi PORT trong backend/.env

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Giải pháp**: Backend đã cấu hình CORS, đảm bảo backend đang chạy

## 📝 Lưu ý

1. **IPFS Gateway**: File upload lên IPFS cần thời gian để lan truyền trên mạng. Nếu không thấy file ngay, hãy đợi vài phút.

2. **File Size Limit**: Giới hạn upload 100MB (có thể thay đổi trong `backend/routes/processRoutes.js`)

3. **Sample Data**: Database schema đã bao gồm 3 vườn nho mẫu để test

4. **Production**: Khi deploy production, cần:
   - Thay đổi URL trong `.env` files
   - Sử dụng IPFS pinning service (Pinata, Infura)
   - Bật HTTPS
   - Secure database credentials

## 👨‍💻 Phát triển thêm

Có thể mở rộng với:
- Xác thực người dùng (JWT)
- Blockchain integration (Ethereum, Polygon)
- QR Code generation cho mỗi sản phẩm
- Mobile app (React Native)
- Export báo cáo PDF

## 📄 License

MIT License

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue.

---

**Chúc bạn sử dụng ứng dụng hiệu quả! 🍷**
>>>>>>> 1dfe237 (First commit)
