import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import { getIPFSUrl } from '../utils/ipfs';

const TraceabilityWeb3 = () => {
  const { contract, account } = useWeb3();
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [viewingFile, setViewingFile] = useState(false);

  // Lấy danh sách processes từ blockchain
  const loadProcesses = async () => {
    if (!contract) {
      toast.error('Vui lòng kết nối MetaMask trước!');
      return;
    }

    setLoading(true);
    try {
      // Lắng nghe events để lấy danh sách processes
      const filter = contract.filters.ProcessAdded();
      const events = await contract.queryFilter(filter);
      
      const processList = await Promise.all(
        events.map(async (event) => {
          const processId = event.args.processId.toString();
          
          try {
            // Lấy thông tin từ contract
            const processInfo = await contract.getProcess(processId);
            
            // Get IPFS CID from contract
            const ipfsCid = await contract.getProcessIPFSCid(processId);
            
            return {
              id: processId,
              vineyardId: processInfo[1].toString(),
              title: processInfo[2],
              description: processInfo[3],
              fileName: processInfo[4],
              fileType: processInfo[5],
              ipfsCid: ipfsCid,
              timestamp: new Date(Number(processInfo[6]) * 1000).toLocaleString(),
              createdBy: processInfo[7],
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash
            };
          } catch (err) {
            console.error(`Error loading process ${processId}:`, err);
            return null;
          }
        })
      );

      setProcesses(processList.filter(p => p !== null).reverse());
      toast.success(`Đã tải ${processList.filter(p => p !== null).length} quy trình từ blockchain!`);
    } catch (error) {
      console.error('Error loading processes:', error);
      toast.error('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm process theo ID
  const searchProcess = async () => {
    if (!contract || !searchId) {
      toast.error('Vui lòng nhập ID quy trình!');
      return;
    }

    setLoading(true);
    try {
      const processInfo = await contract.getProcess(searchId);
      
      // Get IPFS CID
      const ipfsCid = await contract.getProcessIPFSCid(searchId);
      
      // Lấy thông tin từ event
      const filter = contract.filters.ProcessAdded(searchId);
      const events = await contract.queryFilter(filter);
      
      if (events.length > 0) {
        const event = events[0];
        setSelectedProcess({
          id: searchId,
          vineyardId: processInfo[1].toString(),
          title: processInfo[2],
          description: processInfo[3],
          fileName: processInfo[4],
          fileType: processInfo[5],
          ipfsCid: ipfsCid,
          timestamp: new Date(Number(processInfo[6]) * 1000).toLocaleString(),
          createdBy: processInfo[7],
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash
        });
        toast.success('Đã tìm thấy quy trình!');
      }
    } catch (error) {
      console.error('Error searching process:', error);
      toast.error('Lỗi khi tìm kiếm: ' + error.message);
      setSelectedProcess(null);
    } finally {
      setLoading(false);
    }
  };

  // Xem file từ IPFS
  const viewFile = async (processId) => {
    if (!contract) return;

    setViewingFile(true);
    try {
      toast.info('📥 Đang lấy IPFS CID từ blockchain...');
      const ipfsCid = await contract.getProcessIPFSCid(processId);
      
      if (!ipfsCid) {
        toast.error('Không tìm thấy IPFS CID cho process này');
        setViewingFile(false);
        return;
      }

      // Generate IPFS gateway URL
      const ipfsUrl = getIPFSUrl(ipfsCid);
      
      toast.success(`🌐 Đang mở IPFS: ${ipfsCid.substring(0, 15)}...`);
      
      // Open IPFS URL in new tab
      const newWindow = window.open(ipfsUrl, '_blank');
      if (!newWindow) {
        toast.warning('Pop-up bị chặn. Vui lòng cho phép pop-up.');
        // Show URL to user if popup blocked
        toast.info(`URL: ${ipfsUrl}`, { autoClose: false });
      }
      
      toast.success('✅ File đã được mở!');
    } catch (error) {
      console.error('Error viewing file:', error);
      toast.error('Lỗi khi tải file: ' + error.message);
    } finally {
      setViewingFile(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      loadProcesses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🔍 Truy Xuất Nguồn Gốc (Blockchain)
      </h1>

      {!account ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 text-lg">
            ⚠️ Vui lòng kết nối MetaMask để sử dụng tính năng này
          </p>
        </div>
      ) : (
        <>
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tìm kiếm theo ID
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Nhập Process ID..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={searchProcess}
                disabled={loading || !searchId}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </div>
          </div>

          {/* Selected Process Detail */}
          {selectedProcess && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📋 Chi tiết quy trình #{selectedProcess.id}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vineyard ID</p>
                  <p className="font-semibold">{selectedProcess.vineyardId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tiêu đề</p>
                  <p className="font-semibold">{selectedProcess.title}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Mô tả</p>
                  <p className="font-semibold">{selectedProcess.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tên file</p>
                  <p className="font-semibold">{selectedProcess.fileName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Loại file</p>
                  <p className="font-semibold">{selectedProcess.fileType}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">IPFS CID</p>
                  <p className="font-mono text-sm break-all bg-blue-50 p-2 rounded border border-blue-200">
                    {selectedProcess.ipfsCid}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời gian</p>
                  <p className="font-semibold">{selectedProcess.timestamp}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Tạo bởi</p>
                  <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded">
                    {selectedProcess.createdBy}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Block Number</p>
                  <p className="font-semibold">{selectedProcess.blockNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction Hash</p>
                  <p className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
                    {selectedProcess.transactionHash}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => viewFile(selectedProcess.id)}
                  disabled={viewingFile}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {viewingFile ? '⏳ Đang tải...' : '👁️ Xem file'}
                </button>
              </div>
            </div>
          )}

          {/* All Processes List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                📦 Tất cả quy trình trên Blockchain
              </h2>
              <button
                onClick={loadProcesses}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? '⏳ Đang tải...' : '🔄 Làm mới'}
              </button>
            </div>

            {loading && processes.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu từ blockchain...</p>
              </div>
            ) : processes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">📭 Chưa có quy trình nào trên blockchain</p>
                <p className="text-sm mt-2">Upload quy trình đầu tiên tại trang Upload</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vineyard
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IPFS CID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Block
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {processes.map((process) => (
                      <tr key={process.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{process.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {process.vineyardId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {process.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {process.fileType}
                          </span>
                          <br />
                          <span className="text-xs">{process.fileName}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                          <span className="text-xs bg-blue-50 px-2 py-1 rounded border border-blue-200">
                            {process.ipfsCid ? process.ipfsCid.substring(0, 15) + '...' : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {process.blockNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => viewFile(process.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            👁️ Xem
                          </button>
                          <button
                            onClick={() => {
                              setSearchId(process.id);
                              setSelectedProcess(process);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            📋 Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TraceabilityWeb3;
