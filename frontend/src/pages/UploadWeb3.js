import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { uploadToIPFS, getIPFSUrl, checkIPFSConnection } from '../utils/ipfs';

const UploadWeb3 = () => {
  const { contract, account } = useWeb3();
  const [searchParams] = useSearchParams();
  const [vineyardId, setVineyardId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [vineyards, setVineyards] = useState([]);
  const [loadingVineyards, setLoadingVineyards] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Giới hạn kích thước file (2MB) vì lưu trên blockchain
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error('File quá lớn! Vui lòng chọn file dưới 2MB');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  // Load vineyards from blockchain
  const loadVineyards = async () => {
    if (!contract) return;

    setLoadingVineyards(true);
    try {
      // Try loading from events first
      try {
        const filter = contract.filters.VineyardRegistered();
        const events = await contract.queryFilter(filter);
        
        if (events.length > 0) {
          const vineyardList = await Promise.all(
            events.map(async (event) => {
              const vineyardId = event.args.vineyardId.toString();
              try {
                const vineyardInfo = await contract.getVineyard(vineyardId);
                return {
                  id: vineyardId,
                  name: vineyardInfo[1],
                  owner: vineyardInfo[2],
                  grapeVariety: vineyardInfo[3]
                };
              } catch (err) {
                console.error(`Error loading vineyard ${vineyardId}:`, err);
                return null;
              }
            })
          );

          setVineyards(vineyardList.filter(v => v !== null));
          return;
        }
      } catch (eventError) {
        console.log('Events not available, trying direct count...', eventError);
      }

      // Fallback: Load by count
      const count = await contract.vineyardCount();
      const vineyardCount = Number(count);
      
      if (vineyardCount > 0) {
        const vineyardList = [];
        for (let i = 1; i <= vineyardCount; i++) {
          try {
            const exists = await contract.vineyardExistsCheck(i);
            if (exists) {
              const vineyardInfo = await contract.getVineyard(i);
              vineyardList.push({
                id: i.toString(),
                name: vineyardInfo[1],
                owner: vineyardInfo[2],
                grapeVariety: vineyardInfo[3]
              });
            }
          } catch (err) {
            console.error(`Error loading vineyard ${i}:`, err);
          }
        }
        setVineyards(vineyardList);
      }
    } catch (error) {
      console.error('Error loading vineyards:', error);
      toast.error('Không thể tải danh sách vineyards');
    } finally {
      setLoadingVineyards(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      loadVineyards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  // Pre-fill vineyard ID from URL params
  useEffect(() => {
    const vineyardIdParam = searchParams.get('vineyardId');
    if (vineyardIdParam) {
      setVineyardId(vineyardIdParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error('Vui lòng kết nối MetaMask!');
      return;
    }

    if (!file || !vineyardId || !title) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setUploading(true);

    try {
      // Step 1: Check IPFS connection
      toast.info('Kiểm tra kết nối IPFS...');
      const ipfsConnected = await checkIPFSConnection();
      if (!ipfsConnected) {
        toast.error('Không thể kết nối IPFS daemon. Hãy chạy: ipfs daemon');
        setUploading(false);
        return;
      }

      // Step 2: Upload file to IPFS
      toast.info('Đang upload file lên IPFS...');
      const ipfsCid = await uploadToIPFS(file);
      console.log('IPFS CID:', ipfsCid);
      toast.success(`File uploaded! CID: ${ipfsCid.substring(0, 15)}...`);

      // Step 3: Check contract connection
      if (!contract) {
        toast.error('Không thể kết nối đến smart contract. Vui lòng reload trang.');
        setUploading(false);
        return;
      }

      // Step 4: Verify vineyard exists
      toast.info('Kiểm tra vineyard...');
      let vineyardExists = false;
      try {
        vineyardExists = await contract.vineyardExistsCheck(vineyardId);
        console.log(`Vineyard ${vineyardId} exists:`, vineyardExists);
        
        if (!vineyardExists) {
          toast.error(`Vineyard ID ${vineyardId} không tồn tại! Vui lòng đăng ký vineyard trước.`);
          setUploading(false);
          return;
        }
      } catch (checkError) {
        console.error('Vineyard check error:', checkError);
        toast.error(`Lỗi kiểm tra vineyard. Hãy chắc vineyard đã được đăng ký.`);
        setUploading(false);
        return;
      }

      // Step 5: Get next process ID
      const processCount = await contract.processCount();
      const nextProcessId = Number(processCount) + 1;
      console.log('Next process ID:', nextProcessId);

      // Step 6: Prepare blockchain transaction
      toast.info('Đang chuẩn bị transaction...');

      // Estimate gas
      let gasEstimate;
      try {
        gasEstimate = await contract.addProcess.estimateGas(
          nextProcessId,
          vineyardId,
          title,
          description || '',
          file.name,
          file.type,
          ipfsCid
        );
        console.log('Gas estimate:', gasEstimate.toString());
        toast.info(`Phí gas ước tính: ${gasEstimate.toString()}`);
      } catch (gasError) {
        console.error('Gas estimation error:', gasError);
        
        // Detailed error logging
        console.log('Error details:', {
          code: gasError.code,
          reason: gasError.reason,
          message: gasError.message,
          data: gasError.data
        });
        
        if (gasError.message.includes('Vineyard does not exist')) {
          toast.error('Vineyard không tồn tại. Hãy đăng ký vineyard trước!');
        } else if (gasError.message.includes('insufficient funds')) {
          toast.error('Không đủ ETH để trả phí gas');
        } else if (gasError.code === 'CALL_EXCEPTION') {
          toast.error('Lỗi gọi contract. Kiểm tra vineyard ID và thử lại.');
        } else {
          toast.error(`Không thể ước tính gas. ${gasError.reason || 'Kiểm tra kết nối Hardhat node'}`);
        }
        setUploading(false);
        return;
      }

      // Step 7: Send transaction to blockchain
      toast.info('Đang lưu CID lên blockchain...');
      const tx = await contract.addProcess(
        nextProcessId,
        vineyardId,
        title,
        description || '',
        file.name,
        file.type,
        ipfsCid,
        {
          gasLimit: gasEstimate
        }
      );

      toast.info(`Transaction: ${tx.hash.substring(0, 10)}...`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Step 8: Show success with IPFS gateway URL
      const ipfsUrl = getIPFSUrl(ipfsCid);
      toast.success(
        `✅ Thành công!\n📦 IPFS CID: ${ipfsCid}\n🌐 URL: ${ipfsUrl}\n⛓️ Block: ${receipt.blockNumber}`,
        { autoClose: 10000 }
      );
      console.log('IPFS Gateway URL:', ipfsUrl);

      // Reset form
      setVineyardId('');
      setTitle('');
      setDescription('');
      setFile(null);
      document.getElementById('file-input').value = '';

    } catch (error) {
      console.error('Upload error:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        toast.error('Giao dịch bị từ chối');
      } else if (error.code === 'CALL_EXCEPTION') {
        toast.error('Lỗi smart contract. Vui lòng kiểm tra lại vineyard ID.');
      } else if (error.message.includes('Vineyard does not exist')) {
        toast.error('Vineyard không tồn tại');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Không đủ ETH để trả phí gas');
      } else if (error.reason) {
        toast.error(`Lỗi: ${error.reason}`);
      } else {
        toast.error(`Lỗi: ${error.message.substring(0, 100)}`);
      }
    } finally {
      setUploading(false);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">🦊 Cần kết nối MetaMask</h2>
          <p>Vui lòng kết nối ví MetaMask để upload file lên blockchain.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-wine-800 mb-6">📤 Upload File Lên Blockchain</h1>

        <div className="bg-blue-50 border border-blue-400 text-blue-800 px-4 py-3 rounded mb-6">
          <p className="font-semibold">🔗 Lưu trữ phi tập trung</p>
          <p className="text-sm">File → Base64 → Smart Contract → Blockchain</p>
          <p className="text-sm mt-1">Địa chỉ: <span className="font-mono">{account.substring(0, 10)}...{account.substring(account.length - 8)}</span></p>
          <p className="text-sm text-red-600 mt-1">⚠️ Giới hạn: File dưới 2MB</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-semibold">
                Vineyard ID <span className="text-red-500">*</span>
              </label>
              {!loadingVineyards && (
                <button
                  type="button"
                  onClick={loadVineyards}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  🔄 Làm mới
                </button>
              )}
            </div>
            {loadingVineyards ? (
              <div className="text-sm text-gray-500">Đang tải danh sách vineyards...</div>
            ) : vineyards.length > 0 ? (
              <select
                value={vineyardId}
                onChange={(e) => setVineyardId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                required
                disabled={uploading}
              >
                <option value="">-- Chọn vườn nho --</option>
                {vineyards.map((v) => (
                  <option key={v.id} value={v.id}>
                    ID {v.id}: {v.name} - {v.grapeVariety} (Chủ: {v.owner})
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type="number"
                  value={vineyardId}
                  onChange={(e) => setVineyardId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                  placeholder="Nhập ID vườn nho"
                  required
                  disabled={uploading}
                />
                <p className="mt-2 text-sm text-yellow-600">
                  ⚠️ Chưa có vineyard nào. <a href="/register-vineyard" className="text-blue-600 underline">Đăng ký vineyard</a> trước.
                </p>
              </>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
              placeholder="VD: Quy trình ủ rượu 2024"
              required
              disabled={uploading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về quy trình..."
              rows="4"
              disabled={uploading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Chọn File <span className="text-red-500">*</span>
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
              required
              disabled={uploading}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                📎 {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all ${
              uploading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-wine-600 hover:bg-wine-700 transform hover:scale-105'
            }`}
          >
            {uploading ? (
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
              '🚀 Upload lên Blockchain'
            )}
          </button>
        </form>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">📝 Lưu ý:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• File được lưu trực tiếp trên blockchain (không cần IPFS)</li>
            <li>• Giới hạn kích thước: 2MB</li>
            <li>• Phí gas phụ thuộc vào kích thước file</li>
            <li>• Dữ liệu không thể xóa sau khi lưu</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadWeb3;
