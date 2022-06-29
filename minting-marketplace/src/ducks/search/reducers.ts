import { TSeacrhActionsType, TSearchInitialState } from './search.types';
import * as types from './types';

const InitialState: TSearchInitialState = {
  titleSearchDemo: '',
  dataAll: null,
  message: '',
  loading: null
};

export default function allInformationFromSearch(
  state: TSearchInitialState = InitialState,
  action: TSeacrhActionsType
): TSearchInitialState {
  switch (action.type) {
    case types.GET_DATA_ALL_START:
      return {
        ...state,
        dataAll: null,
        loading: true,
        message: '',
        titleSearchDemo: action.titleSearchDemo
      };
    case types.GET_DATA_ALL_COMPLETE:
      return {
        ...state,
        dataAll: action.data,
        loading: false,
        message: ''
      };
    case types.GET_DATA_ALL_CLEAR:
      return {
        ...state,
        dataAll: null,
        loading: false,
        message: ''
      };
    case types.GET_DATA_ALL_EMPTY:
      return {
        ...state,
        dataAll: null,
        loading: false,
        message: action.message
      };
    default:
      return state;
  }
}
