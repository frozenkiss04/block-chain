import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-wine-700' : '';
  };

  return (
    <nav className="bg-wine-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">🍷</span>
            Truy Xuất Rượu Vang Cao Cấp
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md hover:bg-wine-700 transition ${isActive('/')}`}
              >
                Trang chủ
              </Link>
              <Link
                to="/vineyards"
                className={`px-4 py-2 rounded-md hover:bg-wine-700 transition ${isActive('/vineyards')}`}
              >
                Danh sách vườn nho
              </Link>
              <Link
                to="/register-vineyard"
                className={`px-4 py-2 rounded-md hover:bg-wine-700 transition ${isActive('/register-vineyard')}`}
              >
                Đăng ký vườn nho
              </Link>
              <Link
                to="/upload"
                className={`px-4 py-2 rounded-md hover:bg-wine-700 transition ${isActive('/upload')}`}
              >
                Upload
              </Link>
              <Link
                to="/traceability"
                className={`px-4 py-2 rounded-md hover:bg-wine-700 transition ${isActive('/traceability')}`}
              >
                Truy xuất nguồn gốc
              </Link>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
