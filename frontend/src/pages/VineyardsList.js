import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'react-toastify';

const VineyardsList = () => {
  const { contract, account } = useWeb3();
  const [vineyards, setVineyards] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVineyards = async () => {
    if (!contract) {
      toast.error('Vui lòng kết nối MetaMask!');
      return;
    }

    setLoading(true);
    try {
      const filter = contract.filters.VineyardRegistered();
      const events = await contract.queryFilter(filter);
      
      const vineyardList = await Promise.all(
        events.map(async (event) => {
          const vineyardId = event.args.vineyardId.toString();
          
          try {
            const vineyardInfo = await contract.getVineyard(vineyardId);
            
            return {
              id: vineyardId,
              name: vineyardInfo[1],
              owner: vineyardInfo[2],
              grapeVariety: vineyardInfo[3],
              latitude: vineyardInfo[4],
              longitude: vineyardInfo[5],
              timestamp: new Date(Number(vineyardInfo[6]) * 1000).toLocaleString(),
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash
            };
          } catch (err) {
            console.error(`Error loading vineyard ${vineyardId}:`, err);
            return null;
          }
        })
      );

      setVineyards(vineyardList.filter(v => v !== null).reverse());
      toast.success(`Đã tải ${vineyardList.filter(v => v !== null).length} vườn nho!`);
    } catch (error) {
      console.error('Error loading vineyards:', error);
      toast.error('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      loadVineyards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Cần kết nối MetaMask</h2>
          <p>Vui lòng kết nối ví MetaMask để xem danh sách vườn nho.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Vườn Nho</h1>
        <button
          onClick={loadVineyards}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {loading && vineyards.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách vườn nho...</p>
        </div>
      ) : vineyards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">Chưa có vườn nho nào được đăng ký</p>
          <a
            href="/register-vineyard"
            className="inline-block px-6 py-3 bg-wine-600 text-white rounded-lg hover:bg-wine-700 transition-colors"
          >
            Đăng ký vườn nho đầu tiên
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vineyards.map((vineyard) => (
            <div
              key={vineyard.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-wine-800">{vineyard.name}</h2>
                <span className="bg-wine-100 text-wine-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  ID: {vineyard.id}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Chủ sở hữu</p>
                  <p className="font-semibold text-gray-800">{vineyard.owner}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Giống nho</p>
                  <p className="font-semibold text-gray-800">{vineyard.grapeVariety}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Vị trí</p>
                  <p className="text-sm font-mono text-gray-700">
                    {vineyard.latitude}, {vineyard.longitude}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Ngày đăng ký</p>
                  <p className="text-sm text-gray-700">{vineyard.timestamp}</p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Block: {vineyard.blockNumber}</p>
                  <p className="text-xs text-gray-500 font-mono truncate">
                    TX: {vineyard.transactionHash}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href={`/upload?vineyardId=${vineyard.id}`}
                  className="block text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upload quy trình
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VineyardsList;
