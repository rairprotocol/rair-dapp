import { Chain } from '@alchemy/aa-core/node_modules/viem/_types/chains/index';
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
  viem?: Chain;
  alchemy?: Network;
  coingecko?: string;
};
export type TChainData = {
  [key in BlockchainType]?: TChainItemData;
};
