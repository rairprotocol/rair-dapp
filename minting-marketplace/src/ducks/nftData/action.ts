import { TNftDataItem } from './nftData.types';
import * as types from './types';

const getNftDataStart = () =>
  ({
    type: types.GET_NFTLIST_START
  } as const);

const setNftData = (nftList: Array<TNftDataItem>) =>
  ({
    type: types.GET_NFTLIST_COMPLETE,
    nftList
  } as const);

const getNftListTotal = (nftListTotal: number) =>
  ({
    type: types.GET_NFT_LIST_TOTAL,
    nftListTotal
  } as const);

const getNftListTotalClear = () =>
  ({
    type: types.GET_NFT_TOTAL_CLEAR
  } as const);

const getNftDataError = (errorMessage: string) =>
  ({
    type: types.GET_NFT_DATA_ERROR,
    errorMessage
  } as const);

export {
  getNftDataStart,
  setNftData,
  getNftListTotal,
  getNftListTotalClear,
  getNftDataError
};
