import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'react-toastify';

const RegisterVineyard = () => {
  const { contract, account } = useWeb3();
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    grapeVariety: '',
    latitude: '',
    longitude: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error('Vui lòng kết nối MetaMask!');
      return;
    }

    setSubmitting(true);

    try {
      // Get next vineyard ID
      const vineyardCount = await contract.vineyardCount();
      const nextVineyardId = Number(vineyardCount) + 1;

      toast.info('🔗 Đang đăng ký vineyard lên blockchain...');
      
      const tx = await contract.registerVineyard(
        nextVineyardId,
        formData.name,
        formData.owner,
        formData.grapeVariety,
        formData.latitude,
        formData.longitude
      );

      toast.info(`📝 Transaction: ${tx.hash.substring(0, 10)}...`);
      
      const receipt = await tx.wait();
      
      toast.success(
        `🎉 Vineyard đã được đăng ký!\nID: ${nextVineyardId}\nBlock: ${receipt.blockNumber}`
      );

      // Reset form
      setFormData({
        name: '',
        owner: '',
        grapeVariety: '',
        latitude: '',
        longitude: ''
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        toast.error('❌ Giao dịch bị từ chối');
      } else {
        toast.error(`❌ Lỗi: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">🦊 Cần kết nối MetaMask</h2>
          <p>Vui lòng kết nối ví MetaMask để đăng ký vineyard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-wine-800 mb-6">🍇 Đăng Ký Vườn Nho</h1>

        <div className="bg-blue-50 border border-blue-400 text-blue-800 px-4 py-3 rounded mb-6">
          <p className="font-semibold">📝 Thông tin vineyard sẽ được lưu trên blockchain</p>
          <p className="text-sm mt-1">Địa chỉ: <span className="font-mono">{account.substring(0, 10)}...{account.substring(account.length - 8)}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Tên Vườn Nho <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
              placeholder="VD: Vườn Nho Đà Lạt"
              required
              disabled={submitting}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Chủ Sở Hữu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
              placeholder="VD: Nguyễn Văn A"
              required
              disabled={submitting}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Giống Nho <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="grapeVariety"
              value={formData.grapeVariety}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
              placeholder="VD: Chardonnay, Merlot, Cabernet Sauvignon"
              required
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Vĩ Độ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                placeholder="VD: 11.9404"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Kinh Độ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                placeholder="VD: 108.4583"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-wine-600 hover:bg-wine-700 transform hover:scale-105'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              '🚀 Đăng Ký Vineyard'
            )}
          </button>
        </form>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">📝 Lưu ý:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Thông tin vineyard được lưu vĩnh viễn trên blockchain</li>
            <li>• Bạn cần vineyard ID để upload quy trình sản xuất</li>
            <li>• Phí gas sẽ được trừ từ ví MetaMask</li>
            <li>• ID vineyard sẽ tự động tăng dần</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterVineyard;
