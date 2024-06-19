import { chains } from '@alchemy/aa-core';
import { Network } from 'alchemy-sdk';

export type TNativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

export type TAddChainData = {
  chainId: BlockchainType;
  chainName: string;
  nativeCurrency?: TNativeCurrency;
  rpcUrls: Array<string>;
  blockExplorerUrls: Array<string>;
};
export type TChainItemData = {
  testnet?: boolean;
  image: string;
  name: string;
  chainId: BlockchainType;
  symbol: string;
  addChainData: TAddChainData;
  disabled?: boolean;
  viem?: chains.Chain;
  alchemy?: Network;
  coingecko?: string;
  alchemyAppKey?: string;
  alchemyGasPolicy?: string;
};
export type TChainData = {
  [key in BlockchainType]?: TChainItemData;
};
