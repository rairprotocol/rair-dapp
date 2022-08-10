import { TTokenData } from '../../axios.responseTypes';
import {
  getNftDataError,
  getNftDataStart,
  getNftListTotal,
  getNftListTotalClear,
  setNftData,
  setTokenData
} from './action';

export interface InitialNftDataStateType {
  loading: boolean;
  nftList: Array<TNftDataItem> | null;
  nftListTotal: number | undefined;
  itemsPerPage: number;
  errorMessage: string;
  tokenData: TTokenData[];
}

export type TNftDataItem = {
  blockchain: string;
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
  category?: string;
  type?: string;
};

export type TGetNftDataStartType = ReturnType<typeof getNftDataStart>;
export type TSetNftData = ReturnType<typeof setNftData>;
export type TGetNftListTotal = ReturnType<typeof getNftListTotal>;
export type TGetNftListTotalClear = ReturnType<typeof getNftListTotalClear>;
export type TGetNftDataErrorType = ReturnType<typeof getNftDataError>;
export type TSetTokenData = ReturnType<typeof setTokenData>;

export type TNftDataReducerActionType =
  | TGetNftDataStartType
  | TSetNftData
  | TGetNftListTotal
  | TGetNftListTotalClear
  | TGetNftDataErrorType
  | TSetTokenData;
