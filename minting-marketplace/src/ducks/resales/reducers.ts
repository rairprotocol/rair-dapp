import { TResalesActions, TResalesInitialState } from './resalesDucks.types';
import * as types from './types';

const InitialState: TResalesInitialState = {
  resales: null,
  error: null,
  totalNumberResales: null,
  refresh: false,
  loading: false
};

export default function resaleStore(
  state: TResalesInitialState = InitialState,
  action: TResalesActions
): TResalesInitialState {
  switch (action.type) {
    case types.GET_RESALES_LIST_START:
      return {
        ...state,
        resales: null,
        loading: true
      };
    case types.GET_RESALES_LIST_COMPLETE:
      return {
        ...state,
        resales: action.resaleList,
        loading: false
      };
    case types.GET_RESALES_LIST_TOTAL_CLEAR:
      return {
        ...state,
        totalNumberResales: null
      };
    case types.GET_RESALES_LIST_TOTAL:
      return {
        ...state,
        loading: false,
        totalNumberResales: action.totalNumberVideo
      };
    case types.GET_RESALES_LIST_ERROR:
      return {
        ...state,
        resales: null,
        error: action.error
      };
    case types.REFRESH_RESALES_LIST:
      return {
        ...state,
        refresh: action.refresh
      };
    default:
      return state;
  }
}
