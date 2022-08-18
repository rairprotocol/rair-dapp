import { ethers } from 'ethers';

export interface IRangeManager {
  disabled?: boolean;
  index: number;
  array: IRangesType[];
  deleter: (index: number) => void;
  sync: () => void;
  hardLimit: number;
  locker: (
    productIndex: number,
    startingToken: number,
    endingToken: number,
    lockedTokens: number
  ) => void;
  productIndex: number;
  updater: (
    offerIndex: string | undefined,
    rangeIndex: number,
    startToken: number,
    endToken: number,
    price: string,
    name: string
  ) => void;
  offerIndex: string | undefined;
}

export type ProductInfoType = {
  name: string;
  startingToken: string;
  endingToken: string;
  mintableTokensLeft: string;
  locks: number[];
};

export interface IProductManager {
  productIndex: number;
  productInfo: ProductInfoType;
  tokenInstance: ethers.Contract | undefined;
  tokenAddress: string | undefined;
}

export interface IRangesType {
  offerIndex?: string;
  endingToken: number;
  name: string;
  price: string;
  disabled?: boolean;
}

export interface IExistingLock {
  startingToken: string;
  endingToken: string;
  countToUnlock: string;
  disabled: boolean;
}

export interface IERC721Manager {
  tokenAddress: string;
}

export interface IColdData {
  startingToken: number;
  endingToken: number;
  mintableTokensLeft: number;
  productName: string;
  locks: number[];
}

export interface ITokenInfo {
  name: string;
  symbol: string;
  balance: string;
  address: string | undefined;
}

export interface IERC777Manager {
  instance?: ethers.Contract | undefined;
  account?: any;
  factoryAddress?: string;
}

export interface IErc777Data {
  balance: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface IFactoryManager {
  instance?: ethers.Contract | undefined;
  erc777Instance?: ethers.Contract | undefined;
  account?: any;
  setDeployedTokens: (tokens: string[]) => void;
}
