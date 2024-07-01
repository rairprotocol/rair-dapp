import { TNftDataItem } from './nftData.types';
import * as types from './types';

import { TTokenData } from '../../axios.responseTypes';

const getNftDataStart = () =>
  ({
    type: types.GET_NFTLIST_START
  }) as const;

const getNftDataStartWithParams = (params: object) =>
  ({
    type: types.GET_NFTLIST_START,
    params
  }) as const;

const setNftData = (nftList: Array<TNftDataItem>) =>
  ({
    type: types.GET_NFTLIST_COMPLETE,
    nftList
  }) as const;

const getNftListTotal = (nftListTotal: number) =>
  ({
    type: types.GET_NFT_LIST_TOTAL,
    nftListTotal
  }) as const;

const getNftListTotalClear = () =>
  ({
    type: types.GET_NFT_TOTAL_CLEAR
  }) as const;

const getNftDataError = (errorMessage: string) =>
  ({
    type: types.GET_NFT_DATA_ERROR,
    errorMessage
  }) as const;

const setTokenDataStart = () =>
  ({
    type: types.SET_TOKEN_DATA_START
  }) as const;

const setTokenData = (tokenData: { [index: string]: TTokenData }) =>
  ({ type: types.SET_TOKEN_DATA, tokenData }) as const;

const setTokenDataTotalCount = (tokenDataListTotal) =>
  ({ type: types.SET_TOKEN_DATA_TOTAL_COUNT, tokenDataListTotal }) as const;

export {
  getNftDataError,
  getNftDataStart,
  getNftDataStartWithParams,
  getNftListTotal,
  getNftListTotalClear,
  setNftData,
  setTokenData,
  setTokenDataStart,
  setTokenDataTotalCount
};
