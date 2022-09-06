import {
  InitialNftDataStateType,
  TNftDataReducerActionType
} from './nftData.types';
import * as types from './types';

const InitialState: InitialNftDataStateType = {
  loading: false,
  nftList: null,
  nftListTotal: undefined,
  itemsPerPage: 20,
  errorMessage: '',
  tokenData: null
};

export default function nftDataStore(
  state: InitialNftDataStateType = InitialState,
  action: TNftDataReducerActionType
): InitialNftDataStateType {
  switch (action.type) {
    case types.GET_NFTLIST_START:
      return {
        ...state,
        loading: true,
        nftList: null
      };

    case types.GET_NFTLIST_COMPLETE:
      return {
        ...state,
        loading: false,
        nftList: action.nftList
      };

    case types.GET_NFT_TOTAL_CLEAR:
      return {
        ...state,
        nftListTotal: undefined
      };

    case types.GET_NFT_LIST_TOTAL:
      return {
        ...state,
        loading: false,
        nftListTotal: action.nftListTotal
      };

    case types.GET_NFT_DATA_ERROR:
      return {
        ...state,
        loading: false,
        nftList: null,
        errorMessage: action.errorMessage
      };

    case types.SET_TOKEN_DATA_START: {
      return {
        ...state,
        loading: true,
        tokenData: null
      };
    }

    case types.SET_TOKEN_DATA: {
      return {
        ...state,
        loading: false,
        tokenData: action.tokenData
      };
    }

    default:
      return state;
  }
}
