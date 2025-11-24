import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractData from '../contracts/WineTraceability.json';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const HARDHAT_CHAIN_ID = '0x7a69'; // 31337 in hex
  const HARDHAT_NETWORK_CONFIG = {
    chainId: HARDHAT_CHAIN_ID,
    chainName: 'Hardhat Localhost',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrls: null
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask extension.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      // Check if on correct network
      if (network.chainId !== 31337n) {
        await switchToHardhatNetwork();
      }

      // Initialize contract
      const contractInstance = new ethers.Contract(
        contractData.address,
        contractData.abi,
        web3Signer
      );

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setChainId(Number(network.chainId));

      console.log('✅ Connected to MetaMask:', accounts[0]);
      console.log('✅ Contract:', contractData.address);
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to Hardhat network
  const switchToHardhatNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HARDHAT_CHAIN_ID }]
      });
    } catch (switchError) {
      // Network not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [HARDHAT_NETWORK_CONFIG]
          });
        } catch (addError) {
          throw new Error('Failed to add Hardhat network to MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setChainId(null);
    setError(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          if (accounts.length > 0) {
            // Re-initialize connection without full connectWallet to avoid loop
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const web3Signer = await web3Provider.getSigner();
            const contractInstance = new ethers.Contract(
              contractData.address,
              contractData.abi,
              web3Signer
            );
            
            setAccount(accounts[0]);
            setProvider(web3Provider);
            setSigner(web3Signer);
            setContract(contractInstance);
          }
        } catch (err) {
          console.error('Auto-connect failed:', err);
        }
      }
    };
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    account,
    provider,
    signer,
    contract,
    chainId,
    isConnecting,
    error,
    isConnected: !!account,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectWallet,
    disconnectWallet,
    switchToHardhatNetwork
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
