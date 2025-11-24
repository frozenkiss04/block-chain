import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

const ConnectWallet = () => {
  const {
    account,
    isConnected,
    isConnecting,
    error,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet
  } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">MetaMask Not Installed</p>
        <p className="text-sm">Please install MetaMask to use this dApp.</p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          Download MetaMask
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={connectWallet}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-wine-600 text-white px-6 py-2 rounded-lg hover:bg-wine-700 transition font-semibold disabled:opacity-50"
        >
          {isConnecting ? '🔄 Connecting...' : '🦊 Connect MetaMask'}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-sm">{formatAddress(account)}</span>
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
