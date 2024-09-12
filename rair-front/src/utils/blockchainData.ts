import { base, mainnet, polygon, sepolia } from '@alchemy/aa-core';
import { Network } from 'alchemy-sdk';
import { Hex } from 'viem';

import { TChainData } from './utils.types';

import {
  AstarLogo,
  BaseLogo,
  EthereumLogo,
  CoreIdLogo,
  MaticLogo,
  SoniumLogo
} from '../images';

const chainData: TChainData = {
  // '0x38': {
  //   image: BinanceDiamond,
  //   name: 'Binance Mainnet',
  //   chainId: '0x38',
  //   symbol: 'BNB',
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
  //   viem: polygonMumbai,
  //   alchemy: Network.MATIC_MUMBAI,
  //   coingecko: undefined
  // },
  '0x1': {
    image: EthereumLogo,
    name: 'Ethereum Mainnet',
    chainId: '0x1',
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
    viem: base,
    alchemy: Network.BASE_MAINNET,
    coingecko: 'base',
    alchemyAppKey: import.meta.env.VITE_BASE_MAINNET_ALCHEMY_KEY,
    alchemyGasPolicy: import.meta.env.VITE_BASE_MAINNET_GAS_POLICY
  },
  '0x79a': {
    // Sonium Minato Testnet
    testnet: true,
    image: SoniumLogo,
    name: 'Minato',
    chainId: '0x79a',
    viem: undefined,
    alchemy: undefined,
    coingecko: undefined,
    alchemyAppKey: undefined,
    alchemyGasPolicy: undefined
  },
  '0x45c': {
    // Core Blockchain Mainnet
    testnet: false,
    image: CoreIdLogo,
    name: 'Core Chain MainNet',
    chainId: '0x45c',
    viem: undefined,
    alchemy: undefined,
    coingecko: undefined,
    alchemyAppKey: undefined,
    alchemyGasPolicy: undefined
  }
}

export default chainData;

export const detectBlockchain = (
  connectedChain: Hex | undefined,
  realChain: Hex | undefined
) => {
  if (
    realChain !== undefined &&
    connectedChain &&
    chainData &&
    chainData[connectedChain]?.chainId !== realChain
  ) {
    return {
      selectedChain: chainData[connectedChain]?.name,
      realNameChain: chainData[realChain]?.name,
      selectedChainId: chainData[realChain]?.chainId
    };
  } else {
    return {
      selectedChain: undefined,
      realNameChain: undefined
    };
  }
};
