import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import CreatorPlatformABI from '../contracts/CreatorPlatform.json';
import { CONTRACT_ADDRESS, BSC_CHAIN_ID } from '../config';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);

  // Подключение кошелька
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Install MetaMask to continue');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);

      // Request connection
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check network
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (currentChainId !== BSC_CHAIN_ID) {
        await switchToBSC();
      }

      // Initialize provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      // Initialize contract
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CreatorPlatformABI,
        web3Signer
      );

      // Get balance
      const accountBalance = await web3Provider.getBalance(address);
      const formattedBalance = ethers.formatEther(accountBalance);

      setAccount(address);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setBalance(formattedBalance);
      setChainId(currentChainId);

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Error connecting wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Переключение на BSC
  const switchToBSC = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      });
    } catch (error) {
      // Если сеть не добавлена, добавляем её
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BSC_CHAIN_ID,
                chainName: 'BSC Testnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                blockExplorerUrls: ['https://testnet.bscscan.com'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding BSC network:', addError);
          throw addError;
        }
      } else {
        throw error;
      }
    }
  };

  // Отключение кошелька
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setBalance('0');
    toast.info('Wallet disconnected');
  };

  // Создание кампании
  const createCampaign = async (metadataURI, budgetInBNB) => {
    if (!contract) {
      toast.error('Connect wallet');
      return null;
    }

    try {
      const budgetWei = ethers.parseEther(budgetInBNB.toString());
      
      const tx = await contract.createCampaign(metadataURI, {
        value: budgetWei,
      });

      toast.info('Transaction sent...');
      const receipt = await tx.wait();

      // Get campaign ID from events
      const event = receipt.logs.find(
        (log) => log.topics[0] === ethers.id('CampaignCreated(uint256,address,uint256,uint256)')
      );

      if (event) {
        const campaignId = parseInt(event.topics[1], 16);
        toast.success('Campaign created successfully!');
        return campaignId;
      }

      return null;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Error creating campaign');
      return null;
    }
  };

  // Создание выплаты
  const createPayout = async (campaignId, creatorAddress, amountInBNB) => {
    if (!contract) {
      toast.error('Connect wallet');
      return null;
    }

    try {
      const amountWei = ethers.parseEther(amountInBNB.toString());
      
      const tx = await contract.createPayout(campaignId, creatorAddress, amountWei);

      toast.info('Transaction sent...');
      const receipt = await tx.wait();

      toast.success('Payout created!');
      return receipt;
    } catch (error) {
      console.error('Error creating payout:', error);
      toast.error('Error creating payout');
      return null;
    }
  };

  // Завершение выплаты
  const completePayout = async (payoutId) => {
    if (!contract) {
      toast.error('Connect wallet');
      return null;
    }

    try {
      const tx = await contract.completePayout(payoutId);

      toast.info('Transaction sent...');
      const receipt = await tx.wait();

      toast.success('Payout completed!');
      return receipt;
    } catch (error) {
      console.error('Error completing payout:', error);
      toast.error('Error completing payout');
      return null;
    }
  };

  // Закрытие кампании
  const closeCampaign = async (campaignId) => {
    if (!contract) {
      toast.error('Connect wallet');
      return null;
    }

    try {
      const tx = await contract.closeCampaign(campaignId);

      toast.info('Transaction sent...');
      const receipt = await tx.wait();

      toast.success('Campaign closed!');
      return receipt;
    } catch (error) {
      console.error('Error closing campaign:', error);
      toast.error('Error closing campaign');
      return null;
    }
  };

  // Слушатели событий
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [connectWallet]);

  const value = {
    account,
    provider,
    signer,
    contract,
    balance,
    chainId,
    isConnecting,
    connectWallet,
    disconnectWallet,
    createCampaign,
    createPayout,
    completePayout,
    closeCampaign,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

