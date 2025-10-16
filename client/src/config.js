// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://bnb-creator-backend.vercel.app' 
    : 'http://localhost:5000');

export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const BSC_CHAIN_ID = process.env.NODE_ENV === 'production' ? '0x38' : '0x61'; // Mainnet : Testnet
export const BSC_RPC_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bsc-dataseed.binance.org/' 
  : 'https://data-seed-prebsc-1-s1.binance.org:8545';

