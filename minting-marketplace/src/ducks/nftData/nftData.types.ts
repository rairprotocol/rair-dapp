import {
  getNftDataError,
  getNftDataStart,
  getNftListTotal,
  getNftListTotalClear,
  setNftData,
  setTokenData,
  setTokenDataStart,
  setTokenDataTotalCount
} from './action';

import { TTokenData } from '../../axios.responseTypes';

export interface InitialNftDataStateType {
  loading: boolean;
  nftList: Array<TNftDataItem> | null;
  nftListTotal: number | undefined;
  itemsPerPage: number;
  errorMessage: string;
  tokenData: { [index: string]: TTokenData } | undefined;
  tokenDataListTotal: number | undefined;
}

export type TNftDataItem = {
  blockchain: BlockchainType | undefined;
  collectionIndexInContract: string;
  contract: string;
  copiesProduct: number;
  cover: string;
  id: string;
  name: string;
  offerData: Array<TOfferData>;
  productId: string;
  title: string;
  user: string;
  price?: string;
};

export type TOfferData = {
  offerIndex: string;
  offerName: string;
  price: number | bigint;
  productNumber: string;
};

export type TParamsNftDataProps = {
  type: string;
  params: TParamsNftData;
};

export type TParamsNftData = {
  itemsPerPage: number;
  currentPage: number;
  blockchain?: string;
  category?: string[];
  type?: string;
  contractTitle?: string;
};

export type TGetNftDataStartType = ReturnType<typeof getNftDataStart>;
export type TSetNftData = ReturnType<typeof setNftData>;
export type TGetNftListTotal = ReturnType<typeof getNftListTotal>;
export type TGetNftListTotalClear = ReturnType<typeof getNftListTotalClear>;
export type TGetNftDataErrorType = ReturnType<typeof getNftDataError>;
export type TSetTokenDataStart = ReturnType<typeof setTokenDataStart>;
export type TSetTokenData = ReturnType<typeof setTokenData>;
export type TSetTokenDataTotalCount = ReturnType<typeof setTokenDataTotalCount>;

export type TNftDataReducerActionType =
  | TGetNftDataStartType
  | TSetNftData
  | TGetNftListTotal
  | TGetNftListTotalClear
  | TGetNftDataErrorType
  | TSetTokenDataStart
  | TSetTokenData
  | TSetTokenDataTotalCount;
