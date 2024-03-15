import { goerli, mainnet, polygon, polygonMumbai } from '@alchemy/aa-core';
import { Network } from 'alchemy-sdk';

import { TChainData } from './utils.types';

import { AstarLogo, BinanceDiamond, EthereumLogo, MaticLogo } from '../images';

const chainData: TChainData = {
  '0x38': {
    image: BinanceDiamond,
    name: 'Binance Mainnet',
    oreIdAlias: undefined,
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
    },
    disabled: true,
    viem: undefined,
    alchemy: undefined,
    coingecko: undefined
  },
  '0x61': {
    testnet: true,
    image: BinanceDiamond,
    oreIdAlias: undefined,
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
    },
    disabled: true,
    viem: undefined,
    alchemy: undefined,
    coingecko: undefined
  },
  '0x250': {
    testnet: false,
    image: AstarLogo,
    name: 'Astar Mainnet',
    oreIdAlias: undefined,
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
    },
    viem: undefined,
    alchemy: Network.ASTAR_MAINNET,
    coingecko: 'astar'
  },
  '0x89': {
    image: MaticLogo,
    name: 'Matic(Polygon) Mainnet',
    oreIdAlias: 'polygon_main',
    chainId: '0x89',
    symbol: 'MATIC',
    addChainData: {
      chainId: '0x89',
      chainName: 'Matic(Polygon) Mainnet',
      nativeCurrency: {
        name: 'Matic Token',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/']
    },
    viem: polygon,
    alchemy: Network.MATIC_MAINNET,
    coingecko: 'matic-network'
  },
  '0x13881': {
    testnet: true,
    image: MaticLogo,
    name: 'Matic(Polygon) Testnet',
    oreIdAlias: 'polygon_mumbai',
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
      rpcUrls: ['https://rpc-mumbai.polygon.technology/'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/']
    },
    viem: polygonMumbai,
    alchemy: Network.MATIC_MUMBAI,
    coingecko: undefined
  },
  '0x1': {
    image: EthereumLogo,
    name: 'Ethereum Mainnet',
    oreIdAlias: 'eth_main',
    chainId: '0x1',
    symbol: 'ETH',
    addChainData: {
      chainId: '0x1',
      chainName: 'Mainnet (Ethereum)',
      rpcUrls: ['https://eth.llamarpc.com'],
      blockExplorerUrls: ['https://etherscan.io/']
    },
    viem: mainnet,
    alchemy: Network.ETH_MAINNET,
    coingecko: 'ethereum'
  },
  '0x5': {
    testnet: true,
    image: EthereumLogo,
    name: 'Ethereum Goerli',
    oreIdAlias: 'eth_goerli',
    chainId: '0x5',
    symbol: 'ETH',
    addChainData: {
      chainId: '0x5',
      chainName: 'Goerli (Ethereum)',
      rpcUrls: ['https://ethereum-goerli.publicnode.com'],
      blockExplorerUrls: ['https://goerli.etherscan.io/']
    },
    viem: goerli,
    alchemy: Network.ETH_GOERLI,
    coingecko: undefined
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
