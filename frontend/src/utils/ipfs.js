import axios from 'axios';

const IPFS_API_URL = 'http://127.0.0.1:5001';
const IPFS_GATEWAY_URL = 'http://127.0.0.1:8080';

/**
 * Upload file to IPFS
 */
export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${IPFS_API_URL}/api/v0/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.Hash;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS: ' + error.message);
  }
};

/**
 * Get IPFS file URL
 */
export const getIPFSUrl = (cid) => {
  return `${IPFS_GATEWAY_URL}/ipfs/${cid}`;
};

/**
 * Check IPFS connection
 */
export const checkIPFSConnection = async () => {
  try {
    const response = await axios.post(`${IPFS_API_URL}/api/v0/version`);
    return response.data;
  } catch (error) {
    console.error('IPFS connection error:', error);
    return null;
  }
};
