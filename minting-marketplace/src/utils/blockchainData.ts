import { TChainData } from './utils.types';

import {
  AstarLogo,
  /*BinanceDiamond,*/
  EthereumLogo,
  MaticLogo
} from '../images';

const chainData: TChainData = {
  // Dropped support for Binance when we migrated to Alchemy
  /*'0x38': {
    image: BinanceDiamond,
    name: 'Binance Mainnet',
    chainId: '0x38',
    symbol: 'BNB',
    addChainData: {
      chainId: '0x38',
      chainName: 'Binance Smart Chain Mainnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: ['https://bsc-dataseed1.binance.org'],
      blockExplorerUrls: ['https://www.bscscan.com/']
    }
  },
  '0x61': {
    testnet: true,
    image: BinanceDiamond,
    name: 'Binance Testnet',
    chainId: '0x61',
    symbol: 'BNB',
    addChainData: {
      chainId: '0x61',
      chainName: 'Binance Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com/']
    }
  },*/
  '0x250': {
    testnet: false,
    image: AstarLogo,
    name: 'Astar Mainnet',
    chainId: '0x250',
    symbol: 'ASTR',
    addChainData: {
      chainId: '0x250',
      chainName: 'Astar Mainnet',
      nativeCurrency: {
        name: 'ASTR',
        symbol: 'ASTR',
        decimals: 18
      },
      rpcUrls: ['https://evm.astar.network'],
      blockExplorerUrls: ['https://blockscout.com/astar']
    }
  },
  '0x89': {
    image: MaticLogo,
    name: 'Matic(Polygon) Mainnet',
    chainId: '0x89',
    symbol: 'MATIC',
    addChainData: {
      chainId: '0x89', // 0x89
      chainName: 'Matic(Polygon) Mainnet',
      nativeCurrency: {
        name: 'Matic Token',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/']
    }
  },
  '0x13881': {
    testnet: true,
    image: MaticLogo,
    name: 'Matic(Polygon) Testnet',
    chainId: '0x13881',
    symbol: 'tMATIC',
    addChainData: {
      chainId: '0x13881',
      chainName: 'Matic Testnet Mumbai',
      nativeCurrency: {
        name: 'Matic token',
        symbol: 'tMATIC',
        decimals: 18
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/']
    }
  },
  '0x1': {
    image: EthereumLogo,
    name: 'Ethereum Mainnet',
    chainId: '0x1',
    symbol: 'ETH',
    addChainData: {
      chainId: '0x1',
      chainName: 'Mainnet (Ethereum)',
      blockExplorerUrls: ['https://etherscan.io/']
    }
  },
  '0x5': {
    testnet: true,
    image: EthereumLogo,
    name: 'Ethereum Goerli',
    chainId: '0x5',
    symbol: 'ETH',
    addChainData: {
      chainId: '0x5',
      chainName: 'Goerli (Ethereum)',
      blockExplorerUrls: ['https://goerli.etherscan.io/']
    }
  }
};

export default chainData;

export const detectBlockchain = (
  currentChain: BlockchainType | undefined,
  realChain: BlockchainType | undefined
) => {
  if (
    realChain !== undefined &&
    currentChain &&
    chainData &&
    chainData[currentChain]?.chainId !== realChain
  ) {
    return {
      selectedChain: chainData[currentChain]?.name,
      realNameChain: chainData[realChain]?.name,
      selectedChainId: chainData[realChain]?.chainId
    };
  } else {
    return {
      selectedChain: null,
      realNameChain: null
    };
  }
};
