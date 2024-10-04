import { Hex } from 'viem';

import { TMetadataType } from '../../axios.responseTypes';

import { TTokenData } from './../../axios.responseTypes';

export interface ITokenLayout {
  item: TMyDiamondItemsToken;
  openModal: () => void;
  setSelectedData: (item: TMyDiamondItemsToken) => void;
}

export interface IItemsForContract {
  item: Hex;
  openModal: () => void;
  setSelectedData: (item: TMyDiamondItemsToken) => void;
}

export type TMyDiamondItemsToken = {
  blockchain: Hex | undefined;
  contract: string;
  metadata: TMetadataType | undefined;
  title: string;
  token: string;
};

export interface IMyDiamondItems {
  openModal: () => void;
  setSelectedData: (item: TMyDiamondItemsToken | TDiamondTokensType) => void;
}

export interface IMyItems {
  setIsSplashPage: (arg: boolean) => void;
  setTabIndexItems: (arg: number) => void;
  tabIndexItems: number;
}

export type TPercentageRecipient = {
  0: string;
  1: bigint;
  percentage: bigint;
  recipient: string;
};

export type TMintOffer = {
  0: string;
  1: string;
  2: bigint;
  3: TPercentageRecipient[];
  4: boolean;
  erc721Address: Hex;
  fees: TPercentageRecipient[];
  nodeAddress: string;
  rangeIndex: bigint;
  visible: boolean;
};

export type TRangeData = {
  0: bigint;
  1: bigint;
  2: bigint;
  3: bigint;
  4: bigint;
  5: bigint;
  6: string;
  lockedTokens: bigint;
  mintableTokens: bigint;
  rangeEnd: bigint;
  rangeName: string;
  rangePrice: bigint;
  rangeStart: bigint;
  tokensAllowed: bigint;
};

export type TSingleOfferData = {
  0: TMintOffer;
  1: TRangeData;
  2: bigint;
  mintOffer: TMintOffer;
  productIndex: bigint;
  rangeData: TRangeData;
};
export type TDiamondTokensType = TTokenData & {
  blockchain: Hex | undefined;
  contractAddress: Hex;
  title: string;
};
