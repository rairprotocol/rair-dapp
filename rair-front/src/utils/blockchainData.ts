import { base, mainnet, polygon, sepolia } from '@alchemy/aa-core';
import { Network } from 'alchemy-sdk';

import { TChainData } from './utils.types';

import { AstarLogo, BaseLogo, EthereumLogo, MaticLogo } from '../images';

const chainData: TChainData = {
  // '0x38': {
  //   image: BinanceDiamond,
  //   name: 'Binance Mainnet',
  //   chainId: '0x38',
  //   symbol: 'BNB',
  //   addChainData: {
  //     chainId: '0x38',
  //     chainName: 'Binance Smart Chain Mainnet',
  //     nativeCurrency: {
  //       name: 'BNB',
  //       symbol: 'BNB',
  //       decimals: 18
  //     },
  //     rpcUrls: ['https://bsc-dataseed1.binance.org'],
  //     blockExplorerUrls: ['https://www.bscscan.com/']
  //   },
  //   disabled: true,
  //   viem: undefined,
  //   alchemy: undefined,
  //   coingecko: undefined
  // },
  // '0x61': {
  //   testnet: true,
  //   image: BinanceDiamond,
  //   name: 'Binance Testnet',
  //   chainId: '0x61',
  //   symbol: 'BNB',
  //   addChainData: {
  //     chainId: '0x61',
  //     chainName: 'Binance Testnet',
  //     nativeCurrency: {
  //       name: 'BNB',
  //       symbol: 'BNB',
  //       decimals: 18
  //     },
  //     rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  //     blockExplorerUrls: ['https://testnet.bscscan.com/']
  //   },
  //   disabled: true,
  //   viem: undefined,
  //   alchemy: undefined,
  //   coingecko: undefined
  // },
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
      blockExplorerUrls: ['https://astar.blockscout.com/']
    },
    viem: undefined,
    alchemy: Network.ASTAR_MAINNET,
    coingecko: 'astar',
    alchemyAppKey: import.meta.env.VITE_ASTAR_MAINNET_ALCHEMY_KEY,
    alchemyGasPolicy: import.meta.env.VITE_ASTAR_MAINNET_GAS_POLICY
  },
  '0x89': {
    image: MaticLogo,
    name: 'Matic(Polygon) Mainnet',
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
    coingecko: 'matic-network',
    alchemyAppKey: import.meta.env.VITE_MATIC_MAINNET_ALCHEMY_KEY,
    alchemyGasPolicy: import.meta.env.VITE_MATIC_MAINNET_GAS_POLICY
  },
  // '0x13881': {
  //   testnet: true,
  //   image: MaticLogo,
  //   name: 'Matic(Polygon) Testnet',
  //   chainId: '0x13881',
  //   symbol: 'tMATIC',
  //   addChainData: {
  //     chainId: '0x13881',
  //     chainName: 'Matic Testnet Mumbai',
  //     nativeCurrency: {
  //       name: 'Matic token',
  //       symbol: 'tMATIC',
  //       decimals: 18
  //     },
  //     rpcUrls: ['https://rpc-mumbai.polygon.technology/'],
  //     blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  //   },
  //   viem: polygonMumbai,
  //   alchemy: Network.MATIC_MUMBAI,
  //   coingecko: undefined
  // },
  '0x1': {
    image: EthereumLogo,
    name: 'Ethereum Mainnet',
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
    coingecko: 'ethereum',
    alchemyAppKey: import.meta.env.VITE_ETH_MAINNET_ALCHEMY_KEY,
    alchemyGasPolicy: import.meta.env.VITE_ETH_MAINNET_GAS_POLICY
  },
  '0xaa36a7': {
    testnet: true,
    image: EthereumLogo,
    name: 'Ethereum Sepolia',
    chainId: '0xaa36a7',
    symbol: 'Sepolia ETH',
    addChainData: {
      chainId: '0xaa36a7',
      chainName: 'Sepolia (Ethereum)',
      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
      rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com']
    },
    viem: sepolia,
    alchemy: Network.ETH_SEPOLIA,
    coingecko: undefined,
    alchemyAppKey: import.meta.env.VITE_ETH_SEPOLIA_ALCHEMY_KEY,
    alchemyGasPolicy: import.meta.env.VITE_ETH_SEPOLIA_GAS_POLICY
  },
  // '0x5': {
  //   testnet: true,
  //   image: EthereumLogo,
  //   name: 'Ethereum Goerli',
  //   chainId: '0x5',
  //   symbol: 'Goerli ETH',
  //   addChainData: {
  //     chainId: '0x5',
  //     chainName: 'Goerli (Ethereum)',
  //     rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
  //     blockExplorerUrls: ['https://sepolia.etherscan.io/']
  //   },
  //   viem: mainnet,
  //   alchemy: Network.ETH_SEPOLIA,
  //   coingecko: undefined
  // },
  '0x2105': {
    // Base Mainnet
    testnet: false,
    image: BaseLogo,
    name: 'Base Mainnet',
    chainId: '0x2105',
    symbol: 'bETH',
    addChainData: {
      chainId: '0x2105',
      chainName: 'Base',
      rpcUrls: ['https://mainnet.base.org'],
      blockExplorerUrls: ['https://basescan.org/']
    },
    viem: base,
    alchemy: Network.BASE_MAINNET,
    coingecko: 'base',
    alchemyAppKey: import.meta.env.VITE_BASE_MAINNET_ALCHEMY_KEY,
    alchemyGasPolicy: import.meta.env.VITE_BASE_MAINNET_GAS_POLICY
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
