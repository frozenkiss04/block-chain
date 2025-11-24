import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-wine-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-wine-800 mb-4">
            Hệ Thống Truy Xuất Nguồn Gốc Rượu Vang Cao Cấp
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Quản lý vườn nho, lưu trữ quy trình ủ rượu trên IPFS và truy xuất nguồn gốc minh bạch
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/vineyards"
              className="bg-wine-600 text-white px-8 py-3 rounded-lg hover:bg-wine-700 transition font-semibold"
            >
              Quản lý vườn nho
            </Link>
            <Link
              to="/traceability"
              className="bg-white text-wine-600 px-8 py-3 rounded-lg border-2 border-wine-600 hover:bg-wine-50 transition font-semibold"
            >
              Truy xuất nguồn gốc
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🏞️</div>
            <h3 className="text-2xl font-bold text-wine-700 mb-3">Quản lý vườn nho</h3>
            <p className="text-gray-600">
              Lưu trữ thông tin chi tiết về vườn nho: tên, tọa độ GPS, giống nho, chủ sở hữu. 
              Hỗ trợ thêm, sửa, xóa dữ liệu dễ dàng.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-2xl font-bold text-wine-700 mb-3">Upload quy trình ủ</h3>
            <p className="text-gray-600">
              Tải lên tài liệu quy trình ủ rượu (PDF, ảnh, video) lên IPFS. 
              Lưu trữ phi tập trung, an toàn và minh bạch.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-wine-700 mb-3">Truy xuất nguồn gốc</h3>
            <p className="text-gray-600">
              Xem thông tin chi tiết về vườn nho, quy trình ủ rượu và truy cập tài liệu 
              từ IPFS bất cứ lúc nào.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-wine-800 mb-6 text-center">
            Công nghệ sử dụng
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">⚛️</div>
              <h4 className="font-bold text-lg text-gray-800">ReactJS</h4>
              <p className="text-gray-600 text-sm">Frontend framework</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🟢</div>
              <h4 className="font-bold text-lg text-gray-800">Node.js + Express</h4>
              <p className="text-gray-600 text-sm">Backend API</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🗄️</div>
              <h4 className="font-bold text-lg text-gray-800">MySQL</h4>
              <p className="text-gray-600 text-sm">Database</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📦</div>
              <h4 className="font-bold text-lg text-gray-800">IPFS</h4>
              <p className="text-gray-600 text-sm">Decentralized storage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
