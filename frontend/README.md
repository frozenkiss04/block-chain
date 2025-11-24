# Wine Traceability Frontend

Frontend React app cho hệ thống truy xuất nguồn gốc rượu vang cao cấp.

## Cài đặt

```bash
npm install
```

## Cấu hình

File `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Chạy App

Development mode:
```bash
npm start
```

Build production:
```bash
npm run build
```

## Tính năng

- **Trang chủ**: Giới thiệu hệ thống
- **Quản lý vườn nho**: CRUD vườn nho (thêm, sửa, xóa)
- **Upload quy trình**: Upload file PDF/ảnh/video lên IPFS
- **Truy xuất nguồn gốc**: Xem chi tiết vườn nho và quy trình ủ

## Công nghệ

- ReactJS 18
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify
