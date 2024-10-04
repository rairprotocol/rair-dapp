import { ethers } from 'ethers';
import { Hex } from 'viem';

export interface IBatchRow {
  index: number;
  deleter: () => void;
  array: TBatchMintingItem[];
}

export interface IBatchMinting {
  name: string;
  start: string;
  end: string;
  price: string;
  batchMint: (data: TBatchMintingItem[]) => void;
}

export interface IBatchTokenSelector {
  batchMint: (tokens: number[], addresses: string[]) => void;
  max: string;
}

export interface IRange {
  tokenInstance: ethers.Contract | undefined;
  productIndex: string;
  offerIndex: number;
  rangeIndex: number;
}

export interface IERC721ManagerConsumer {
  offerInfo: TOfferInfoType;
  index: number;
  width?: number;
}

export type TBatchMintingItem = {
  address: string;
  token: number;
};

export type TOfferInfoType = {
  contractAddress: string;
  instance: ethers.Contract | undefined;
  nodeAddress: string;
  productIndex: string;
  ranges: string;
};

export type TBalanceInfo = {
  internalIndex: string;
  token: string;
};

export type TRangeInfo = {
  allowed: string;
  end: string;
  name: string;
  price: string;
  start: string;
};

export type TOffersArrayItem = {
  contractAddress: Hex;
  endingToken: string;
  lockedTokens: string;
  mintableTokens: string;
  name: string;
  offerIndex: string;
  price: bigint;
  productIndex: string;
  rangeIndex: string;
  startingToken: string;
  tokensAllowed: string;
  visible: boolean;
};

export type TAux = {
  recipient: string;
  tokenIndex: number;
};

export interface ITokenSelector {
  buyCall: (tokenIndex: string) => Promise<void>;
  max: string;
  min: string;
}
