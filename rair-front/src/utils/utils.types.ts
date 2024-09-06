import { chains } from '@alchemy/aa-core';
import { Network } from 'alchemy-sdk';
import { Hex } from 'viem';

export type TNativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

export type TChainItemData = {
  testnet?: boolean;
  image: string;
  name: string;
  chainId: Hex;
  disabled?: boolean;
  viem?: chains.Chain;
  alchemy?: Network;
  coingecko?: string;
  alchemyAppKey?: string;
  alchemyGasPolicy?: string;
};
export type TChainData = {
  [key in Hex]?: TChainItemData;
};
