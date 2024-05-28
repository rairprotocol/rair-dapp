import { BigNumber } from 'ethers';

import { TMetadataType } from '../../axios.responseTypes';

import { TTokenData } from './../../axios.responseTypes';

export interface ITokenLayout {
  item: TMyDiamondItemsToken;
  openModal: () => void;
  setSelectedData: (item: TMyDiamondItemsToken) => void;
}

export interface IItemsForContract {
  item: string;
  openModal: () => void;
  setSelectedData: (item: TMyDiamondItemsToken) => void;
}

export type TMyDiamondItemsToken = {
  blockchain: BlockchainType | undefined;
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
  userData: object;
  goHome: () => void;
  setIsSplashPage: (arg: boolean) => void;
  setTabIndexItems: (arg: number) => void;
  tabIndexItems: number;
}

export type TPercentageRecipient = {
  0: string;
  1: BigNumber;
  percentage: BigNumber;
  recipient: string;
};

export type TMintOffer = {
  0: string;
  1: string;
  2: BigNumber;
  3: TPercentageRecipient[];
  4: boolean;
  erc721Address: string;
  fees: TPercentageRecipient[];
  nodeAddress: string;
  rangeIndex: BigNumber;
  visible: boolean;
};

export type TRangeData = {
  0: BigNumber;
  1: BigNumber;
  2: BigNumber;
  3: BigNumber;
  4: BigNumber;
  5: BigNumber;
  6: string;
  lockedTokens: BigNumber;
  mintableTokens: BigNumber;
  rangeEnd: BigNumber;
  rangeName: string;
  rangePrice: BigNumber;
  rangeStart: BigNumber;
  tokensAllowed: BigNumber;
};

export type TSingleOfferData = {
  0: TMintOffer;
  1: TRangeData;
  2: BigNumber;
  mintOffer: TMintOffer;
  productIndex: BigNumber;
  rangeData: TRangeData;
};
export type TDiamondTokensType = TTokenData & {
  blockchain: BlockchainType | undefined;
  contractAddress: string;
  title: string;
};
